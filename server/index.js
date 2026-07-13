require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Supabase client with Service Role Key to bypass RLS for cache writes
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'your-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// --- CACHE CONFIG ---
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
let isFetching = false;
let isFetchingPOTD = false;

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

// --- POTD HELPERS & API FETCHERS ---
const getLeetcodeSlug = (url) => {
    if (!url) return null;
    const match = url.match(/problems\/([a-zA-Z0-9\-]+)/);
    return match ? match[1] : null;
};

const getCodeforcesCoords = (url) => {
    if (!url) return null;
    const match = url.match(/(?:problemset\/problem|contest|gym)\/(\d+)\/(?:problem\/)?([a-zA-Z0-9]+)/i);
    if (match) {
        return {
            contestId: parseInt(match[1], 10),
            index: match[2].toUpperCase()
        };
    }
    return null;
};

const getCodechefSlug = (url) => {
    if (!url) return null;
    const match = url.match(/problems\/([a-zA-Z0-9_]+)/i);
    return match ? match[1].toUpperCase() : null;
};

const fetchLeetcodeRecentAcSubmissions = async (handle) => {
    if (!handle || handle.trim() === '') return [];
    try {
        const query = `
            query recentAcSubmissions($username: String!, $limit: Int!) {
                recentAcSubmissionList(username: $username, limit: $limit) {
                    titleSlug
                    timestamp
                }
            }
        `;
        const response = await axios.post('https://leetcode.com/graphql/', {
            query,
            variables: { username: handle, limit: 30 }
        }, { headers: { 'Content-Type': 'application/json' } });

        const data = response.data.data;
        if (!data || !data.recentAcSubmissionList) return [];
        return data.recentAcSubmissionList.map(sub => ({
            titleSlug: sub.titleSlug,
            timestamp: parseInt(sub.timestamp, 10) * 1000 // Convert to ms
        }));
    } catch (error) {
        console.error(`LeetCode Recent API Error for ${handle}:`, error.message);
        return [];
    }
};

const fetchCodeforcesRecentSubmissions = async (handle, onlyCorrect = true) => {
    if (!handle || handle.trim() === '') return [];
    try {
        const response = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=50`);
        if (response.data.status === 'OK') {
            return response.data.result.map(sub => {
                if (onlyCorrect && sub.verdict !== 'OK') return null;
                return {
                    contestId: sub.problem.contestId,
                    index: sub.problem.index?.toUpperCase(),
                    timestamp: sub.creationTimeSeconds * 1000 // Convert to ms
                };
            }).filter(Boolean);
        }
        return [];
    } catch (error) {
        console.error(`Codeforces Recent API Error for ${handle}:`, error.message);
        return [];
    }
};

const fetchCodechefRecentSubmissions = async (handle) => {
    if (!handle || handle.trim() === '') return [];
    try {
        const response = await axios.get(`https://www.codechef.com/recent/user?page=0&user_handle=${handle}`);
        const html = response.data?.content;
        if (!html) return [];
        
        const submissions = [];
        // Regex matches <tr>...<td title='TIME'>...href='/problems/PROBLEM_ID'...<img src='...tick-icon.gif'...
        const regex = /<tr\s*>.*?<td\s+title='([^']+)'>.*?href='\/problems\/([^']+)'[^>]*>.*?<img src='[^']*tick-icon\.gif'/g;
        let match;
        while ((match = regex.exec(html)) !== null) {
            const timeStr = match[1]; 
            const problemId = match[2];
            
            const timeParts = timeStr.match(/(\d{2}):(\d{2})\s*(AM|PM)\s*(\d{2})\/(\d{2})\/(\d{2})/);
            if (timeParts) {
                let [_, hours, minutes, ampm, day, month, year] = timeParts;
                hours = parseInt(hours, 10);
                if (ampm.toUpperCase() === 'PM' && hours < 12) hours += 12;
                if (ampm.toUpperCase() === 'AM' && hours === 12) hours = 0;
                
                const dateObj = new Date(2000 + parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10), hours, parseInt(minutes, 10));
                
                submissions.push({
                    problemId: problemId.toUpperCase(),
                    timestamp: dateObj.getTime()
                });
            }
        }
        return submissions;
    } catch (error) {
        console.error(`CodeChef Recent API Error for ${handle}:`, error.message);
        return [];
    }
};


const fetchCodeforces = async (handle) => {
    if (!handle || handle.trim() === '') return null;
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
    if (!handle || handle.trim() === '') return null;
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

        const cfHandles = profiles
            .filter(p => p.codeforces_handle && p.codeforces_handle.trim() !== '')
            .map(p => p.codeforces_handle.trim());
        const lcHandles = profiles
            .filter(p => p.leetcode_handle && p.leetcode_handle.trim() !== '')
            .map(p => p.leetcode_handle.trim());

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
                if (stat) leaderboards.codeforces.push({ id: p.id, name: p.name, handle: stat.handle, rating: stat.rating, year });
            }
            if (p.leetcode_handle) {
                const stat = lcData.find(c => c.handle.toLowerCase() === p.leetcode_handle.toLowerCase());
                if (stat) {
                    leaderboards.leetcode_rating.push({ id: p.id, name: p.name, handle: stat.handle, rating: stat.rating, year });
                    leaderboards.leetcode_questions.push({ id: p.id, name: p.name, handle: stat.handle, questions: stat.totalQuestions, year });
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

const computeServerStreak = (solveDates) => {
    if (!solveDates || solveDates.length === 0) return 0;
    const unique = Array.from(new Set(solveDates))
        .filter(Boolean)
        .sort((a, b) => new Date(b) - new Date(a));
    if (unique.length === 0) return 0;

    const daySet = new Set(unique);
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);

    const todayKey = today.toISOString().split('T')[0];
    const yesterdayKey = yesterday.toISOString().split('T')[0];

    if (!daySet.has(todayKey) && !daySet.has(yesterdayKey)) {
        return 0;
    }

    let streak = 0;
    const cursor = daySet.has(todayKey) ? today : yesterday;

    while (true) {
        const key = cursor.toISOString().split('T')[0];
        if (!daySet.has(key)) break;
        streak += 1;
        cursor.setUTCDate(cursor.getUTCDate() - 1);
    }
    return streak;
};

const buildPOTDLeaderboard = (profiles, problems, submissions) => {
    const activeProblemIds = new Set((problems || []).map(p => p.id));
    const problemMap = new Map((problems || []).map(p => [p.id, p]));
    
    const userSolves = new Map();
    const problemSubmissions = new Map();
    
    (submissions || []).forEach(sub => {
        if (!activeProblemIds.has(sub.problem_id)) return;
        
        if (!userSolves.has(sub.user_id)) {
            userSolves.set(sub.user_id, []);
        }
        userSolves.get(sub.user_id).push(sub);
        
        if (!problemSubmissions.has(sub.problem_id)) {
            problemSubmissions.set(sub.problem_id, []);
        }
        problemSubmissions.get(sub.problem_id).push(sub);
    });

    const firstBloodUsers = new Set();
    problemSubmissions.forEach((subs, probId) => {
        subs.sort((a, b) => new Date(a.submission_time) - new Date(b.submission_time));
        if (subs.length > 0) {
            firstBloodUsers.add(subs[0].user_id);
        }
    });

    const leaderboard = [];
    (profiles || []).forEach(user => {
        const hasHandle = (user.codeforces_handle && user.codeforces_handle.trim().length > 0) || 
                          (user.leetcode_handle && user.leetcode_handle.trim().length > 0) ||
                          (user.codechef_handle && user.codechef_handle.trim().length > 0);

        if (!hasHandle) return;
        const displayName = (user.name && user.name.trim().length > 0) ? user.name : "Anonymous coder";

        const userSubs = userSolves.get(user.id) || [];
        const solvedCount = userSubs.length;
        const year = getYearFromCollegeId(user.college_id);

        const solveDates = userSubs.map(sub => {
            const prob = problemMap.get(sub.problem_id);
            return prob ? prob.date : null;
        }).filter(Boolean);
        const streak = computeServerStreak(solveDates);

        // Point calculation
        let totalPoints = 0;
        let lastSolveTimestamp = 0;

        userSubs.forEach(sub => {
            const prob = problemMap.get(sub.problem_id);
            if (!prob) return;

            let basePoints = 100;
            let speedBonus = 0;

            const subTime = new Date(sub.submission_time).getTime();
            const postTime = prob.posted_at ? new Date(prob.posted_at).getTime() : new Date(`${prob.date}T00:00:00Z`).getTime();
            
            if (subTime > lastSolveTimestamp) {
                lastSolveTimestamp = subTime;
            }

            const timeDiffMs = subTime - postTime;
            if (timeDiffMs <= 0) {
                // Solved before it was officially posted or immediately
                speedBonus = 50;
            } else {
                const hoursTaken = timeDiffMs / (1000 * 60 * 60);
                if (hoursTaken < 24) {
                    // Linearly scale from 50 to 0 points over 24 hours
                    speedBonus = Math.max(0, Math.round(50 - (hoursTaken * (50 / 24))));
                }
            }

            totalPoints += (basePoints + speedBonus);
        });

        const badges = [];
        if (firstBloodUsers.has(user.id)) badges.push('first_blood');
        if (streak >= 7) badges.push('streak_7');
        if (streak >= 30) badges.push('streak_30');
        if (streak >= 100) badges.push('streak_100');
        if (solvedCount >= 10) badges.push('problem_master');

        leaderboard.push({
            id: user.id,
            name: displayName,
            handle_cf: user.codeforces_handle || '',
            handle_lc: user.leetcode_handle || '',
            questions: solvedCount,
            score: totalPoints,
            year,
            streak,
            badges,
            lastSolveTime: lastSolveTimestamp || Infinity
        });
    });

    leaderboard.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        if (b.questions !== a.questions) {
            return b.questions - a.questions;
        }
        // Earliest achievement timestamp (lower timestamp reaches tie first)
        return a.lastSolveTime - b.lastSolveTime;
    });

    leaderboard.forEach((user, index) => {
        if (index < 3 && user.score > 0) {
            user.badges.push('top_solver');
        }
    });

    return leaderboard;
};

const refreshPOTDLeaderboardCache = async () => {
    if (isFetchingPOTD) {
        console.log('POTD Fetch already in progress, skipping.');
        return null;
    }
    isFetchingPOTD = true;

    try {
        console.log('Refreshing POTD Leaderboard Cache...');

        // 1. Fetch all registered users
        const { data: profiles, error: profileErr } = await supabase
            .from('profiles')
            .select('id, name, college_id, codeforces_handle, leetcode_handle, codechef_handle');
        if (profileErr) throw profileErr;

        // 2. Fetch all POTD problems
        const { data: problems, error: probErr } = await supabase
            .from('problems')
            .select('id, platform, solution, posted_at, date')
            .not('platform', 'is', null)
            .not('date', 'is', null);
        if (probErr) throw probErr;

        const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const activePOTDs = problems.filter(p => p.date <= todayStr);

        // 3. Fetch all successful submissions
        const { data: submissions, error: subErr } = await supabase
            .from('submissions')
            .select('user_id, problem_id, status, submission_time')
            .eq('status', 'Correct');
        if (subErr) throw subErr;

        // Create helper sets for fast lookup
        const solvedMap = new Map(); // user_id -> Set of problem_ids
        submissions.forEach(sub => {
            if (!solvedMap.has(sub.user_id)) {
                solvedMap.set(sub.user_id, new Set());
            }
            solvedMap.get(sub.user_id).add(sub.problem_id);
        });

        // 4. For each user, check for new solves on external APIs
        const newSolves = [];

        for (const user of profiles) {
            const unsolvedPOTDs = activePOTDs.filter(p => {
                const userSolvedSet = solvedMap.get(user.id);
                return !userSolvedSet || !userSolvedSet.has(p.id);
            });

            if (unsolvedPOTDs.length === 0) continue;

            const unsolvedCF = unsolvedPOTDs.filter(p => p.platform === 'codeforces');
            const unsolvedLC = unsolvedPOTDs.filter(p => p.platform === 'leetcode');
            const unsolvedCC = unsolvedPOTDs.filter(p => p.platform === 'codechef' || (p.solution && p.solution.toLowerCase().includes('codechef')));

            let calledApi = false;

            // Check Codeforces
            if (user.codeforces_handle && user.codeforces_handle.trim() !== '' && unsolvedCF.length > 0) {
                calledApi = true;
                const recentCF = await fetchCodeforcesRecentSubmissions(user.codeforces_handle.trim());
                for (const potd of unsolvedCF) {
                    const coords = getCodeforcesCoords(potd.solution);
                    if (!coords) continue;

                    const potdUploadMs = new Date(`${potd.date}T00:00:00Z`).getTime() - 24 * 60 * 60 * 1000;
                    const potdDeleteMs = potdUploadMs + 72 * 60 * 60 * 1000;

                    const solved = recentCF.some(sub => 
                        sub.contestId === coords.contestId &&
                        sub.index === coords.index &&
                        sub.timestamp >= potdUploadMs &&
                        sub.timestamp < potdDeleteMs
                    );

                    if (solved) {
                        const solvedTime = recentCF.find(sub => 
                            sub.contestId === coords.contestId &&
                            sub.index === coords.index &&
                            sub.timestamp >= potdUploadMs &&
                            sub.timestamp < potdDeleteMs
                        ).timestamp;

                        newSolves.push({
                            user_id: user.id,
                            problem_id: potd.id,
                            status: 'Correct',
                            attempts: 1,
                            submission_time: new Date(solvedTime).toISOString()
                        });

                        // Add to local solvedMap to update current scores correctly
                        if (!solvedMap.has(user.id)) {
                            solvedMap.set(user.id, new Set());
                        }
                        solvedMap.get(user.id).add(potd.id);
                    }
                }
            }

            // Check LeetCode
            if (user.leetcode_handle && user.leetcode_handle.trim() !== '' && unsolvedLC.length > 0) {
                if (calledApi) await delay(300); // respect rate limits between APIs
                calledApi = true;
                const recentLC = await fetchLeetcodeRecentAcSubmissions(user.leetcode_handle.trim());
                for (const potd of unsolvedLC) {
                    const slug = getLeetcodeSlug(potd.solution);
                    if (!slug) continue;

                    const potdUploadMs = new Date(`${potd.date}T00:00:00Z`).getTime() - 24 * 60 * 60 * 1000;
                    const potdDeleteMs = potdUploadMs + 72 * 60 * 60 * 1000;

                    const solved = recentLC.some(sub => 
                        sub.titleSlug === slug &&
                        sub.timestamp >= potdUploadMs &&
                        sub.timestamp < potdDeleteMs
                    );

                    if (solved) {
                        const solvedTime = recentLC.find(sub => 
                            sub.titleSlug === slug &&
                            sub.timestamp >= potdUploadMs &&
                            sub.timestamp < potdDeleteMs
                        ).timestamp;

                        newSolves.push({
                            user_id: user.id,
                            problem_id: potd.id,
                            status: 'Correct',
                            attempts: 1,
                            submission_time: new Date(solvedTime).toISOString()
                        });

                        if (!solvedMap.has(user.id)) {
                            solvedMap.set(user.id, new Set());
                        }
                        solvedMap.get(user.id).add(potd.id);
                    }
                }
            }
            
            // Check CodeChef
            if (user.codechef_handle && user.codechef_handle.trim() !== '' && unsolvedCC.length > 0) {
                if (calledApi) await delay(300);
                calledApi = true;
                const recentCC = await fetchCodechefRecentSubmissions(user.codechef_handle.trim());
                for (const potd of unsolvedCC) {
                    const slug = getCodechefSlug(potd.solution);
                    if (!slug) continue;

                    const potdUploadMs = new Date(`${potd.date}T00:00:00Z`).getTime() - 24 * 60 * 60 * 1000;
                    const potdDeleteMs = potdUploadMs + 72 * 60 * 60 * 1000;

                    const solved = recentCC.some(sub => 
                        sub.problemId === slug &&
                        sub.timestamp >= potdUploadMs &&
                        sub.timestamp < potdDeleteMs
                    );

                    if (solved) {
                        const solvedTime = recentCC.find(sub => 
                            sub.problemId === slug &&
                            sub.timestamp >= potdUploadMs &&
                            sub.timestamp < potdDeleteMs
                        ).timestamp;

                        newSolves.push({
                            user_id: user.id,
                            problem_id: potd.id,
                            status: 'Correct',
                            attempts: 1,
                            submission_time: new Date(solvedTime).toISOString()
                        });

                        if (!solvedMap.has(user.id)) {
                            solvedMap.set(user.id, new Set());
                        }
                        solvedMap.get(user.id).add(potd.id);
                    }
                }
            }

            if (calledApi) {
                await delay(300); // sequential delay between users
            }
        }

        // 5. Persist new solves to Supabase
        if (newSolves.length > 0) {
            console.log(`Saving ${newSolves.length} newly detected POTD solves to Database...`);
            const { error: upsertErr } = await supabase
                .from('submissions')
                .upsert(newSolves, { onConflict: 'user_id,problem_id' });
            
            if (upsertErr) {
                console.error('Failed to upsert new POTD solves:', upsertErr.message);
            }
        }

        // 6. Calculate total POTD score for every user
        const potdLeaderboard = buildPOTDLeaderboard(profiles, activePOTDs, submissions);

        // 7. Persist to Supabase cache
        const { error: cacheWriteErr } = await supabase
            .from('leaderboard_cache')
            .update({ data: potdLeaderboard, last_updated: new Date().toISOString() })
            .eq('platform', 'potd');

        if (cacheWriteErr) {
            console.error('Failed to write POTD leaderboard to cache:', cacheWriteErr.message);
        } else {
            console.log('POTD leaderboard cache written to Supabase successfully.');
        }

        return potdLeaderboard;
    } catch (err) {
        console.error('Error refreshing POTD leaderboard cache:', err.message);
        throw err;
    } finally {
        isFetchingPOTD = false;
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

app.get('/api/potd/leaderboard', async (req, res) => {
    try {
        // 1. Try to serve from Supabase cache first
        const { data, error } = await supabase
            .from('leaderboard_cache')
            .select('platform, data, last_updated')
            .eq('platform', 'potd')
            .single();

        if (!error && data) {
            const age = Date.now() - new Date(data.last_updated).getTime();
            if (age <= CACHE_TTL_MS) {
                console.log('Serving POTD data from Supabase cache.');
                return res.json(data.data);
            }
        }

        // 2. Cache is stale/missing — refresh it
        console.log('POTD Cache is stale or missing, refreshing...');
        const freshData = await refreshPOTDLeaderboardCache();
        res.json(freshData);
    } catch (error) {
        // 3. Fallback: return whatever is in Supabase cache even if stale
        console.error('Falling back to stale Supabase cache for POTD...');
        const { data } = await supabase
            .from('leaderboard_cache')
            .select('data')
            .eq('platform', 'potd')
            .maybeSingle();

        if (data && data.data) {
            return res.json(data.data);
        }
        res.status(500).json({ error: 'Failed to fetch POTD leaderboard data' });
    }
});

// Ensure POTD submissions are up-to-date by refreshing external solves when stale.
// This is required because the UI's "live" endpoints read from `submissions` directly.
const maybeRefreshPOTDSubmissions = async () => {
    try {
        // Use the same cache timestamp written by `refreshPOTDLeaderboardCache`
        const { data, error } = await supabase
            .from('leaderboard_cache')
            .select('last_updated')
            .eq('platform', 'potd')
            .single();

        if (error) {
            // If cache entry missing, we should refresh.
            await refreshPOTDLeaderboardCache();
            return;
        }

        const last = data?.last_updated ? new Date(data.last_updated).getTime() : 0;
        const age = Date.now() - last;

        // Refresh when POTD cache is older than a small window.
        // (Short window to make "accepted" show up quickly.)
        const STALE_WINDOW_MS = 3 * 60 * 1000; // 3 minutes
        if (!last || age > STALE_WINDOW_MS) {
            await refreshPOTDLeaderboardCache();
        }
    } catch (e) {
        console.error('maybeRefreshPOTDSubmissions failed:', e.message);
    }
};

// Live POTD leaderboard computed directly from submissions (no cache delay)
app.get('/api/potd/leaderboard-live', async (req, res) => {
    try {
        await maybeRefreshPOTDSubmissions();
        const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        const [{ data: profiles, error: profilesErr }, { data: problems, error: problemsErr }, { data: submissions, error: submissionsErr }] = await Promise.all([
            supabase
                .from('profiles')
                .select('id, name, college_id, codeforces_handle, leetcode_handle, codechef_handle'),
            supabase
                .from('problems')
                .select('id, date')
                .not('date', 'is', null)
                .lte('date', todayStr),
            supabase
                .from('submissions')
                .select('user_id, problem_id, status, submission_time')
                .eq('status', 'Correct'),
        ]);

        if (profilesErr) throw profilesErr;
        if (problemsErr) throw problemsErr;
        if (submissionsErr) throw submissionsErr;

        const leaderboard = buildPOTDLeaderboard(profiles, problems, submissions);
        res.json(leaderboard);
    } catch (error) {
        console.error('Failed to compute live POTD leaderboard:', error.message);
        res.status(500).json({ error: 'Failed to compute live POTD leaderboard' });
    }
});

// Today's ranking for a specific POTD problem
app.get('/api/potd/today-ranking', async (req, res) => {
    try {
        await maybeRefreshPOTDSubmissions();
        const { problemId } = req.query;
        if (!problemId) {
            return res.status(400).json({ error: 'problemId is required' });
        }

        const { data, error } = await supabase
            .from('submissions')
            .select(`
                user_id,
                submission_time,
                profiles (
                    name,
                    codeforces_handle,
                    leetcode_handle,
                    codechef_handle
                )
            `)
            .eq('problem_id', problemId)
            .eq('status', 'Correct')
            .order('submission_time', { ascending: true });

        if (error) throw error;

        // Filter out empty names & duplicates
        const uniqueSolvers = new Map();
        (data || []).forEach(row => {
            const userId = row.user_id;
            const profile = row.profiles;
            const displayName = (profile && profile.name && profile.name.trim().length > 0) ? profile.name : "Anonymous coder";
            
            if (!uniqueSolvers.has(userId)) {
                uniqueSolvers.set(userId, {
                    user_id: userId,
                    submission_time: row.submission_time,
                    name: displayName,
                    codeforces_handle: profile?.codeforces_handle || '',
                    leetcode_handle: profile?.leetcode_handle || '',
                    codechef_handle: profile?.codechef_handle || ''
                });
            }
        });

        const ranking = Array.from(uniqueSolvers.values());
        
        // Sort by submission_time ascending (earliest solver ranks #1)
        ranking.sort((a, b) => new Date(a.submission_time) - new Date(b.submission_time));

        res.json(ranking);
    } catch (error) {
        console.error('Failed to fetch today POTD ranking:', error.message);
        res.status(500).json({ error: 'Failed to fetch today POTD ranking' });
    }
});

// --- HANDLE VERIFICATION SYSTEM ---

const verificationSessions = new Map();

const fetchLeetcodeBio = async (handle) => {
    if (!handle || handle.trim() === '') return '';
    try {
        const query = `
            query getUserProfile($username: String!) {
                matchedUser(username: $username) {
                    profile {
                        aboutMe
                    }
                }
            }
        `;
        const response = await axios.post('https://leetcode.com/graphql/', {
            query,
            variables: { username: handle }
        }, { headers: { 'Content-Type': 'application/json' } });

        const data = response.data.data;
        if (!data || !data.matchedUser || !data.matchedUser.profile) return '';
        return data.matchedUser.profile.aboutMe || '';
    } catch (error) {
        console.error(`LeetCode Bio API Error for ${handle}:`, error.message);
        return '';
    }
};

app.post('/api/verify/request', async (req, res) => {
    const { userId, platform, handle } = req.body;
    if (!userId || !platform || !handle) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    const cleanPlatform = platform.toLowerCase();
    const cleanHandle = handle.trim();
    const sessionKey = `${userId}-${cleanPlatform}`;

    if (cleanPlatform === 'leetcode') {
        const code = `CONSOLE-LC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        verificationSessions.set(sessionKey, {
            handle: cleanHandle,
            code,
            timestamp: Date.now()
        });
        return res.json({ code });
    } else if (cleanPlatform === 'codeforces') {
        verificationSessions.set(sessionKey, {
            handle: cleanHandle,
            problemId: '4A',
            timestamp: Date.now()
        });
        return res.json({ problemId: '4A', problemTitle: 'Watermelon', problemUrl: 'https://codeforces.com/problemset/problem/4/A' });
    } else {
        return res.status(400).json({ error: 'Invalid platform' });
    }
});

app.get('/api/verify/debug', async (req, res) => {
    const sessions = Array.from(verificationSessions.entries()).map(([k, v]) => ({ key: k, session: v }));
    const handle = req.query.handle;
    let submissions = [];
    let error = null;

    if (handle) {
        try {
            submissions = await fetchCodeforcesRecentSubmissions(handle.trim(), false);
        } catch (err) {
            error = err.message;
        }
    }

    res.json({
        time: new Date().toLocaleString(),
        timestamp: Date.now(),
        sessions,
        handle,
        submissions,
        error
    });
});

app.post('/api/verify/confirm', async (req, res) => {
    const { userId, platform } = req.body;
    if (!userId || !platform) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    const cleanPlatform = platform.toLowerCase();
    const sessionKey = `${userId}-${cleanPlatform}`;
    const session = verificationSessions.get(sessionKey);

    if (!session) {
        return res.status(400).json({ error: 'No active verification session found. Please request verification again.' });
    }

    const { handle, code, timestamp } = session;

    // Session expires after 5 minutes
    if (Date.now() - timestamp > 5 * 60 * 1000) {
      verificationSessions.delete(sessionKey);
      return res.status(400).json({ error: 'Verification session expired. Please request verification again.' });
    }

    try {
        let verified = false;

        if (cleanPlatform === 'leetcode') {
            const bio = await fetchLeetcodeBio(handle);
            if (bio && bio.toLowerCase().includes(code.toLowerCase())) {
                verified = true;
            }
        } else if (cleanPlatform === 'codeforces') {
            const recentSubmissions = await fetchCodeforcesRecentSubmissions(handle, false);
            const verificationSub = recentSubmissions.find(sub => 
                sub.contestId === 4 && 
                sub.index === 'A' &&
                Math.abs(Date.now() - sub.timestamp) <= 10 * 60 * 1000 // Within 10 minutes of current server time (resistant to clock drift)
            );
            if (verificationSub) {
                verified = true;
            }
        }

        if (verified) {
            const updateField = cleanPlatform === 'leetcode' ? 'leetcode_handle' : 'codeforces_handle';
            const { error } = await supabase
                .from('profiles')
                .update({ [updateField]: handle })
                .eq('id', userId);

            if (error) throw error;

            verificationSessions.delete(sessionKey);
            return res.json({ success: true, message: `Successfully verified and connected ${platform} handle: ${handle}` });
        } else {
            return res.status(400).json({ 
                error: cleanPlatform === 'leetcode' 
                    ? `Verification code not found in ReadMe. Please make sure to add "${code}" to your LeetCode profile's ReadMe section.` 
                    : `No recent submission found for Codeforces problem 4A (Watermelon). Please submit the problem and try again.` 
            });
        }
    } catch (err) {
        console.error('Verification confirmation error:', err.message);
        return res.status(500).json({ error: 'An error occurred during verification. Please try again later.' });
    }
});

app.post('/api/verify/disconnect', async (req, res) => {
    const { userId, platform } = req.body;
    if (!userId || !platform) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    const cleanPlatform = platform.toLowerCase();
    const updateField = cleanPlatform === 'leetcode' ? 'leetcode_handle' : 'codeforces_handle';

    try {
        const { error } = await supabase
            .from('profiles')
            .update({ [updateField]: null })
            .eq('id', userId);

        if (error) throw error;

        return res.json({ success: true, message: `Successfully disconnected ${platform} handle.` });
    } catch (err) {
        console.error('Handle disconnection error:', err.message);
        return res.status(500).json({ error: 'An error occurred while disconnecting the handle.' });
    }
});


app.listen(port, () => {
    console.log(`Leaderboard server running on port ${port}`);
    // Warm up the cache on startup
    refreshLeaderboardCache().catch(console.error);
    refreshPOTDLeaderboardCache().catch(console.error);
});

// Background interval to refresh POTD leaderboard cache every 60 seconds
setInterval(() => {
    console.log('Background POTD submissions check...');
    refreshPOTDLeaderboardCache().catch(err => {
        console.error('Background POTD check failed:', err.message);
    });
}, 60000);
