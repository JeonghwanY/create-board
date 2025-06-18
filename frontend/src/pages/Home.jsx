import React, { useState, useEffect, useCallback, useRef } from 'react';
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
    
    // useRef로 초기 로딩 상태 관리
    const isInitialLoadedRef = useRef(false);
    const isLoadingRef = useRef(false);

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

    return (
        <div className="home-wrapper">
            <h1 className="home-header">
                ☁️ + 🌇 in paris... = <span className="italic">lo-fi</span>
            </h1>

            <div className="home-content">
                <div className="youtube-box">
                    <iframe width="1280" height="720" src="https://www.youtube.com/embed/edbIsqPlJ8w?si=5gW_M3L07jUtOznr" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                </div>

                <div className="side-box">
                    {selectedPost ? (
                        <PostDetail post={selectedPost} onBack={() => setSelectedPost(null)} currentUser="user123" />
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