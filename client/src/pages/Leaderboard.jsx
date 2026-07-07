import React, { useState, useEffect } from 'react';
import LeaderboardTable from '../components/LeaderboardTable';

const PLATFORM_TABS = [
    { id: 'codeforces', label: 'Codeforces', description: 'Contest ratings', scoreKey: 'rating', scoreLabel: 'Rating' },
    { id: 'leetcode_rating', label: 'LeetCode', description: 'Contest ratings', scoreKey: 'rating', scoreLabel: 'Rating' },
    { id: 'leetcode_questions', label: 'LeetCode', description: 'Total questions', scoreKey: 'questions', scoreLabel: 'Questions Solved' },
    { id: 'codechef', label: 'CodeChef', description: 'Contest ratings', scoreKey: 'rating', scoreLabel: 'Rating' }
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
        leetcode_questions: [],
        codechef: []
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

    // Get current platform config
    const currentPlatform = PLATFORM_TABS.find(p => p.id === activePlatform);
    
    // Filter data based on selected year
    const rawData = leaderboardData[activePlatform] || [];
    const displayData = activeYear === 'all' 
        ? rawData 
        : rawData.filter(user => user.year === activeYear);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                        Leaderboard
                    </h1>
                    <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                        See how you rank against your peers in competitive programming.
                    </p>
                </div>

                {/* Platform Tabs */}
                <div className="flex justify-center border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {PLATFORM_TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActivePlatform(tab.id)}
                                className={`
                                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                    ${activePlatform === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                                `}
                            >
                                {tab.label}
                                <span className="block text-xs font-normal opacity-75 mt-0.5">
                                    {tab.description}
                                </span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Year Filter Tabs */}
                <div className="flex justify-center flex-wrap gap-2 py-4">
                    {YEAR_TABS.map((year) => (
                        <button
                            key={year.id}
                            onClick={() => setActiveYear(year.id)}
                            className={`
                                px-4 py-2 rounded-full text-sm font-medium transition-colors
                                ${activeYear === year.id
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}
                            `}
                        >
                            {year.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="mt-8">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center shadow-sm">
                            <p className="font-medium">Error loading leaderboard</p>
                            <p className="text-sm mt-1">{error}</p>
                        </div>
                    ) : (
                        <div className="animate-in fade-in duration-500">
                            <LeaderboardTable 
                                data={displayData} 
                                scoreKey={currentPlatform.scoreKey} 
                                scoreLabel={currentPlatform.scoreLabel} 
                            />
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Leaderboard;
