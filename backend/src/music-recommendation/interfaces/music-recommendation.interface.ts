export interface MusicRecommendation {
  city: string;
  emoji: string;
  genre: string;
  youtubeUrl: string;
}

export interface YouTubeSearchResult {
  playlistId: string;
  title: string;
}

export interface YouTubeVideo {
  videoId: string;
  title: string;
}

export interface GenreRule {
  weather_emoji: string;
  time_tags: string[];
  genre: string;
}

export interface TempCorrection {
  temp_tag: string;
  base_genre?: string;
  base_genre_pattern?: string;
  corrected_genre: string;
}

export interface GenreRules {
  genre_rules: GenreRule[];
  temp_corrections: TempCorrection[];
  default_genre: string;
} 