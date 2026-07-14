import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import './POTDLeaderboard.css';

const YEAR_TABS = [
    { id: 'all', label: 'All Years' },
    { id: '2026', label: 'First year (2026)' },
    { id: '2025', label: 'Second year (2025)' },
    { id: '2024', label: 'Third year (2024)' },
    { id: '2023', label: 'Fourth year (2023)' }
];

const BADGE_META = {
    first_blood: { label: 'First Blood', icon: '⚡', cls: 'badge-first-blood' },
    streak_7:    { label: '7-Day Streak', icon: '🔥', cls: 'badge-streak-7' },
    streak_30:   { label: '30-Day Streak', icon: '🔥', cls: 'badge-streak-30' },
    streak_100:  { label: '100-Day Streak', icon: '🔥', cls: 'badge-streak-100' },
    problem_master: { label: 'Problem Master', icon: '🧠', cls: 'badge-master' },
    top_solver:  { label: 'Top Solver', icon: '🏆', cls: 'badge-top' },
};

function renderBadges(badges) {
    if (!badges || badges.length === 0) return null;
    return (
        <div className="potd-lb-badge-row">
            {badges.map((b) => {
                const meta = BADGE_META[b];
                if (!meta) return null;
                return (
                    <span key={b} className={`potd-lb-badge ${meta.cls}`} title={meta.label}>
                        {meta.icon} {meta.label}
                    </span>
                );
            })}
        </div>
    );
}

const POTDLeaderboard = () => {
    const [activeYear, setActiveYear] = useState('all');
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchPOTDLeaderboard = useCallback(async (silent = false) => {
        try {
            if (!silent) setIsLoading(true);
            else setIsRefreshing(true);
            setError(null);

            const apiBase = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                ? 'http://localhost:5001'
                : 'https://console-website.onrender.com';
            const response = await fetch(`${apiBase}/api/potd/leaderboard-live`);
            if (!response.ok) throw new Error('Failed to fetch POTD leaderboard data');
            const data = await response.json();

            // Filter out profiles with no platform handles at all
            const valid = (data || []).filter(u =>
                (u.handle_cf && u.handle_cf.trim().length > 0) ||
                (u.handle_lc && u.handle_lc.trim().length > 0)
            );

            setLeaderboardData(valid);
            setLastUpdated(new Date());
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchPOTDLeaderboard();
    }, [fetchPOTDLeaderboard]);

    // Realtime subscription — refresh on any submission change
    useEffect(() => {
        const channel = supabase
            .channel('potd-lb-submissions')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'submissions' },
                () => {
                    fetchPOTDLeaderboard(true);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchPOTDLeaderboard]);

    const displayData = activeYear === 'all'
        ? leaderboardData
        : leaderboardData.filter(u => u.year === activeYear);

    // Re-rank after year filtering
    const rankedData = displayData.map((u, i) => ({ ...u, rank: i + 1 }));

    const totalSolvers = leaderboardData.length;
    const topSolver = leaderboardData[0];
    const totalSolves = leaderboardData.reduce((sum, u) => sum + (u.questions || 0), 0);

    const getLeetcodeUrl = (h) => `https://leetcode.com/u/${h}`;
    const getCodeforcesUrl = (h) => `https://codeforces.com/profile/${h}`;

    return (
        <div className="potd-leaderboard-container">
            <div className="potd-leaderboard-content">

                {/* Header */}
                <header className="potd-leaderboard-header">
                    <span className="potd-lb-super-label">⚡ COMPETITIVE PROGRAMMING</span>
                    <h1 className="potd-leaderboard-title">POTD Leaderboard</h1>
                    <p className="potd-leaderboard-subtitle">
                        Every day a new challenge. Every solve a step closer to the top.
                    </p>

                    {lastUpdated && (
                        <div className="potd-lb-updated-row">
                            <span className={`potd-lb-live-dot ${isRefreshing ? 'refreshing' : ''}`} />
                            <span className="potd-lb-updated-text">
                                {isRefreshing ? 'Updating...' : `Updated ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                            </span>
                        </div>
                    )}
                </header>

                {/* Hero Stats Row */}
                {!isLoading && !error && (
                    <div className="potd-lb-stats-hero">
                        <div className="potd-lb-stat-card">
                            <span className="potd-lb-stat-icon">👥</span>
                            <strong className="potd-lb-stat-val">{totalSolvers}</strong>
                            <span className="potd-lb-stat-lbl">Active Developers</span>
                        </div>
                        <div className="potd-lb-stat-card accent">
                            <span className="potd-lb-stat-icon">✅</span>
                            <strong className="potd-lb-stat-val">{totalSolves}</strong>
                            <span className="potd-lb-stat-lbl">Total POTD Solves</span>
                        </div>
                        {topSolver && (
                            <div className="potd-lb-stat-card gold">
                                <span className="potd-lb-stat-icon">🥇</span>
                                <strong className="potd-lb-stat-val">{topSolver.name}</strong>
                                <span className="potd-lb-stat-lbl">Top Solver — {topSolver.score} pts ({topSolver.questions} solves)</span>
                            </div>
                        )}
                        <div className="potd-lb-stat-card">
                            <span className="potd-lb-stat-icon">🔥</span>
                            <strong className="potd-lb-stat-val">
                                {leaderboardData.reduce((max, u) => Math.max(max, u.streak || 0), 0)}
                            </strong>
                            <span className="potd-lb-stat-lbl">Longest Active Streak</span>
                        </div>
                    </div>
                )}

                {/* Nav Actions */}
                <div className="potd-nav-actions">
                    <Link to="/leaderboard" className="potd-back-button">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Main Leaderboard
                    </Link>
                    <div className="potd-stat-banner">
                        <span>🔥</span>
                        <span>100 pts per solve + up to 50 pts speed bonus · Updated in real-time</span>
                    </div>
                </div>

                {/* Year Filter Tabs */}
                <div className="potd-year-tabs">
                    {YEAR_TABS.map((year) => (
                        <button
                            key={year.id}
                            onClick={() => setActiveYear(year.id)}
                            className={`potd-year-tab ${activeYear === year.id ? 'active' : ''}`}
                        >
                            {year.label}
                        </button>
                    ))}
                </div>

                {/* Main Table */}
                <div className="potd-table-container">
                    {isLoading ? (
                        <div className="potd-loading-container">
                            <div className="potd-spinner" />
                        </div>
                    ) : error ? (
                        <div className="potd-error-state">
                            <span className="potd-error-icon">⚠️</span>
                            <p className="potd-error-title">Failed to load leaderboard</p>
                            <p className="potd-error-msg">{error}</p>
                            <button className="potd-retry-btn" onClick={() => fetchPOTDLeaderboard()}>
                                Retry
                            </button>
                        </div>
                    ) : rankedData.length === 0 ? (
                        <div className="potd-empty-state">
                            <span className="potd-empty-icon">🏆</span>
                            <p className="potd-empty-title">No solvers yet in this category</p>
                            <p className="potd-empty-sub">Be the first to solve the daily challenge and claim the top spot!</p>
                        </div>
                    ) : (
                        <table className="potd-leaderboard-table">
                            <thead>
                                <tr>
                                    <th scope="col" className="th-rank">Rank</th>
                                    <th scope="col" className="th-dev">Developer</th>
                                    <th scope="col" className="th-handles">Platform Handles</th>
                                    <th scope="col" className="th-score">Total Score</th>
                                    <th scope="col" className="th-solved">POTDs Solved</th>
                                    <th scope="col" className="th-streak">Current Streak</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rankedData.map((user) => {
                                    const r = user.rank;
                                    const isGold   = r === 1;
                                    const isSilver = r === 2;
                                    const isBronze = r === 3;
                                    const rowCls = isGold ? 'potd-rank-1' : isSilver ? 'potd-rank-2' : isBronze ? 'potd-rank-3' : 'potd-rank-standard';
                                    const medalIcon = isGold ? '🥇' : isSilver ? '🥈' : isBronze ? '🥉' : r;

                                    return (
                                        <tr
                                            key={user.name + '-' + r}
                                            className={`potd-table-row ${rowCls}`}
                                        >
                                            {/* Rank */}
                                            <td className="td-rank">
                                                <div className="potd-rank-badge">{medalIcon}</div>
                                            </td>

                                            {/* Developer name + badges */}
                                            <td className="td-dev">
                                                <div className="potd-user-info-cell">
                                                    <span className="potd-user-name">{user.name}</span>
                                                    {renderBadges(user.badges)}
                                                </div>
                                            </td>

                                            {/* Platform handles */}
                                            <td className="td-handles">
                                                <div className="potd-user-handles-row">
                                                    {user.handle_cf && (
                                                        <a
                                                            href={getCodeforcesUrl(user.handle_cf)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="potd-user-handle codeforces"
                                                            title={`Codeforces: @${user.handle_cf}`}
                                                        >
                                                            <span>CF: @{user.handle_cf}</span>
                                                            <svg className="potd-external-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                                                <polyline points="15 3 21 3 21 9"></polyline>
                                                                <line x1="10" y1="14" x2="21" y2="3"></line>
                                                            </svg>
                                                        </a>
                                                    )}
                                                    {user.handle_lc && (
                                                        <a
                                                            href={getLeetcodeUrl(user.handle_lc)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="potd-user-handle leetcode"
                                                            title={`LeetCode: @${user.handle_lc}`}
                                                        >
                                                            <span>LC: @{user.handle_lc}</span>
                                                            <svg className="potd-external-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                                                <polyline points="15 3 21 3 21 9"></polyline>
                                                                <line x1="10" y1="14" x2="21" y2="3"></line>
                                                            </svg>
                                                        </a>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Score */}
                                            <td className="td-score">
                                                <span className="potd-score-pill highlight">{user.score || 0} pts</span>
                                            </td>

                                            {/* POTDs Solved */}
                                            <td className="td-solved">
                                                <span className="potd-solved-count">{user.questions || 0} POTDs</span>
                                            </td>

                                            {/* Streak */}
                                            <td className="td-streak">
                                                <span className={`potd-streak-badge ${(user.streak || 0) > 0 ? 'active' : ''}`}>
                                                    {(user.streak || 0) > 0 ? `🔥 ${user.streak}-day streak` : '—'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

            </div>
        </div>
    );
};

export default POTDLeaderboard;
