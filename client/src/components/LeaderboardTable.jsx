import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRatingColor } from '../utils/ratingColors';
import { useCountUp } from '../hooks/useCountUp';
import { useInView } from '../hooks/useInView';
import './LeaderboardTable.css';

const PAGE_SIZE = 10;

const MedalIcon = ({ rank }) => {
    const colors = {
        1: { primary: '#FFD700', secondary: '#B8860B' },
        2: { primary: '#C0C0C0', secondary: '#8A8A8A' },
        3: { primary: '#CD7F32', secondary: '#8B5A2B' },
    }[rank];

    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M8.5 2H15.5L13.5 9H10.5L8.5 2Z" fill={colors.secondary} />
            <circle cx="12" cy="15" r="7" fill={colors.primary} stroke={colors.secondary} strokeWidth="1" />
            <circle cx="12" cy="15" r="4.2" fill="none" stroke={colors.secondary} strokeWidth="0.75" opacity="0.6" />
        </svg>
    );
};

const StandardRankIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="3" y="14" width="4" height="7" rx="1" fill="#6B7280" />
        <rect x="10" y="9" width="4" height="12" rx="1" fill="#8B8FA3" />
        <rect x="17" y="4" width="4" height="17" rx="1" fill="#6B7280" />
    </svg>
);

const RankIcon = ({ rank }) => (rank <= 3 ? <MedalIcon rank={rank} /> : <StandardRankIcon />);

const LeaderboardRow = ({ user, index, scoreKey, platformId, started = true, delay }) => {
    const rank = index + 1;
    const rankTierClass = rank === 1 ? 'rank-gold' : rank === 2 ? 'rank-silver' : rank === 3 ? 'rank-bronze' : '';
    const rawScore = user[scoreKey] || 0;
    const animatedScore = useCountUp(rawScore, started, 1200 + index * 40);
    const isRatingColumn = scoreKey === 'rating';
    const scoreColor = isRatingColumn && platformId === 'codeforces' ? getRatingColor(rawScore) : null;

    const content = (
        <div
            className={`lb-row ${rankTierClass}`}
            style={{ transitionDelay: started ? `${delay}ms` : '0ms', animationDelay: started ? `${delay}ms` : '0ms' }}
            data-in={started ? 'true' : 'false'}
        >
            <div className="lb-cell lb-cell-rank">
                <RankIcon rank={rank} />
                <span className="lb-rank-num">{rank}</span>
            </div>
            <div className="lb-cell lb-cell-name">
                <span className="lb-name">{user.name || 'Anonymous'}</span>
                {user.handle && <span className="lb-handle">@{user.handle}</span>}
            </div>
            <div className="lb-cell lb-cell-score">
                <span
                    className="lb-score"
                    style={scoreColor ? { color: scoreColor } : undefined}
                >
                    {animatedScore.toLocaleString()}
                </span>
            </div>
        </div>
    );

    if (user.id) {
        return (
            <Link to={`/profile/${user.id}`} className="lb-row-link" aria-label={`View ${user.name || 'user'}'s profile`}>
                {content}
            </Link>
        );
    }
    return <div className="lb-row-link lb-row-link-static">{content}</div>;
};

const LeaderboardTable = ({ data, scoreLabel, scoreKey, platformId, yearId }) => {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [containerRef, inView] = useInView({ threshold: 0.1 });

    const filteredData = useMemo(() => {
        if (!search.trim()) return data;
        const q = search.trim().toLowerCase();
        return (data || []).filter((u) => (u.name || '').toLowerCase().includes(q));
    }, [data, search]);

    // Reset to page 1 when filter/data changes
    const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
    const safePage = Math.min(currentPage, totalPages);
    const pageData = filteredData.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    const goToPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
    const goToNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

    // Reset page when search changes
    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    if (!data || data.length === 0) {
        return (
            <div className="empty-state">
                <p>No developers found for this category yet.</p>
            </div>
        );
    }

    return (
        <div className="lb-wrapper" ref={containerRef}>
            <div className="lb-search-bar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={search}
                    onChange={handleSearch}
                    className="lb-search-input"
                    aria-label="Search leaderboard by name"
                />
            </div>

            <div className="lb-table-container">
                <div className="lb-header-row">
                    <div className="lb-cell lb-cell-rank">Rank</div>
                    <div className="lb-cell lb-cell-name">Participant</div>
                    <div className="lb-cell lb-cell-score">{scoreLabel}</div>
                </div>

                <div className="lb-body">
                    {pageData.length === 0 ? (
                        <div className="empty-state">
                            <p>No developers match "{search}".</p>
                        </div>
                    ) : (
                        pageData.map((user, index) => (
                            <LeaderboardRow
                                key={`${platformId}-${yearId}-${user.handle || user.id || index}`}
                                user={user}
                                index={(safePage - 1) * PAGE_SIZE + index}
                                scoreKey={scoreKey}
                                platformId={platformId}
                                started={inView}
                                delay={Math.min(index, 9) * 70}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
                <div className="lb-pagination">
                    <button
                        className="lb-page-btn"
                        onClick={goToPrev}
                        disabled={safePage === 1}
                        aria-label="Previous page"
                    >
                        ←
                    </button>
                    <span className="lb-page-indicator">
                        {safePage} of {totalPages}
                    </span>
                    <button
                        className="lb-page-btn"
                        onClick={goToNext}
                        disabled={safePage === totalPages}
                        aria-label="Next page"
                    >
                        →
                    </button>
                </div>
            )}
        </div>
    );
};

export default LeaderboardTable;
