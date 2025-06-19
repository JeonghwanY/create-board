import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MusicList from '../components/MusicList';
import WriteForm from '../components/WriteForm';
import PostDetail from '../components/PostDetail';
import './Home.css';

const API_BASE = "http://localhost:3000";

const Home = () => {
    const [mode, setMode] = useState('list');
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [musicRecommendation, setMusicRecommendation] = useState(null);
    const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false);
    const [backgroundImage, setBackgroundImage] = useState(null);
    const navigate = useNavigate();
    
    // 로그인된 사용자 정보 가져오기
    const currentUser = localStorage.getItem("user") || "anonymous";
    
    // useRef로 초기 로딩 상태 관리
    const isInitialLoadedRef = useRef(false);
    const isLoadingRef = useRef(false);

    // YouTube URL에서 썸네일 URL 추출
    const getYouTubeThumbnail = (youtubeUrl) => {
        if (!youtubeUrl) return null;
        
        // embed URL에서 video ID 추출
        const videoIdMatch = youtubeUrl.match(/embed\/([a-zA-Z0-9_-]+)/);
        if (videoIdMatch) {
            const videoId = videoIdMatch[1];
            return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }
        return null;
    };

    // 음악 추천 가져오기
    const fetchMusicRecommendation = useCallback(async () => {
        setIsLoadingRecommendation(true);
        try {
            const res = await fetch(`${API_BASE}/api/recommend`);
            if (!res.ok) throw new Error("음악 추천을 가져오지 못했습니다.");
            const data = await res.json();
            setMusicRecommendation(data);
            
            // YouTube 썸네일을 배경으로 설정
            const thumbnailUrl = getYouTubeThumbnail(data.youtubeUrl);
            if (thumbnailUrl) {
                setBackgroundImage(thumbnailUrl);
            }
        } catch (err) {
            console.error("음악 추천 오류:", err);
            // 기본값 설정하지 않음 - 백엔드에서 처리
            setMusicRecommendation(null);
            setBackgroundImage(null);
        } finally {
            setIsLoadingRecommendation(false);
        }
    }, []);

    // 로그아웃 함수
    const handleLogout = async () => {
        try {
            const res = await fetch(`${API_BASE}/auth/signout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            
            if (res.ok) {
                // 로컬 스토리지에서 토큰 삭제
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                alert("로그아웃되었습니다.");
                navigate("/");
            }
        } catch (err) {
            console.error("로그아웃 중 오류:", err);
            // 에러가 발생해도 로컬 스토리지 정리하고 로그인 페이지로 이동
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/");
        }
    };

    // 초기 데이터 로딩을 위한 함수
    const loadInitialPosts = useCallback(async () => {
        if (isInitialLoadedRef.current || isLoadingRef.current) return;
        
        console.log('Loading initial posts...');
        isLoadingRef.current = true;
        setIsLoading(true);
        setError(null);
        
        try {
            console.log('Fetching from:', `${API_BASE}/posts?page=1&limit=20`);
            const res = await fetch(`${API_BASE}/posts?page=1&limit=20`);
            console.log('Response status:', res.status);
            console.log('Response ok:', res.ok);
            
            if (!res.ok) {
                const errorText = await res.text();
                console.error('Response error:', errorText);
                throw new Error(`불러오기 실패: ${res.status} - ${errorText}`);
            }
            
            const data = await res.json();
            console.log('Response data:', data);
            
            console.log('Initial posts loaded:', {
                postsCount: data.posts ? data.posts.length : 0,
                total: data.total,
                hasMore: data.hasMore
            });
            
            setList(data.posts || []);
            setHasMore(data.hasMore || false);
            setPage(2);
            isInitialLoadedRef.current = true;
        } catch (err) {
            console.error("Error loading initial posts:", err);
            setError(`게시글을 불러오는 중 오류가 발생했습니다: ${err.message}`);
        } finally {
            isLoadingRef.current = false;
            setIsLoading(false);
        }
    }, []);

    // 추가 데이터 로딩을 위한 함수 (무한 스크롤용)
    const fetchMorePosts = useCallback(async () => {
        if (isLoadingRef.current || !isInitialLoadedRef.current || !hasMore) {
            console.log('Fetch more posts skipped:', {
                isLoadingRef: isLoadingRef.current,
                isInitialLoaded: isInitialLoadedRef.current,
                hasMore: hasMore
            });
            return;
        }
        
        console.log(`Loading more posts... page: ${page}`);
        isLoadingRef.current = true;
        setIsLoading(true);
        setError(null);
        
        try {
            const res = await fetch(`${API_BASE}/posts?page=${page}&limit=20`);
            if (!res.ok) throw new Error("불러오기 실패");
            const data = await res.json();
            
            console.log('More posts loaded:', {
                page: page,
                postsCount: data.posts.length,
                total: data.total,
                hasMore: data.hasMore,
                currentListLength: list.length
            });
            
            // 중복 제거: 새로 받은 데이터에서 이미 있는 데이터는 제외
            const existingIds = new Set(list.map(post => post.pid));
            const newPosts = data.posts.filter(post => !existingIds.has(post.pid));
            
            console.log('New posts after deduplication:', newPosts.length);
            
            if (newPosts.length > 0) {
                setList(prev => {
                    const updated = [...prev, ...newPosts];
                    console.log('Updated list length:', updated.length);
                    return updated;
                });
            }
            
            setHasMore(data.hasMore);
            setPage(prev => prev + 1);
            
            console.log('Updated state:', {
                hasMore: data.hasMore,
                nextPage: page + 1
            });
        } catch (err) {
            console.error("Error loading more posts:", err);
            setError("추가 게시글을 불러오는 중 오류가 발생했습니다.");
        } finally {
            isLoadingRef.current = false;
            setIsLoading(false);
        }
    }, [page, hasMore, list]);

    // 재시도 함수
    const handleRetry = useCallback(() => {
        console.log('Retrying...');
        if (!isInitialLoadedRef.current) {
            loadInitialPosts();
        } else {
            fetchMorePosts();
        }
    }, [loadInitialPosts, fetchMorePosts]);

    useEffect(() => {
        console.log('Component mounted, loading initial posts...');
        loadInitialPosts();
        fetchMusicRecommendation();
        
        // cleanup 함수
        return () => {
            isInitialLoadedRef.current = false;
            isLoadingRef.current = false;
        };
    }, []); // 의존성 배열을 빈 배열로 유지

    const handlePostSubmit = (newPost) => {
        console.log('New post submitted:', newPost);
        setList(prev => [newPost, ...prev]);
        setSelectedPost(null);
        setMode('list');
    };

    const handleSelectPost = async (item) => {
        try {
            const res = await fetch(`${API_BASE}/posts/${item.pid}`);
            if (!res.ok) throw new Error("상세 조회 실패");
            const data = await res.json();
            setSelectedPost(data);
        } catch (err) {
            alert("게시글을 불러오지 못했습니다.");
        }
    };

    // 추천 문구 포맷 함수
    const getFormattedEmojiText = (rec) => {
        if (!rec) return '';
        // 예시: ☀️ + 🌌 + 🌿 in London... = Chill Music
        // emoji: "☀️ 🌌 🌿 in London..."
        const [weather, time, temp, ...rest] = rec.emoji.split(' ');
        const cityPart = rest.join(' ');
        return `${weather} + ${time} + ${temp} ${cityPart} = ${rec.genre}`;
    };

    return (
        <div 
            className="home-wrapper"
            style={{
                backgroundImage: backgroundImage ? `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${backgroundImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}
        >
            <div className="home-header-container">
                <h1 className="home-header">
                    {isLoadingRecommendation ? (
                        "음악을 추천하고 있습니다..."
                    ) : musicRecommendation ? (
                        getFormattedEmojiText(musicRecommendation)
                    ) : (
                        "☁️ + 🌇 + 🌿 in Paris... = Lo-Fi"
                    )}
                </h1>
                <button className="logout-button" onClick={handleLogout}>
                    로그아웃
                </button>
            </div>

            <div className="home-content">
                <div className="youtube-box">
                    {isLoadingRecommendation ? (
                        <div className="loading-placeholder">
                            <p>음악을 로딩 중...</p>
                        </div>
                    ) : musicRecommendation ? (
                        <iframe 
                            width="1280" 
                            height="720" 
                            src={musicRecommendation.youtubeUrl} 
                            title="YouTube video player" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen 
                        />
                    ) : null}
                </div>

                <div className="side-box">
                    {selectedPost ? (
                        <PostDetail post={selectedPost} onBack={() => setSelectedPost(null)} currentUser={currentUser} />
                    ) : mode === 'list' ? (
                        <MusicList
                            list={list}
                            onWriteClick={() => setMode('write')}
                            onItemClick={handleSelectPost}
                            onLoadMore={hasMore && !isLoading && !error ? fetchMorePosts : null}
                            isLoading={isLoading}
                            hasMore={hasMore}
                            error={error}
                            onRetry={handleRetry}
                        />
                    ) : (
                        <WriteForm
                            onSubmit={handlePostSubmit}
                            onCancel={() => setMode('list')}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;