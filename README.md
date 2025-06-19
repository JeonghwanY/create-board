# TIL Board Project

하루 공부한 내용을 기록하고 공유하는 게시판 프로젝트입니다.

## 🎵 음악 추천 시스템

이 프로젝트는 날씨와 시간대를 기반으로 한 지능형 음악 추천 시스템을 포함합니다.

### 🌟 주요 기능
- **랜덤 도시 선택**: 전 세계 10개 도시 중 랜덤 선택
- **실시간 날씨 데이터**: OpenWeather API를 통한 현재 날씨 정보
- **시간대별 감성 매핑**: 현지 시간대에 따른 음악 장르 추천
- **YouTube 플레이리스트 검색**: 장르별 맞춤형 플레이리스트 자동 검색
- **동적 음악 재생**: 홈페이지에서 추천된 음악 자동 재생

### 🎯 추천 알고리즘
1. **도시 선택**: Paris, Venice, Santorini, New York, Barcelona, Tokyo, London, Prague, Budapest, Brooklyn
2. **날씨 매핑**: 맑음(☀️), 흐림(☁️), 비(🌧️), 눈(❄️), 번개(⚡), 강풍(💨)
3. **시간대 매핑**: 아침(🌅), 낮(☀️), 오후(🌤), 저녁(🌇), 밤(🌙), 새벽(🌌)
4. **온도 보정**: 더움(🔥), 적당함(🌿), 추움(❄️)
5. **장르 결정**: 날씨+시간대+온도 조합에 따른 최적 장르 선택

### 🔧 API 엔드포인트
- `GET /api/recommend`: 음악 추천 데이터 반환
  ```json
  {
    "city": "Tokyo",
    "emoji": "🌧️ 🌇 🌿 in Tokyo...",
    "genre": "Lo-Fi Hip-hop / Rainy Jazz",
    "youtubeUrl": "https://www.youtube.com/embed/VIDEO_ID"
  }
  ```

### 📋 환경 변수 설정
```bash
# .env 파일에 추가
OPENWEATHER_API_KEY=your-openweather-api-key
YOUTUBE_API_KEY=your-youtube-api-key
```

## 🗂️ 프로젝트 구조

## ⚙️ 실행 방법

### 📦 백엔드 실행 (NestJS)
```bash
cd backend
npm install
npm run start:dev
```

### 🎨 프론트엔드 실행 (React)
```bash
cd frontend
npm install
npm run dev
```