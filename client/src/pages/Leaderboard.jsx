import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import LeaderboardTable from '../components/LeaderboardTable';
import { useCountUp } from '../hooks/useCountUp';
import './Leaderboard.css';

const UsersIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const PulseIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="2 14 8 14 10 8 14 20 16 14 22 14" />
    </svg>
);

const CrownIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18h18l-1.5-9-4.5 4-3-7-3 7-4.5-4L3 18Z" />
    </svg>
);

const StatCard = ({ icon, iconColor, value, label }) => {
    const animatedValue = useCountUp(value, true, 1200);
    return (
        <div className="stat-card">
            <span className="stat-card-icon" style={{ color: iconColor }}>{icon}</span>
            <span className="stat-card-value">{animatedValue.toLocaleString()}</span>
            <span className="stat-card-label">{label}</span>
        </div>
    );
};

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
    const navigate = useNavigate();
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

    const codeforcesUsers = leaderboardData.codeforces?.length || 0;
    const leetcodeUsers = Math.max(
        leaderboardData.leetcode_rating?.length || 0,
        leaderboardData.leetcode_questions?.length || 0
    );
    const totalUsers = useMemo(() => {
        const ids = new Set();
        const addAll = (arr) => (arr || []).forEach((u) => ids.add(u.id || u.handle || u.name));
        addAll(leaderboardData.codeforces);
        addAll(leaderboardData.leetcode_rating);
        addAll(leaderboardData.leetcode_questions);
        return ids.size;
    }, [leaderboardData]);

    return (
        <div className="leaderboard-container" style={{ position: "relative" }}>
            {/* Back Button */}
            <button
                onClick={() => navigate("/home")}
                style={{
                    position: "absolute",
                    top: "24px",
                    left: "24px",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "1px solid var(--border, rgba(255,255,255,0.08))",
                    background: "var(--code-bg, rgba(22, 23, 29, 0.85))",
                    color: "var(--text-h, #e8e9ed)",
                    cursor: "pointer",
                    zIndex: 10,
                    fontWeight: "600",
                    fontSize: "14px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px"
                }}
            >
                ← Back to Dashboard
            </button>

            <div className="leaderboard-content" style={{ paddingTop: "60px" }}>
                
                {/* Header */}
                <div className="leaderboard-header">
                    <h1 className="leaderboard-title">Console Leaderboard</h1>
                    <p className="leaderboard-subtitle">
                        Track your ranking across <span className="subtitle-codeforces">Codeforces</span> and <span className="subtitle-leetcode">LeetCode</span>.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="stats-cards">
                    <StatCard icon={<UsersIcon />} iconColor="#7DA6FF" value={totalUsers} label="Total Users" />
                    <StatCard icon={<PulseIcon />} iconColor="#4ADE80" value={codeforcesUsers} label="Codeforces Users" />
                    <StatCard icon={<CrownIcon />} iconColor="#F2994A" value={leetcodeUsers} label="LeetCode Users" />
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
