import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { 
  City, 
  WeatherData, 
  TimeSlot, 
  TempRange, 
  Templates 
} from './interfaces/city.interface';
import { 
  MusicRecommendation, 
  YouTubeSearchResult, 
  YouTubeVideo,
  GenreRules 
} from './interfaces/music-recommendation.interface';

@Injectable()
export class MusicRecommendationService {
  private readonly logger = new Logger(MusicRecommendationService.name);
  private templates: Templates;
  private genreRules: GenreRules;

  constructor(private configService: ConfigService) {
    this.loadTemplates();
    this.loadGenreRules();
  }

  private loadTemplates(): void {
    this.templates = {
      cities: [
        { id: 1, name: "Paris", iso: "FR", lat: 48.8566, lon: 2.3522 },
        { id: 2, name: "Venice", iso: "IT", lat: 45.4408, lon: 12.3155 },
        { id: 3, name: "Santorini", iso: "GR", lat: 36.3932, lon: 25.4615 },
        { id: 4, name: "New York", iso: "US", lat: 40.7128, lon: -74.0060 },
        { id: 5, name: "Barcelona", iso: "ES", lat: 41.3874, lon: 2.1686 },
        { id: 6, name: "Tokyo", iso: "JP", lat: 35.6895, lon: 139.6917 },
        { id: 7, name: "London", iso: "GB", lat: 51.5074, lon: -0.1278 },
        { id: 8, name: "Prague", iso: "CZ", lat: 50.0755, lon: 14.4378 },
        { id: 9, name: "Budapest", iso: "HU", lat: 47.4979, lon: 19.0402 },
        { id: 10, name: "Brooklyn", iso: "US", lat: 40.6782, lon: -73.9442 }
      ],
      weather_map: { 
        "Clear": "☀️", 
        "Clouds": "☁️", 
        "Rain": "🌧️", 
        "Drizzle": "🌧️",
        "Snow": "❄️", 
        "Thunderstorm": "⚡", 
        "Extreme": "💨" 
      },
      temp_map: [
        { min: 28, max: 99, emoji: "🔥", tag: "hot" },
        { min: 16, max: 27, emoji: "🌿", tag: "mild" },
        { min: -50, max: 15, emoji: "❄️", tag: "cold" }
      ],
      time_map: [
        { start: 6, end: 10, emoji: "🌅", tag: "morning" },
        { start: 10, end: 13, emoji: "☀️", tag: "day" },
        { start: 13, end: 16, emoji: "🌤", tag: "afternoon" },
        { start: 16, end: 21, emoji: "🌇", tag: "evening" },
        { start: 21, end: 24, emoji: "🌙", tag: "night" },
        { start: 0, end: 6, emoji: "🌌", tag: "dawn" }
      ]
    };
  }

  private loadGenreRules(): void {
    this.genreRules = {
      genre_rules: [
        { weather_emoji: "☀️", time_tags: ["morning", "day"], genre: "Summer Pop / Chill Pop" },
        { weather_emoji: "☀️", time_tags: ["evening", "night"], genre: "City Pop / Indie Rock" },
        { weather_emoji: "☁️", time_tags: ["*"], genre: "Indie Folk / Dreamy Jazz" },
        { weather_emoji: "🌧️", time_tags: ["*"], genre: "Lo-Fi Hip-hop / Rainy Jazz" },
        { weather_emoji: "❄️", time_tags: ["*"], genre: "Piano Ballad / Acoustic" },
        { weather_emoji: "⚡", time_tags: ["dawn"], genre: "Ambient Electronica" },
        { weather_emoji: "💨", time_tags: ["day"], genre: "Upbeat Alt-Rock" },
        { weather_emoji: "☀️", time_tags: ["afternoon"], genre: "Tropical House / Dance Pop" },
        { weather_emoji: "🌧️", time_tags: ["night"], genre: "Dark Ambient / Synthwave" },
        { weather_emoji: "❄️", time_tags: ["morning"], genre: "Classical Piano / Orchestral" },
        { weather_emoji: "☁️", time_tags: ["evening"], genre: "Smooth Jazz / Bossa Nova" },
        { weather_emoji: "⚡", time_tags: ["night"], genre: "Electronic Rock / Industrial" },
        { weather_emoji: "💨", time_tags: ["evening"], genre: "Alternative Rock / Grunge" }
      ],
      temp_corrections: [
        { temp_tag: "hot", base_genre: "Lo-Fi", corrected_genre: "Tropical House" },
        { temp_tag: "cold", base_genre_pattern: "Pop", corrected_genre: "Acoustic Pop" },
        { temp_tag: "hot", base_genre_pattern: "Jazz", corrected_genre: "Cool Jazz" },
        { temp_tag: "cold", base_genre_pattern: "Rock", corrected_genre: "Post-Rock" }
      ],
      default_genre: "Chill Music"
    };
  }

  async getRecommendation(): Promise<MusicRecommendation> {
    try {
      // 1. 랜덤 도시 선택
      const city = this.pickRandomCity();
      
      // API 키가 없으면 기본값 반환
      const openWeatherApiKey = this.configService.get<string>('OPENWEATHER_API_KEY');
      const youtubeApiKey = this.configService.get<string>('YOUTUBE_API_KEY');
      
      if (!openWeatherApiKey || !youtubeApiKey) {
        this.logger.warn('API keys not configured, returning default recommendation');
        return this.getDefaultRecommendation(city);
      }
      
      // 2. 날씨 정보 가져오기
      const weatherData = await this.fetchWeather(city.lat, city.lon);
      
      // 3. 시간대 계산
      const timeSlot = this.deriveTimeSlot(weatherData.timezone_offset);
      
      // 4. 날씨 이모지 매핑
      const weatherEmoji = this.mapWeatherEmoji(weatherData.weatherMain);
      
      // 5. 온도 매핑
      const tempInfo = this.mapTemp(weatherData.feels_like);
      
      // 6. 장르 결정
      const genre = this.pickGenre(weatherEmoji, timeSlot.tag, tempInfo.tag);
      
      // 7. YouTube 플레이리스트 검색
      const query = this.buildQuery(city.name, weatherEmoji, timeSlot.tag, genre);
      const playlist = await this.searchPlaylist(query);
      
      // 8. 비디오 목록 가져오기
      const videos = await this.loadVideos(playlist.playlistId);
      
      // 9. 랜덤 비디오 선택
      const selectedVideo = this.randomPick(videos);
      
      // 10. 이모지 문구 생성
      const emoji = `${weatherEmoji} ${timeSlot.emoji} ${tempInfo.emoji} in ${city.name}...`;
      
      return {
        city: city.name,
        emoji,
        genre,
        youtubeUrl: `https://www.youtube.com/embed/${selectedVideo.videoId}`
      };
    } catch (error) {
      this.logger.error('Failed to get recommendation:', error);
      // 에러 발생 시 기본값 반환
      const city = this.pickRandomCity();
      return this.getDefaultRecommendation(city);
    }
  }

  private getDefaultRecommendation(city: City): MusicRecommendation {
    // 랜덤 시간대 선택 (UTC 기준으로 랜덤 시간 생성)
    const randomHour = Math.floor(Math.random() * 24);
    const randomTimeSlot = this.deriveTimeSlotFromHour(randomHour);
    
    // 랜덤 날씨 선택
    const weatherOptions = Object.values(this.templates.weather_map);
    const weatherEmoji = this.randomPick(weatherOptions);
    
    // 랜덤 온도 선택
    const tempOptions = this.templates.temp_map;
    const tempInfo = this.randomPick(tempOptions);
    
    // 랜덤 장르 선택
    const genre = this.pickGenre(weatherEmoji, randomTimeSlot.tag, tempInfo.tag);
    
    const emoji = `${weatherEmoji} ${randomTimeSlot.emoji} ${tempInfo.emoji} in ${city.name}...`;
    
    // 다양한 기본 YouTube 영상들 - 다양한 장르 포함
    const defaultVideos = [
      // Lo-Fi & Chill
      'https://www.youtube.com/embed/jfKfPfyJRdk?si=abc123', // Lofi Girl
      'https://www.youtube.com/embed/rUxyKA_-grg?si=def456', // Chill Beats
      'https://www.youtube.com/embed/7NOSDKb0HlU?si=jkl012', // Ambient
      'https://www.youtube.com/embed/4xDzrJKXOOY?si=mno345', // Study Music
      'https://www.youtube.com/embed/0xs-oaSZdqE?si=pqr678', // Relaxing
      
      // Jazz & Classical
      'https://www.youtube.com/embed/5yx6BWlEVcY?si=ghi789', // Jazz Vibes
      'https://www.youtube.com/embed/8iA5OJCLnQ0?si=vwx234', // Piano
      'https://www.youtube.com/embed/9bZkp7q19f0?si=yzA567', // Classical
      'https://www.youtube.com/embed/1-0eZytv6Qk?si=stu901', // Nature Sounds
      
      // Pop & Rock
      'https://www.youtube.com/embed/edbIsqPlJ8w?si=5gW_M3L07jUtOznr', // Pop Hits
      'https://www.youtube.com/embed/dQw4w9WgXcQ?si=pop123', // Classic Rock
      'https://www.youtube.com/embed/ZZ5LpwO-An4?si=rock456', // Alternative
      
      // Electronic & Dance
      'https://www.youtube.com/embed/2Vv-BfVoq4g?si=edm789', // EDM
      'https://www.youtube.com/embed/09R8_2nJtjg?si=house012', // House
      'https://www.youtube.com/embed/1-0eZytv6Qk?si=ambient345', // Ambient Electronic
      
      // World & Folk
      'https://www.youtube.com/embed/ZZ5LpwO-An4?si=folk678', // Folk
      'https://www.youtube.com/embed/1-0eZytv6Qk?si=world901', // World Music
      'https://www.youtube.com/embed/8iA5OJCLnQ0?si=acoustic234', // Acoustic
      
      // Hip-Hop & R&B
      'https://www.youtube.com/embed/09R8_2nJtjg?si=hiphop567', // Hip-Hop
      'https://www.youtube.com/embed/2Vv-BfVoq4g?si=rnb890', // R&B
      'https://www.youtube.com/embed/dQw4w9WgXcQ?si=rap123', // Rap
      
      // Indie & Alternative
      'https://www.youtube.com/embed/ZZ5LpwO-An4?si=indie456', // Indie
      'https://www.youtube.com/embed/09R8_2nJtjg?si=alt789', // Alternative
      'https://www.youtube.com/embed/1-0eZytv6Qk?si=experimental012' // Experimental
    ];
    
    const randomVideo = this.randomPick(defaultVideos);
    
    return {
      city: city.name,
      emoji,
      genre,
      youtubeUrl: randomVideo
    };
  }

  // 랜덤 시간대를 생성하는 헬퍼 함수
  private deriveTimeSlotFromHour(hour: number): TimeSlot {
    for (const timeSlot of this.templates.time_map) {
      if (hour >= timeSlot.start && hour < timeSlot.end) {
        return timeSlot;
      }
    }
    // dawn 시간대 처리 (0-6시)
    return this.templates.time_map[5];
  }

  private pickRandomCity(): City {
    return this.randomPick(this.templates.cities);
  }

  private async fetchWeather(lat: number, lon: number): Promise<WeatherData> {
    const apiKey = this.configService.get<string>('OPENWEATHER_API_KEY');
    if (!apiKey) {
      throw new Error('OpenWeather API key not configured');
    }

    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    
    try {
      const response = await axios.get(url);
      const data = response.data;
      
      return {
        weatherMain: data.current.weather[0].main,
        feels_like: data.current.feels_like,
        timezone_offset: data.timezone_offset
      };
    } catch (error) {
      this.logger.error('Failed to fetch weather:', error);
      throw new Error('Failed to fetch weather data');
    }
  }

  private deriveTimeSlot(timezoneOffset: number): TimeSlot {
    const nowUTC = new Date();
    const localTime = new Date(nowUTC.getTime() + timezoneOffset * 1000);
    const hour = localTime.getHours();

    for (const timeSlot of this.templates.time_map) {
      if (hour >= timeSlot.start && hour < timeSlot.end) {
        return timeSlot;
      }
    }

    // dawn 시간대 처리 (0-6시)
    return this.templates.time_map[5];
  }

  private mapWeatherEmoji(weatherMain: string): string {
    return this.templates.weather_map[weatherMain] || '☀️';
  }

  private mapTemp(feels_like: number): { emoji: string; tag: string } {
    for (const tempRange of this.templates.temp_map) {
      if (feels_like >= tempRange.min && feels_like <= tempRange.max) {
        return { emoji: tempRange.emoji, tag: tempRange.tag };
      }
    }
    return { emoji: '🌿', tag: 'mild' };
  }

  private pickGenre(weatherEmoji: string, timeTag: string, tempTag: string): string {
    // 기본 장르 찾기
    let genre = this.genreRules.default_genre;
    
    for (const rule of this.genreRules.genre_rules) {
      if (rule.weather_emoji === weatherEmoji) {
        if (rule.time_tags.includes('*') || rule.time_tags.includes(timeTag)) {
          genre = rule.genre;
          break;
        }
      }
    }

    // 온도 보정 적용
    for (const correction of this.genreRules.temp_corrections) {
      if (correction.temp_tag === tempTag) {
        if (correction.base_genre && genre.includes(correction.base_genre)) {
          genre = correction.corrected_genre;
          break;
        }
        if (correction.base_genre_pattern && genre.includes(correction.base_genre_pattern)) {
          genre = correction.corrected_genre;
          break;
        }
      }
    }

    return genre;
  }

  private buildQuery(city: string, weatherEmoji: string, timeTag: string, genre: string): string {
    const weatherEn: Record<string, string> = {
      '☀️': 'sunny', '☁️': 'cloudy', '🌧️': 'rainy',
      '❄️': 'snowy', '⚡': 'storm', '💨': 'windy'
    };

    const timeEn: Record<string, string> = {
      'morning': 'morning', 'day': 'day', 'afternoon': 'afternoon',
      'evening': 'sunset', 'night': 'night', 'dawn': 'late night'
    };

    const weatherKeyword = weatherEn[weatherEmoji] || 'chill';
    const timeKeyword = timeEn[timeTag] || 'chill';
    const genreKeyword = genre.split(' / ')[0].toLowerCase().replace(/\s+/g, ' ');

    return `${city} ${weatherKeyword} ${timeKeyword} ${genreKeyword} playlist`;
  }

  private async searchPlaylist(query: string): Promise<YouTubeSearchResult> {
    const apiKey = this.configService.get<string>('YOUTUBE_API_KEY');
    if (!apiKey) {
      throw new Error('YouTube API key not configured');
    }

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=playlist&q=${encodeURIComponent(query)}&maxResults=5&key=${apiKey}`;
    
    try {
      const response = await axios.get(url);
      const items = response.data.items;
      
      if (!items || items.length === 0) {
        throw new Error('No playlists found');
      }

      const randomPlaylist = this.randomPick(items) as any;
      return {
        playlistId: randomPlaylist.id.playlistId,
        title: randomPlaylist.snippet.title
      };
    } catch (error) {
      this.logger.error('Failed to search playlist:', error);
      throw new Error('Failed to search YouTube playlist');
    }
  }

  private async loadVideos(playlistId: string): Promise<YouTubeVideo[]> {
    const apiKey = this.configService.get<string>('YOUTUBE_API_KEY');
    if (!apiKey) {
      throw new Error('YouTube API key not configured');
    }

    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${apiKey}`;
    
    try {
      const response = await axios.get(url);
      const items = response.data.items;
      
      if (!items || items.length === 0) {
        throw new Error('No videos found in playlist');
      }

      return items.map(item => ({
        videoId: item.snippet.resourceId.videoId,
        title: item.snippet.title
      }));
    } catch (error) {
      this.logger.error('Failed to load videos:', error);
      throw new Error('Failed to load YouTube videos');
    }
  }

  private randomPick<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }
} 