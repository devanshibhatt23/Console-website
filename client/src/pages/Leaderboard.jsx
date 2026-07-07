import React, { useState, useEffect } from 'react';
import LeaderboardTable from '../components/LeaderboardTable';
import './Leaderboard.css';

const PLATFORM_TABS = [
    { id: 'codeforces', label: 'Codeforces', description: 'Contest ratings', scoreKey: 'rating', scoreLabel: 'Rating' },
    { id: 'leetcode_rating', label: 'LeetCode', description: 'Contest ratings', scoreKey: 'rating', scoreLabel: 'Rating' },
    { id: 'leetcode_questions', label: 'LeetCode', description: 'Total questions', scoreKey: 'questions', scoreLabel: 'Questions Solved' }
];

const YEAR_TABS = [
    { id: 'all', label: 'All Years' },
    { id: '2026', label: 'First year (2026)' },
    { id: '2025', label: 'Second year (2025)' },
    { id: '2024', label: 'Third year (2024)' },
    { id: '2023', label: 'Fourth year (2023)' }
];

const Leaderboard = () => {
    const [activePlatform, setActivePlatform] = useState('codeforces');
    const [activeYear, setActiveYear] = useState('all');
    const [leaderboardData, setLeaderboardData] = useState({
        codeforces: [],
        leetcode_rating: [],
        leetcode_questions: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await fetch('http://localhost:5000/api/leaderboard');
                if (!response.ok) throw new Error('Failed to fetch leaderboard data');
                const data = await response.json();
                setLeaderboardData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const currentPlatform = PLATFORM_TABS.find(p => p.id === activePlatform);
    
    const rawData = leaderboardData[activePlatform] || [];
    const displayData = activeYear === 'all' 
        ? rawData 
        : rawData.filter(user => user.year === activeYear);

    return (
        <div className="leaderboard-container">
            <div className="leaderboard-content">
                
                {/* Header */}
                <div className="leaderboard-header">
                    <h1 className="leaderboard-title">Console Leaderboard</h1>
                    <p className="leaderboard-subtitle">
                        Track your ranking across Codeforces and LeetCode.
                    </p>
                </div>

                {/* Platform Tabs */}
                <div className="platform-tabs">
                    {PLATFORM_TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActivePlatform(tab.id)}
                            className={`platform-tab ${activePlatform === tab.id ? 'active' : ''}`}
                        >
                            <span className="platform-tab-label">{tab.label}</span>
                            <span className="platform-tab-desc">{tab.description}</span>
                        </button>
                    ))}
                </div>

                {/* Year Filter Tabs */}
                <div className="year-tabs">
                    {YEAR_TABS.map((year) => (
                        <button
                            key={year.id}
                            onClick={() => setActiveYear(year.id)}
                            className={`year-tab ${activeYear === year.id ? 'active' : ''}`}
                        >
                            {year.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div>
                    {isLoading ? (
                        <div className="loading-container">
                            <div className="spinner"></div>
                        </div>
                    ) : error ? (
                        <div style={{ textAlign: 'center', color: '#f87171', padding: '2rem' }}>
                            <p style={{ fontWeight: 'bold' }}>Error loading leaderboard</p>
                            <p style={{ fontSize: '0.875rem' }}>{error}</p>
                        </div>
                    ) : (
                        <LeaderboardTable 
                            data={displayData} 
                            scoreKey={currentPlatform.scoreKey} 
                            scoreLabel={currentPlatform.scoreLabel}
                            platformId={currentPlatform.id}
                        />
                    )}
                </div>

            </div>
        </div>
    );
};

export default Leaderboard;
