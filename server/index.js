require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Supabase client with Service Role Key to bypass RLS for cache writes
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'your-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// --- CACHE CONFIG ---
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
let isFetching = false;

// --- HELPERS ---
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Extract year from college_id (e.g. 2026BTCS001 -> '2026')
const getYearFromCollegeId = (collegeId) => {
    if (!collegeId) return 'Unknown';
    const match = collegeId.match(/^(\d{4})/);
    return match ? match[1] : 'Other';
};

// --- SUPABASE CACHE FUNCTIONS ---

/**
 * Reads all 4 platform caches from Supabase.
 * Returns null if cache is missing or expired.
 */
const readFromSupabaseCache = async () => {
    const { data, error } = await supabase
        .from('leaderboard_cache')
        .select('platform, data, last_updated');

    if (error || !data || data.length === 0) {
        console.error('Cache read error:', error?.message);
        return null;
    }

    // Check if ANY cache entry is stale
    const now = Date.now();
    const isStale = data.some(row => {
        const age = now - new Date(row.last_updated).getTime();
        return age > CACHE_TTL_MS;
    });

    if (isStale) {
        console.log('Cache is stale, will refresh...');
        return null;
    }

    // Reconstruct the leaderboards object from rows
    const leaderboards = {};
    data.forEach(row => {
        leaderboards[row.platform] = row.data;
    });
    console.log('Serving data from Supabase cache.');
    return leaderboards;
};

/**
 * Writes all 4 platform leaderboard arrays to Supabase.
 */
const writeToSupabaseCache = async (leaderboards) => {
    const platforms = Object.keys(leaderboards);

    for (const platform of platforms) {
        const { error } = await supabase
            .from('leaderboard_cache')
            .update({ data: leaderboards[platform], last_updated: new Date().toISOString() })
            .eq('platform', platform);

        if (error) {
            console.error(`Cache write error for ${platform}:`, error.message);
        }
    }
    console.log('Leaderboard cache written to Supabase successfully.');
};

// --- PLATFORM API FETCHERS ---

const fetchCodeforces = async (handle) => {
    try {
        const response = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
        if (response.data.status === 'OK' && response.data.result.length > 0) {
            const user = response.data.result[0];
            return {
                handle: user.handle,
                rating: user.rating || 0,
                maxRating: user.maxRating || 0,
                rank: user.rank || 'Unrated'
            };
        }
        return null;
    } catch (error) {
        console.error(`Codeforces API Error for ${handle}:`, error.message);
        return null;
    }
};

const fetchLeetcode = async (handle) => {
    try {
        const query = `
            query getUserProfile($username: String!) {
                matchedUser(username: $username) {
                    submitStats: submitStatsGlobal {
                        acSubmissionNum { difficulty count }
                    }
                }
                userContestRanking(username: $username) {
                    rating
                }
            }
        `;
        const response = await axios.post('https://leetcode.com/graphql/', {
            query,
            variables: { username: handle }
        }, { headers: { 'Content-Type': 'application/json' } });

        const data = response.data.data;
        if (!data || !data.matchedUser) return null;

        const totalQuestions = data.matchedUser.submitStats.acSubmissionNum
            .find(d => d.difficulty === 'All')?.count || 0;
        const contestRating = data.userContestRanking
            ? Math.round(data.userContestRanking.rating) : 0;

        return { handle, rating: contestRating, totalQuestions };
    } catch (error) {
        console.error(`LeetCode API Error for ${handle}:`, error.message);
        return null;
    }
};

// --- CORE FETCH & CACHE REFRESH LOGIC ---
const refreshLeaderboardCache = async () => {
    if (isFetching) {
        console.log('Fetch already in progress, skipping.');
        return null;
    }
    isFetching = true;

    try {
        console.log('Fetching fresh leaderboard data from external APIs...');

        const { data: profiles, error } = await supabase
            .from('profiles')
            .select('id, name, college_id, codeforces_handle, leetcode_handle');

        if (error) throw error;

        const cfHandles = profiles.filter(p => p.codeforces_handle).map(p => p.codeforces_handle);
        const lcHandles = profiles.filter(p => p.leetcode_handle).map(p => p.leetcode_handle);

        // Sequential fetches with delays to respect rate limits
        const cfResults = [];
        for (const h of cfHandles) {
            cfResults.push(await fetchCodeforces(h));
            await delay(300);
        }

        const lcResults = [];
        for (const h of lcHandles) {
            lcResults.push(await fetchLeetcode(h));
            await delay(300);
        }

        const cfData = cfResults.filter(Boolean);
        const lcData = lcResults.filter(Boolean);

        const leaderboards = {
            codeforces: [],
            leetcode_rating: [],
            leetcode_questions: []
        };

        profiles.forEach(p => {
            const year = getYearFromCollegeId(p.college_id);

            if (p.codeforces_handle) {
                const stat = cfData.find(c => c.handle.toLowerCase() === p.codeforces_handle.toLowerCase());
                if (stat) leaderboards.codeforces.push({ name: p.name, handle: stat.handle, rating: stat.rating, year });
            }
            if (p.leetcode_handle) {
                const stat = lcData.find(c => c.handle.toLowerCase() === p.leetcode_handle.toLowerCase());
                if (stat) {
                    leaderboards.leetcode_rating.push({ name: p.name, handle: stat.handle, rating: stat.rating, year });
                    leaderboards.leetcode_questions.push({ name: p.name, handle: stat.handle, questions: stat.totalQuestions, year });
                }
            }
        });

        leaderboards.codeforces.sort((a, b) => b.rating - a.rating);
        leaderboards.leetcode_rating.sort((a, b) => b.rating - a.rating);
        leaderboards.leetcode_questions.sort((a, b) => b.questions - a.questions);

        // Persist to Supabase cache
        await writeToSupabaseCache(leaderboards);

        return leaderboards;
    } catch (err) {
        console.error('Error refreshing leaderboard cache:', err.message);
        throw err;
    } finally {
        isFetching = false;
    }
};

// --- ENDPOINT ---

app.get('/api/leaderboard', async (req, res) => {
    try {
        // 1. Try to serve from Supabase cache first
        const cached = await readFromSupabaseCache();
        if (cached) return res.json(cached);

        // 2. Cache is stale/missing — refresh it
        const freshData = await refreshLeaderboardCache();
        res.json(freshData);

    } catch (error) {
        // 3. If everything fails, try to return whatever is in Supabase even if stale
        console.error('Falling back to stale Supabase cache...');
        const { data } = await supabase.from('leaderboard_cache').select('platform, data');
        if (data && data.length > 0) {
            const staleLeaderboards = {};
            data.forEach(row => { staleLeaderboards[row.platform] = row.data; });
            return res.json(staleLeaderboards);
        }
        res.status(500).json({ error: 'Failed to fetch leaderboard data' });
    }
});

app.listen(port, () => {
    console.log(`Leaderboard server running on port ${port}`);
    // Warm up the cache on startup
    refreshLeaderboardCache().catch(console.error);
});
