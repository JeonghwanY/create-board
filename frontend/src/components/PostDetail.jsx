import React, { useState, useRef, useEffect } from 'react';
import './PostDetail.css';

const PostDetail = ({ post, onBack, currentUser }) => {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');
    const [showMenu, setShowMenu] = useState(false); // 메뉴 열림 여부
    const commentEndRef = useRef(null);

    const isAuthor = post.writer === currentUser; // 현재 유저가 작성자인가?

    // ✅ 댓글 목록 가져오기
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`/comments/board/${post.pid}`);
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

        try {
            const res = await fetch("/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pid: post.pid,
                    c_detail: text,
                    c_writer: currentUser,
                }),
            });

            if (!res.ok) throw new Error("댓글 작성 실패");

            const newComment = await res.json();
            setComments((prev) => [...prev, newComment]);
            setText('');
        } catch (err) {
            alert("댓글 작성 중 오류 발생");
        }
    };

    // 수정 요청
    const handleEditComment = async (cmt) => {
        const newText = prompt("수정할 내용:", cmt.c_detail);
        if (!newText || newText.trim() === cmt.c_detail) return;

        try {
            const res = await fetch(`/comments/${cmt.cid}`, {
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

    useEffect(() => {
        commentEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [comments]);

    const handleDelete = async () => {
        if (!window.confirm("정말 삭제할까요?")) return;

        try {
            const res = await fetch(`/posts/${post.pid}`, { ////////게시글 삭제
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
            const res = await fetch(`/posts/${post.pid}`, { ///////게시글 수정
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
                <span className="user">{post.userId || 'unknown'}</span>
                <span className="time">{post.time}</span>
            </div>

            {post.picture && (
                <div className="photo-box">
                    <img
                        src={
                            typeof post.picture === 'string'
                                ? post.picture
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
                            {cmt.writer === currentUser && (
                                <div className="comment-actions">
                                    <button className="edit-btn" onClick={() => handleEditComment(cmt)}>수정</button>
                                    <button className="delete-btn" onClick={() => handleDeleteComment(cmt.cid)}>삭제</button>
                                </div>
                            )}
                        </div>
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