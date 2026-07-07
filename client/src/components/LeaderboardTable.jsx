import React from 'react';

const LeaderboardTable = ({ data, scoreLabel, scoreKey, platformId }) => {
    if (!data || data.length === 0) {
        return (
            <div className="empty-state">
                <p>No developers found for this category yet.</p>
            </div>
        );
    }

    const getProfileUrl = (handle) => {
        if (platformId === 'codeforces') return `https://codeforces.com/profile/${handle}`;
        if (platformId.startsWith('leetcode')) return `https://leetcode.com/u/${handle}`;
        return '#';
    };

    return (
        <div className="table-container">
            <table className="leaderboard-table">
                <thead>
                    <tr>
                        <th scope="col" style={{ width: '80px', textAlign: 'center' }}>Rank</th>
                        <th scope="col">Developer</th>
                        <th scope="col" style={{ textAlign: 'right' }}>{scoreLabel}</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((user, index) => {
                        const rankClass = index < 3 ? `rank-${index + 1}` : 'rank-standard';
                        return (
                            <tr key={user.handle} className={`table-row ${rankClass}`}>
                                <td style={{ textAlign: 'center' }}>
                                    <div className="rank-badge">
                                        {index + 1}
                                    </div>
                                </td>
                                <td>
                                    <div className="user-info-cell">
                                        <div className="user-name">{user.name}</div>
                                        <a 
                                            href={getProfileUrl(user.handle)} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="user-handle"
                                            title={`View ${user.name}'s profile on ${platformId.includes('codeforces') ? 'Codeforces' : 'LeetCode'}`}
                                        >
                                            @{user.handle}
                                            <svg className="external-link-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                                <polyline points="15 3 21 3 21 9"></polyline>
                                                <line x1="10" y1="14" x2="21" y2="3"></line>
                                            </svg>
                                        </a>
                                    </div>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <span className="score-pill">
                                        {user[scoreKey]}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default LeaderboardTable;
