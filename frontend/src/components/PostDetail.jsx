import React, { useState, useRef, useEffect } from 'react';
import './PostDetail.css';
const API_BASE = "http://localhost:3000";

const PostDetail = ({ post, onBack, currentUser }) => {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');
    const [showMenu, setShowMenu] = useState(false); // 메뉴 열림 여부
    const commentEndRef = useRef(null);

    const isAuthor = post.writer === currentUser; // 현재 유저가 작성자인가?

    // 한국 시간으로 변환하는 함수
    const formatKoreanTime = (dateString) => {
        try {
            const date = new Date(dateString);
            // UTC 시간에 9시간을 더해 한국 시간으로 변환
            const koreanTime = new Date(date.getTime() + (9 * 60 * 60 * 1000));
            
            return koreanTime.toLocaleString('ko-KR', {
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }).replace(/\./g, '/').replace(/\s/g, ' ');
        } catch (error) {
            return dateString || 'Unknown';
        }
    };

    // ✅ 댓글 목록 가져오기
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`${API_BASE}/comments/board/${post.pid}`);
                const data = await res.json();
                setComments(data);
            } catch {
                alert("댓글을 불러오지 못했습니다");
            }
        };

        fetchComments();
    }, [post]);

    const handleAddComment = async () => {
        if (!text.trim()) return;

        console.log('댓글 작성 시도:', {
            pid: post.pid,
            c_detail: text,
            c_writer: currentUser,
            post: post
        });

        try {
            const requestBody = {
                pid: post.pid,
                c_detail: text,
                c_writer: currentUser,
            };
            
            console.log('요청 URL:', `${API_BASE}/comments`);
            console.log('요청 본문:', requestBody);
            
            const res = await fetch(`${API_BASE}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            console.log('응답 상태:', res.status);
            console.log('응답 OK:', res.ok);
            
            if (!res.ok) {
                const errorText = await res.text();
                console.error('댓글 작성 실패:', errorText);
                throw new Error(`댓글 작성 실패: ${res.status} - ${errorText}`);
            }

            const newComment = await res.json();
            console.log('새로 생성된 댓글:', newComment);
            
            setComments((prev) => [...prev, newComment]);
            setText('');
        } catch (err) {
            console.error('댓글 작성 중 오류:', err);
            alert(`댓글 작성 중 오류 발생: ${err.message}`);
        }
    };

    // 수정 요청
    const handleEditComment = async (cmt) => {
        const newText = prompt("수정할 내용:", cmt.c_detail);
        if (!newText || newText.trim() === cmt.c_detail) return;

        try {
            const res = await fetch(`${API_BASE}/comments/${cmt.cid}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ c_detail: newText }), // ✅ key 이름 맞춤
            });
            if (!res.ok) throw new Error();

            setComments((prev) =>
                prev.map((item) => item.cid === cmt.cid ? { ...item, c_detail: newText } : item)
            );
        } catch {
            alert("댓글 수정 실패");
        }
    };

    // 댓글 삭제 요청
    const handleDeleteComment = async (cid) => {
        if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

        try {
            const res = await fetch(`${API_BASE}/comments/${cid}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("댓글 삭제 실패");

            setComments((prev) => prev.filter((item) => item.cid !== cid));
        } catch (err) {
            alert("댓글 삭제 중 오류 발생");
        }
    };

    useEffect(() => {
        commentEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [comments]);

    const handleDelete = async () => {
        if (!window.confirm("정말 삭제할까요?")) return;

        try {
            const res = await fetch(`${API_BASE}/posts/${post.pid}`, { ////////게시글 삭제
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ writer: currentUser }), // 작성자 검증
            });
            if (!res.ok) throw new Error("삭제 실패");
            alert("삭제되었습니다");
            onBack(); // 목록으로
        } catch (err) {
            alert("삭제 중 오류 발생");
        }
    };

    const handleUpdate = async () => {
        const newTitle = prompt("새 제목", post.title);
        if (!newTitle || newTitle.trim() === post.title) return;

        const formData = new FormData();
        formData.append("title", newTitle);
        formData.append("writer", currentUser);

        try {
            const res = await fetch(`${API_BASE}/posts/${post.pid}`, { ///////게시글 수정
                method: "PATCH",
                body: formData,
            });
            if (!res.ok) throw new Error("수정 실패");
            const updated = await res.json();
            alert("수정되었습니다");
            window.location.reload();
        } catch (err) {
            alert("수정 중 오류 발생");
        }
    };

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
                        <button onClick={handleUpdate}>수정</button>
                        <button onClick={handleDelete}>삭제</button>
                    </div>
                )}
            </div>

            <div className="user-meta">
                <span className="user">{post.userId || post.writer || 'unknown'}</span>
                <span className="time">
                    {post.koreanTime || formatKoreanTime(post.time || post.date)}
                </span>
            </div>

            {post.picture && (
                <div className="photo-box">
                    <img
                        src={
                            post.picture.startsWith('http') || post.picture.startsWith('/uploads')
                                ? post.picture.startsWith('http') ? post.picture : `http://localhost:3000${post.picture}`
                                : URL.createObjectURL(post.picture)
                        }
                        alt="uploaded"
                    />
                </div>
            )}

            <div className="post-detail">{post.detail}</div>

            {/* 댓글 리스트 */}
            <div className="comment-list">
                {comments.map((cmt, idx) => (
                    <div key={cmt.cid || idx} className="comment-item">
                        <div className="comment-header">
                            <span className="comment-text">{cmt.c_detail}</span>
                            {cmt.c_writer === currentUser && (
                                <div className="comment-actions">
                                    <button className="edit-btn" onClick={() => handleEditComment(cmt)}>수정</button>
                                    <button className="delete-btn" onClick={() => handleDeleteComment(cmt.cid)}>삭제</button>
                                </div>
                            )}
                        </div>
                        <span className="comment-time">
                            {formatKoreanTime(cmt.time || cmt.c_date)}
                        </span>
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