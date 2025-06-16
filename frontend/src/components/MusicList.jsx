import React from 'react';

const MusicList = ({ onWriteClick }) => {
    const list = [
        { title: 'title', time: '30분 전' },
        { title: 'title', time: '15시간 전' },
        { title: 'title', time: 'x월 x일' },
    ];

    return (
        <div className="w-80 bg-gray-100 rounded-xl p-4 shadow-md relative">
            {/* 새 글 버튼 */}
            <button
            onClick={onWriteClick}
            className="absolute top-4 right-4 bg-green-500 text-white text-sm px-4 py-1 rounded-full">
                새 글
            </button>

            {/* 리스트 */}
            <ul className="mt-12 space-y-4">
                {list.map((item, idx) => (
                    <li key={idx} className="flex justify-between border-b pb-1">
                        <span className="font-bold text-xl">title</span>
                        <span className="text-sm text-gray-600">{item.time}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MusicList;