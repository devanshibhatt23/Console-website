require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Supabase Client (Use Service Role Key to bypass RLS and read auth emails if needed, or Anon Key if email is stored in profiles)
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'your-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to extract year from email (e.g., 2026xxx@college.edu -> 2026)
const getYearFromEmail = (email) => {
    if (!email) return 'Unknown';
    const match = email.match(/^(\d{4})/);
    return match ? match[1] : 'Other';
};

// --- PLATFORM API FETCHERS ---

const fetchCodeforces = async (handles) => {
    if (handles.length === 0) return [];
    try {
        const response = await axios.get(`https://codeforces.com/api/user.info?handles=${handles.join(';')}`);
        if (response.data.status === 'OK') {
            return response.data.result.map(user => ({
                handle: user.handle,
                rating: user.rating || 0,
                maxRating: user.maxRating || 0,
                rank: user.rank || 'Unrated'
            }));
        }
        return [];
    } catch (error) {
        console.error("Codeforces API Error:", error.message);
        return [];
    }
};

const fetchLeetcode = async (handle) => {
    try {
        const query = `
            query getUserProfile($username: String!) {
                matchedUser(username: $username) {
                    submitStats: submitStatsGlobal {
                        acSubmissionNum {
                            difficulty
                            count
                        }
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
        }, {
            headers: { 'Content-Type': 'application/json' }
        });
        
        const data = response.data.data;
        if (!data || !data.matchedUser) return null;

        const totalQuestions = data.matchedUser.submitStats.acSubmissionNum.find(d => d.difficulty === 'All')?.count || 0;
        const contestRating = data.userContestRanking ? Math.round(data.userContestRanking.rating) : 0;

        return { handle, rating: contestRating, totalQuestions };
    } catch (error) {
        console.error(`LeetCode API Error for ${handle}:`, error.message);
        return null;
    }
};

const fetchCodechef = async (handle) => {
    try {
        // Using a public proxy/scraper API for Codechef
        const response = await axios.get(`https://codechef-api.vercel.app/handle/${handle}`);
        if (response.data && response.data.success !== false) {
            return {
                handle,
                rating: response.data.currentRating || 0,
                stars: response.data.stars || '1★'
            };
        }
        return null;
    } catch (error) {
        console.error(`CodeChef API Error for ${handle}:`, error.message);
        return null;
    }
};


// --- ENDPOINTS ---

app.get('/api/leaderboard', async (req, res) => {
    try {
        // 1. Fetch all profiles from Supabase
        const { data: profiles, error } = await supabase
            .from('profiles')
            .select('id, name, codeforces_handle, leetcode_handle, codechef_handle'); // Add email here if you added it to profiles table!
            
        if (error) throw error;

        // Note: If you need emails to get the 'Year' and they aren't in 'profiles', 
        // you might need to use Supabase Admin API to fetch users and join them in memory.
        // For MVP, we will assume 'college_id' or 'email' is eventually in the profile.
        // Here we will mock the year assignment if email doesn't exist just to build the UI.

        // Prepare data structures
        const cfHandles = [];
        const lcHandles = [];
        const ccHandles = [];

        profiles.forEach(p => {
            if (p.codeforces_handle) cfHandles.push(p.codeforces_handle);
            if (p.leetcode_handle) lcHandles.push(p.leetcode_handle);
            if (p.codechef_handle) ccHandles.push(p.codechef_handle);
        });

        // 2. Fetch data from platforms
        const [cfData, lcResults, ccResults] = await Promise.all([
            fetchCodeforces(cfHandles),
            Promise.all(lcHandles.map(h => fetchLeetcode(h))),
            Promise.all(ccHandles.map(h => fetchCodechef(h)))
        ]);

        const lcData = lcResults.filter(r => r !== null);
        const ccData = ccResults.filter(r => r !== null);

        // 3. Merge data with profiles and assign years
        const leaderboards = {
            codeforces: [],
            leetcode_rating: [],
            leetcode_questions: [],
            codechef: []
        };

        profiles.forEach(p => {
            // Mock email for testing if missing (e.g. 2026admin@college.edu)
            const mockEmail = p.email || `${2023 + Math.floor(Math.random() * 4)}student@college.edu`; 
            const year = getYearFromEmail(mockEmail);

            // Codeforces
            if (p.codeforces_handle) {
                const stat = cfData.find(c => c.handle.toLowerCase() === p.codeforces_handle.toLowerCase());
                if (stat) leaderboards.codeforces.push({ name: p.name, handle: stat.handle, rating: stat.rating, year });
            }

            // LeetCode
            if (p.leetcode_handle) {
                const stat = lcData.find(c => c.handle.toLowerCase() === p.leetcode_handle.toLowerCase());
                if (stat) {
                    leaderboards.leetcode_rating.push({ name: p.name, handle: stat.handle, rating: stat.rating, year });
                    leaderboards.leetcode_questions.push({ name: p.name, handle: stat.handle, questions: stat.totalQuestions, year });
                }
            }

            // CodeChef
            if (p.codechef_handle) {
                const stat = ccData.find(c => c.handle.toLowerCase() === p.codechef_handle.toLowerCase());
                if (stat) leaderboards.codechef.push({ name: p.name, handle: stat.handle, rating: stat.rating, year });
            }
        });

        // 4. Sort arrays
        leaderboards.codeforces.sort((a, b) => b.rating - a.rating);
        leaderboards.leetcode_rating.sort((a, b) => b.rating - a.rating);
        leaderboards.leetcode_questions.sort((a, b) => b.questions - a.questions);
        leaderboards.codechef.sort((a, b) => b.rating - a.rating);

        res.json(leaderboards);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch leaderboard data' });
    }
});

app.listen(port, () => {
    console.log(`Leaderboard server running on port ${port}`);
});
