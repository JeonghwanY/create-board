// src/pages/Home.jsx
import React, { useState } from 'react';
import MusicList from '../components/MusicList';
import WriteForm from '../components/WriteForm';
import PostDetail from '../components/PostDetail';
import './Home.css'; 


const Home = () => {
    const [mode, setMode] = useState('list');
    const [list, setList] = useState([
        { title: 'title', time: '30분 전' },
        { title: 'title', time: '15시간 전' },
        { title: 'title', time: 'x월 x일' },
    ]);
    const [selectedPost, setSelectedPost] = useState(null);

    const addPost = ({ title }) => {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
        const newItem = { title, time: timeString };
        setList((prev) => [newItem, ...prev]);  // 최신 글을 위로
        setMode('list');
    };

    const handlePostSubmit = (newPost) => {
        setList([newPost, ...list]);   // 목록 추가
        setSelectedPost(null);         // 바로 디테일로 가지 않도록
        setMode('list');               // 메인 목록 화면으로 전환
      };

    return (
        <div className="home-wrapper">
            {/* 헤더 */}
            <h1 className="home-header">
                ☁️ + 🌇 in paris... = <span className="italic">lo-fi</span>
            </h1>

            {/* 본문 */}
            <div className="home-content">
                {/* 유튜브 */}
                <div className="youtube-box">
                    <iframe width="700" height="500" src="https://www.youtube.com/embed/edbIsqPlJ8w?si=5gW_M3L07jUtOznr" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div>

                {/* 오른쪽: MusicList 또는 작성창 */}
                <div className="side-box">
                    {selectedPost ? (
                        <PostDetail post={selectedPost} onBack={() => setSelectedPost(null)} />
                    ) : mode === 'list' ? (
                        <MusicList
                            list={list}
                            onWriteClick={() => setMode('write')}
                            onItemClick={(item) => setSelectedPost(item)}
                        />
                    ) : (
                        <WriteForm onSubmit={handlePostSubmit} onCancel={() => setMode('list')} />
                    )}

                </div>
            </div>
        </div>
    );
};

export default Home;