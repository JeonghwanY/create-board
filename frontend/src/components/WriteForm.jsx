import React, { useState } from 'react';
import './WriteForm.css';

const WriteForm = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [photo, setPhoto] = useState(null);
  const [userId, setUserId] = useState('');

  const handleSave = () => {
    if (!title.trim()) return;
    onSubmit({ title, detail, photo });
    setTitle('');
    setDetail('');
    setPhoto(null);
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
          <img src={URL.createObjectURL(photo)} alt="preview" />
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