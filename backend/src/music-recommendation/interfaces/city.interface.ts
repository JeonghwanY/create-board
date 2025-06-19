export interface City {
  id: number;
  name: string;
  iso: string;
  lat: number;
  lon: number;
}

export interface WeatherData {
  weatherMain: string;
  feels_like: number;
  timezone_offset: number;
}

export interface TimeSlot {
  start: number;
  end: number;
  emoji: string;
  tag: string;
}

export interface TempRange {
  min: number;
  max: number;
  emoji: string;
  tag: string;
}

export interface Templates {
  cities: City[];
  weather_map: Record<string, string>;
  temp_map: TempRange[];
  time_map: TimeSlot[];
} 