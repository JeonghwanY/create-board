import React, { useState } from 'react';
import './WriteForm.css';
const API_BASE = "http://localhost:3000";

const WriteForm = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [photo, setPhoto] = useState(null);
  
  // 로그인된 사용자 정보 가져오기
  const userId = localStorage.getItem("user") || "anonymous";

  const handleSave = async () => {
    if (!title.trim()) {
      alert("제목은 필수입니다.");
      return;
    }
    
    console.log('Submitting form with data:', {
      title,
      detail,
      userId,
      hasPhoto: !!photo
    });
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("detail", detail);
    formData.append("writer", userId);
    if (photo) formData.append("picture", photo);
  
    try {
      console.log('Sending POST request to:', `${API_BASE}/posts`);
      const res = await fetch(`${API_BASE}/posts`, {
        method: "POST",
        body: formData,
      });

      console.log('Response status:', res.status);
      console.log('Response ok:', res.ok);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Response error:', errorText);
        throw new Error(`저장 실패: ${res.status} - ${errorText}`);
      }
  
      const savedPost = await res.json();
      console.log('Saved post:', savedPost);
      
      onSubmit(savedPost);
      alert("저장되었습니다");
  
      setTitle('');
      setDetail('');
      setPhoto(null);
    } catch (err) {
      console.error('Error saving post:', err);
      alert(`게시글 저장 중 오류 발생: ${err.message}`);
    }
  };
  return (
    <div className="write-form-container">

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