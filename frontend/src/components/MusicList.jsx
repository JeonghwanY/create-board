import React, { useEffect, useRef } from 'react';
import "./MusicList.css";

<<<<<<< HEAD
const MusicList = ({ list, onWriteClick, onLoadMore,onItemClick }) => {
=======
const MusicList = ({ list, onWriteClick, onLoadMore }) => {
>>>>>>> min
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
<<<<<<< HEAD
                    <li key={idx} 
                    className="musiclist-item"
                    onClick={() => onItemClick && onItemClick(item)}>
                        <span className="title">{item.title}</span>
                        <span className="time">{item.time}</span>
                        {/* setSelectedPost(item);
                        setMode('detail');  */}
=======
                    <li key={idx} className="musiclist-item">
                        <span className="title">{item.title}</span>
                        <span className="time">{item.time}</span>
>>>>>>> min
                    </li>
                ))}
            </ul>

            <div ref={observerTarget} className="scroll-anchor" />
        </div>
    );
};

export default MusicList;