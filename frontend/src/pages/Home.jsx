import React, { useState, useEffect } from 'react';
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

    const fetchPosts = async () => {
        try {
            const res = await fetch(`${API_BASE}/posts?page=${page}&limit=10`); /////////게시글 목록
            if (!res.ok) throw new Error("불러오기 실패");
            const data = await res.json();
            setList(prev => [...prev, ...data.posts]); // 게시글 누적
            setHasMore(data.hasMore);
            setPage(prev => prev + 1);
        } catch (err) {
            alert("게시글을 불러오지 못했습니다.");
        }
    };

    useEffect(() => {
        fetchPosts(); // 컴포넌트 마운트 시 최초 1회 불러오기
    }, []);

    const handlePostSubmit = (newPost) => {
        setList(prev => [newPost, ...prev]); // 새 게시글을 최상단에
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
                    <iframe width="700" height="500" src="https://www.youtube.com/embed/edbIsqPlJ8w?si=5gW_M3L07jUtOznr" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                </div>

                <div className="side-box">
                    {selectedPost ? (
                        <PostDetail post={selectedPost} onBack={() => setSelectedPost(null)} currentUser="user123" />
                    ) : mode === 'list' ? (
                        <MusicList
                            list={list}
                            onWriteClick={() => setMode('write')}
                            onItemClick={handleSelectPost}
                            onLoadMore={hasMore ? fetchPosts : null}
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