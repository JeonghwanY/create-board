// src/pages/Home.jsx
import React, { useState } from 'react';
import MusicList from '../components/MusicList';
import WriteForm from '../components/WriteForm';
import './Home.css'; // ✅ CSS 불러오기

const Home = () => {
    const [mode, setMode] = useState('list');

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
                <iframe width="560" height="315" src="https://www.youtube.com/embed/edbIsqPlJ8w?si=5gW_M3L07jUtOznr" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div>

                {/* 오른쪽: MusicList 또는 작성창 */}
                <div className="side-box">
                    {mode === 'list' ? (
                        <MusicList onWriteClick={() => setMode('write')} />
                    ) : (
                        <WriteForm onCancel={() => setMode('list')} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;