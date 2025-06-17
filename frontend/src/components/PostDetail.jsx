import React, { useState, useRef, useEffect } from 'react';
import './PostDetail.css';

const PostDetail = ({ post, onBack, currentUser }) => {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');
    const [showMenu, setShowMenu] = useState(false); // 메뉴 열림 여부
    const commentEndRef = useRef(null);

    const isAuthor = post.userId === currentUser; // 현재 유저가 작성자인가?

    const handleAddComment = () => {
        if (!text.trim()) return;
        const now = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
        setComments([...comments, { text, time: now }]);
        setText('');
    };

    useEffect(() => {
        commentEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [comments]);

    return (
        <div className="post-container">
            <button onClick={onBack}>← Back</button>

            {/* 🔽 제목 + 메뉴 */}
            <div className="post-header">
                <h2 className="post-title">{post.title}</h2>
                <div className="menu" onClick={() => setShowMenu(!showMenu)}>⋮</div>

                {/* 🔽 메뉴 토글 시 나타남 */}
                {showMenu && isAuthor && (
                    <div className="menu-options">
                        <button onClick={() => alert('수정 기능')}>수정</button>
                        <button onClick={() => alert('삭제 기능')}>삭제</button>
                    </div>
                )}
            </div>

            <div className="user-meta">
                <span className="user">{post.userId || 'unknown'}</span>
                <span className="time">{post.time}</span>
            </div>

            {post.photo && (
                <div className="photo-box">
                    <img
                        src={
                            typeof post.photo === 'string'
                                ? post.photo
                                : URL.createObjectURL(post.photo)
                        }
                        alt="uploaded"
                    />
                </div>
            )}

            <div className="post-detail">{post.detail}</div>

            {/* 댓글 리스트 */}
            <div className="comment-list">
                {comments.map((cmt, idx) => (
                    <div key={idx} className="comment-item">
                        <span className="comment-text">{cmt.text}</span>
                        <span className="comment-time">{cmt.time}</span>
                    </div>
                ))}
                <div ref={commentEndRef} />
            </div>

            {/* 댓글 입력 */}
            <div className="comment-input">
                <input
                    type="text"
                    placeholder="댓글 입력"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <button onClick={handleAddComment} disabled={!text.trim()}>▶</button>
            </div>
        </div>
    );
};

export default PostDetail;