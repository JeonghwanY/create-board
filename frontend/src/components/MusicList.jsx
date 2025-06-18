import React, { useEffect, useRef, useCallback } from 'react';
import "./MusicList.css";

const MusicList = ({ list, onWriteClick, onLoadMore, onItemClick, isLoading, hasMore, error, onRetry }) => {
    const observerTarget = useRef(null);
    const onLoadMoreRef = useRef(onLoadMore);

    // onLoadMore가 변경될 때마다 ref 업데이트
    useEffect(() => {
        onLoadMoreRef.current = onLoadMore;
    }, [onLoadMore]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                console.log('IntersectionObserver triggered:', {
                    isIntersecting: entry.isIntersecting,
                    isLoading: isLoading,
                    hasMore: hasMore,
                    onLoadMoreAvailable: !!onLoadMoreRef.current
                });
                
                // 교차가 감지되고, 로딩 중이 아니고, 더 불러올 데이터가 있고, onLoadMore 함수가 있을 때만 실행
                if (entry.isIntersecting && !isLoading && hasMore && onLoadMoreRef.current) {
                    console.log('Triggering onLoadMore...');
                    onLoadMoreRef.current();
                }
            },
            {
                threshold: 0, // 픽셀 단위로 감지
                rootMargin: '100px', // 100px 전에 미리 로딩
                root: null, // 뷰포트를 루트로 사용
            }
        );
        
        if (observerTarget.current) {
            observer.observe(observerTarget.current);
            console.log('Observer attached to target');
        }

        return () => {
            observer.disconnect();
            console.log('Observer disconnected');
        };
    }, [isLoading, hasMore]);

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

    // 스켈레톤 로더 컴포넌트
    const SkeletonItem = () => (
        <li className="musiclist-item skeleton">
            <div className="skeleton-title"></div>
            <div className="skeleton-time"></div>
        </li>
    );

    return (
        <div className="musiclist-wrapper">
            <button onClick={onWriteClick} className="newpost-button">새 글</button>

            {/* 스크롤 가능한 리스트 영역 */}
            <ul className="musiclist-ul">
                {list.map((item, idx) => (
                    <li key={item.pid || idx} 
                        className="musiclist-item"
                        onClick={() => onItemClick && onItemClick(item)}>
                        <span className="title">{item.title}</span>
                        <span className="time">
                            {item.koreanTime || formatKoreanTime(item.time || item.date)}
                        </span>
                    </li>
                ))}
                
                {/* 로딩 중일 때 스켈레톤 아이템들 표시 */}
                {isLoading && hasMore && (
                    <>
                        <SkeletonItem />
                        <SkeletonItem />
                        <SkeletonItem />
                    </>
                )}

                {/* 무한 스크롤 트리거 앵커 */}
                <div ref={observerTarget} className="scroll-anchor" />
            </ul>

            {/* 하단 상태 표시 영역 (스크롤 영역 외부) */}
            <div className="status-area">
                {/* 에러 상태 */}
                {error && (
                    <div className="error-container">
                        <p className="error-message">데이터를 불러오는 중 오류가 발생했습니다.</p>
                        {onRetry && (
                            <button onClick={onRetry} className="retry-button">
                                다시 시도
                            </button>
                        )}
                    </div>
                )}

                {/* 로딩 상태 */}
                {isLoading && !error && (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <span>게시글을 불러오는 중...</span>
                    </div>
                )}

                {/* 게시글이 없을 때 */}
                {!isLoading && list.length === 0 && !error && (
                    <div className="empty-state">
                        <p>게시글이 없습니다.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MusicList;