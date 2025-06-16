// src/components/WriteForm.jsx
import React from 'react';

const WriteForm = ({ onCancel }) => {
  return (
    <div className="w-80 bg-white rounded-xl p-4 shadow-md flex flex-col gap-4">
      <h2 className="text-xl font-bold">새 글 작성</h2>
      <input
        type="text"
        placeholder="제목"
        className="border p-2 rounded"
      />
      <textarea
        placeholder="내용"
        rows="4"
        className="border p-2 rounded resize-none"
      />
      <div className="flex justify-between">
        <button className="bg-green-500 text-white px-4 py-1 rounded">저장</button>
        <button onClick={onCancel} className="text-gray-500">취소</button>
      </div>
    </div>
  );
};

export default WriteForm;