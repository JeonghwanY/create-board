import React, { useState } from 'react';
import './WriteForm.css';
const API_BASE = "http://localhost:3000";

const WriteForm = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [photo, setPhoto] = useState(null);
  const [userId, setUserId] = useState('');

  const handleSave = async () => {
    if (!title.trim() || !userId.trim()) {
      alert("제목과 USER ID는 필수입니다.");
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("detail", detail);
    formData.append("writer", userId);
    if (photo) formData.append("picture", photo);
  
    try {
      const res = await fetch("http://localhost:3000/posts", { /////////////게시글 작성 연동 (POST /posts)
        method: "POST",
        body: formData,
      });
  
      if (!res.ok) throw new Error("저장 실패");
  
      const savedPost = await res.json(); // 저장된 post 객체 받아옴
      onSubmit(savedPost); // 부모(Home.jsx)에 전달
      alert("저장되었습니다");
  
      setTitle('');
      setDetail('');
      setUserId('');
      setPhoto(null);
    } catch (err) {
      alert("게시글 저장 중 오류 발생");
    }
  };
  return (
    <div className="write-form-container">

<div className="user-meta">
        <input
          className="user-input"
          type="text"
          placeholder="USER ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </div>

      <div className="write-actions">
        <input
          className="title-input"
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* 이미지 업로드 */}
      <div className="photo-preview">
        {photo ? (
          <div className="photo-container">
            <img src={URL.createObjectURL(photo)} alt="preview" />
          </div>
        ) : (
          <label className="photo-placeholder">
            photo
            <input type="file" onChange={(e) => setPhoto(e.target.files[0])} hidden />
          </label>
        )}
      </div>

      {/* detail 입력 */}
      <textarea
        className="detail-input"
        placeholder="detail..."
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
      />

      {/* 저장/취소 버튼 */}

      <div>
        <button className="save-btn" onClick={handleSave}>저장</button>
        <button className="cancel-btn" onClick={onCancel}>취소</button>
      </div>
    </div>
  );
};

export default WriteForm;