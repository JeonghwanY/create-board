import React, { useEffect, useRef } from 'react';
import "./MusicList.css";

const MusicList = ({ list, onWriteClick, onLoadMore,onItemClick }) => {
    const observerTarget = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && onLoadMore) {
                onLoadMore();
            }
        });
        if (observerTarget.current) observer.observe(observerTarget.current);

        return () => observer.disconnect();
    }, [onLoadMore]);

    return (
        <div className="musiclist-wrapper">
            <button onClick={onWriteClick} className="newpost-button">새 글</button>

            <ul className="musiclist-ul">
                {list.map((item, idx) => (
                    <li key={idx} 
                    className="musiclist-item"
                    onClick={() => onItemClick && onItemClick(item)}>
                        <span className="title">{item.title}</span>
                        <span className="time">{item.time}</span>
                        {/* setSelectedPost(item);
                        setMode('detail');  */}
                    </li>
                ))}
            </ul>

            <div ref={observerTarget} className="scroll-anchor" />
        </div>
    );
};

export default MusicList;