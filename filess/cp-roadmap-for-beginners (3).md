# Competitive Programming Roadmap for Beginners

A module-by-module plan to go from zero to a solid CP foundation. There's no fixed timeline — move to the next module only once you've hit the practice/rating checkpoint given at the end of each one. Rushing through modules without solving enough problems is the #1 reason people plateau early.

**📖 Prefer reading over watching videos?** Every module below has a "study videos" link, but if you'd rather read through concepts at your own pace, these text resources cover almost everything in this roadmap:
- [CP-Algorithms](https://cp-algorithms.com/) — the single best all-round text reference for CP; covers math, graphs, DP, data structures, strings
- [Competitive Programmer's Handbook by Antti Laaksonen](https://cses.fi/book/book.pdf) — free PDF, reads like a structured textbook, maps very closely to this roadmap's order
- [USACO Guide](https://usaco.guide/) — well-organized, has both explanations and linked practice problems per topic
- [GeeksforGeeks CP articles](https://www.geeksforgeeks.org/competitive-programming/) — good for quick topic-specific lookups

**General tools you'll use throughout:**
- **Judge/Practice**: [Codeforces](https://codeforces.com), [CSES Problem Set](https://cses.fi/problemset/), [AtCoder](https://atcoder.jp)
- **Problem Sheet**: [CP-31 by Priyansh Agarwal (TLE Eliminators)](https://www.tle-eliminators.com/cp-sheet) — 31 hand-picked problems per rating band (800 to 1900), each teaching a distinct concept. Very widely used and referenced throughout this roadmap.

Pick **one language** (C++ is strongly preferred in CP for speed and STL) and stick with it.

A note on video resources for CP: **Striver's playlists are excellent but built for DSA/interview prep, not CP.** They overlap well for the early modules (recursion, basic graphs, trees, DP fundamentals), but from Module 8 onward (number theory, segment trees for range queries, CP-style string algorithms, bitmask/advanced DP) you'll get much better mileage from CP-specific creators like **Errichto**, **Colin Galen**, and **WilliamLin**, which are called out explicitly below.

---

## Module 1 — Language Proficiency + Setup
Get fluent in C++ syntax and STL basics before touching algorithms.

- Learn: variables, loops, functions, arrays, pointers/references basics, `vector`, `pair`, `map`, `set`, `string`
- Set up: a local IDE + Codeforces/CSES account + fast I/O template
- 📺 **Study videos**: [Striver's A2Z DSA Course](https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz) — Step 1 (C++ Basics) and Step 2 (STL). Same STL fundamentals apply directly to CP.
- 📖 **Or read**: [CP-Algorithms — nothing on pure STL, so use GfG's STL tutorial](https://www.geeksforgeeks.org/cpp/the-c-standard-template-library-stl/) instead
- Practice: [CSES "Introductory Problems"](https://cses.fi/problemset/list/) (first 5-6 problems)

**✅ Move on when:** you can write a program using vectors/maps/sets without looking up syntax, and you've solved at least 5 CSES intro problems.

## Module 2 — Time Complexity & Math Basics
- Learn: Big-O notation, how to estimate what runs in time limit (rule of thumb: ~10^8 ops/sec)
- Math: GCD/LCM, modular arithmetic, fast exponentiation, basic prime sieve
- 📺 **Study videos**: [Striver's A2Z Course – Time Complexity video](https://www.youtube.com/watch?v=FPu9Uld7W-E) for the complexity basics; for the math portion (this is where CP diverges from typical DSA content), watch [Errichto's Number Theory / Math for CP videos](https://www.youtube.com/@Errichto/search?query=number%20theory)
- 📖 **Or read**: [CP-Algorithms – Number Theory section](https://cp-algorithms.com/#number-theory)
- Practice: Codeforces Div 3/4 problems A-B, CSES "Introductory Problems" (remaining)

**✅ Move on when:** you can look at constraints (e.g., n ≤ 10^5) and correctly guess the required time complexity, and your Codeforces rating (after a couple of Div 4 contests) is roughly 800+.

## Module 3 — Arrays, Sorting, Basic Greedy
- Learn: sorting (`sort()`, custom comparators), two-pointer technique, prefix sums
- Learn: what makes a problem "greedy" and how to prove greedy correctness informally
- 📺 **Study videos**: [Striver's A2Z Course – Sorting Techniques step](https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz) covers sorting well; for greedy specifically watch the **Greedy Algorithms** step in the same A2Z playlist
- 📖 **Or read**: [CSES Sorting and Searching section](https://cses.fi/problemset/list/) (problems double as a reading-based walkthrough via editorials)
- Practice: **CP-31 sheet, 800-rated problems** (do as many of the 31 as you can), plus Codeforces problems tagged `greedy`, rating 800-1200

**✅ Move on when:** you've cleared most of the CP-31 800-rated set and your CF rating is around 900-1000.

## Module 4 — Binary Search
- Learn: binary search on arrays, binary search on answer (a very common CP pattern)
- 📺 **Study videos**: [Striver's Binary Search Master Class — L1 Binary Search Algorithm](https://www.youtube.com/watch?v=SpS9dMj0B_Y), [L2 Binary Search on Sorted Arrays](https://www.youtube.com/watch?v=B4t3NB0478k), [L3 Binary Search on Answer](https://www.youtube.com/watch?v=Kb3KOTQfjew) — this last video especially is core to CP
- 📖 **Or read**: [CP-Algorithms – Binary Search](https://cp-algorithms.com/num_methods/binary_search.html)
- Practice: CSES "Sorting and Searching" (binary search problems), CF problems tagged `binary search`, **CP-31 sheet 900-rated set**

**✅ Move on when:** you can independently identify a "binary search on answer" problem and implement it without bugs, and CF rating is around 1000-1100.

## Module 5 — Recursion & Backtracking
- Learn: recursion fundamentals, generating subsets/permutations, N-Queens style backtracking
- 📺 **Study videos**: [Striver's Recursion & Backtracking playlist](https://www.youtube.com/playlist?list=PLgUwDviBIf0rGlzIn_7rsaR2FQ5e6ZOL9) — this maps directly to what CP needs at this stage
- 📖 **Or read**: [GeeksforGeeks Backtracking articles](https://www.geeksforgeeks.org/dsa/backtracking-algorithms/)
- Practice: CSES "Introductory Problems" (recursive ones), leetcode-style subset/permutation problems, **CP-31 sheet 1000-rated set**

**✅ Move on when:** you're comfortable writing recursive solutions without drawing the recursion tree every time, and CF rating is around 1100.

## Module 6 — Basic Graphs (BFS/DFS)
- Learn: graph representation (adjacency list), BFS, DFS, connected components, cycle detection
- 📺 **Study videos**: [Striver's Graph Series playlist](https://www.youtube.com/playlist?list=PLgUwDviBIf0oE3gA41TKO2H5bHpPd7fzn) — first ~10-12 videos cover BFS/DFS and connected components/cycle detection thoroughly
- 📖 **Or read**: [Striver's Graph Series notes (text version)](https://takeuforward.org/graph/striver-graph-series-top-graph-interview-questions/), [CP-Algorithms – Graphs section](https://cp-algorithms.com/#graphs)
- Practice: CSES "Graph Algorithms" problems: Counting Rooms, Labyrinth, Building Roads, **CP-31 sheet 1100-rated set**

**✅ Move on when:** you can code plain BFS/DFS from scratch in under 5 minutes, and CF rating is around 1100-1200.

## Module 7 — Dynamic Programming Basics
- Learn: memoization vs tabulation, classic patterns — 0/1 Knapsack, LCS, coin change, climbing stairs
- 📺 **Study videos**: [Striver's DP Series playlist](https://www.youtube.com/playlist?list=PLgUwDviBIf0qUlt5H_kiKYaNSqJ81PMMY) — start from the beginning (1D DP) through the Knapsack and LCS sections; this is one of the most thorough free DP playlists available
- 📖 **Or read**: [Striver's DP Series notes (text version)](https://takeuforward.org/dynamic-programming/striver-dp-series-dynamic-programming-problems/), [CSES "Dynamic Programming" section](https://cses.fi/problemset/list/)
- Practice: CSES DP problems (first 6-8 in the list), **CP-31 sheet 1200-rated set**

**✅ Move on when:** you can define a DP state and transition on your own for a new problem (not just recall a memorized pattern), and CF rating is around 1200-1300. This is usually the module people get stuck on longest — that's normal, spend extra time here if needed.

## Module 8 — Number Theory Deep Dive
This is where CP content starts to diverge noticeably from standard DSA/interview material — Striver's playlists don't go deep into competitive number theory, so this module leans on CP-specific creators.

- Learn: sieve of Eratosthenes, prime factorization, modular inverse, combinatorics basics (nCr mod p)
- 📺 **Study videos**: [Errichto's Number Theory / Math playlist](https://www.youtube.com/@Errichto/videos) (search his channel for "modular arithmetic", "combinatorics", "sieve") — these are CP-contest-focused rather than interview-focused
- 📖 **Or read**: [CP-Algorithms – Number Theory](https://cp-algorithms.com/#number-theory) (this is genuinely the best resource for this module, video or not)
- Practice: CF problems tagged `number theory`, `combinatorics`, rating 900-1300, **CP-31 sheet 1300-rated set**

**✅ Move on when:** modular arithmetic and nCr mod p feel routine, and CF rating is around 1300.

## Module 9 — Advanced Graphs
- Learn: shortest paths (Dijkstra, Bellman-Ford), Minimum Spanning Tree (Kruskal/Prim), Union-Find (DSU)
- 📺 **Study videos**: [Striver's Graph Series playlist](https://www.youtube.com/playlist?list=PLgUwDviBIf0oE3gA41TKO2H5bHpPd7fzn) — the shortest path (Dijkstra/Bellman-Ford), MST, and Union-Find/DSU sections later in this same playlist cover this well; this is one topic where Striver's content works great for CP too
- 📖 **Or read**: [Striver's Graph Series notes](https://takeuforward.org/graph/striver-graph-series-top-graph-interview-questions/), [CP-Algorithms – Graph Algorithms](https://cp-algorithms.com/#graphs)
- Practice: CSES: Shortest Routes I/II, Road Reparation, Road Construction, **CP-31 sheet 1400-rated set**

**✅ Move on when:** you can pick the right shortest-path algorithm for a given constraint set (weighted/unweighted, negative edges or not), and CF rating is around 1400.

## Module 10 — Advanced Dynamic Programming
- Learn: DP on subsets (bitmask DP), digit DP, DP on trees
- 📺 **Study videos**: bitmask/digit DP are covered lightly (or not at all) in most DSA-focused playlists including Striver's — search "bitmask dp" and "digit dp" on the [Errichto YouTube channel](https://www.youtube.com/@Errichto/videos) directly (I couldn't confirm one single specific video link for this topic, so search rather than trust a guessed URL); for **DP on trees**, [Striver's DP Series playlist](https://www.youtube.com/playlist?list=PLgUwDviBIf0qUlt5H_kiKYaNSqJ81PMMY) does have a solid tree-DP section near the end
- 📖 **Or read**: [CP-Algorithms – Dynamic Programming](https://cp-algorithms.com/#dynamic-programming) covers bitmask/digit DP in more depth than most video content
- Practice: CSES remaining DP problems, CF `dp` tag rating 1400-1700, **CP-31 sheet 1500-rated set**

**✅ Move on when:** CF rating is around 1500 and you can solve at least one bitmask DP problem independently.

## Module 11 — Data Structures: Segment Tree & Fenwick Tree
Another module where CP diverges from typical DSA prep — segment trees rarely show up in interview-style DSA courses but are essential for CP.

- Learn: range queries/updates, Segment Tree, Binary Indexed Tree (Fenwick), sparse table for static RMQ
- 📺 **Study videos**: search "segment tree" and "Fenwick tree" / "BIT" on the [Errichto YouTube channel](https://www.youtube.com/@Errichto/videos) (again, I couldn't confirm one specific video URL, so search directly); [Striver's A2Z Course](https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz) also has a Segment Tree section under its later steps if you'd rather stay in one playlist
- 📖 **Or read**: [CP-Algorithms – Data Structures](https://cp-algorithms.com/#data-structures) — the segment tree article here is considered one of the best explanations anywhere, text or video
- Practice: CSES "Range Queries" section (all problems), **CP-31 sheet 1600-rated set**

**✅ Move on when:** you can implement a segment tree from memory, and CF rating is around 1600.

## Module 12 — String Algorithms
- Learn: string hashing, KMP algorithm, Z-function, basic trie
- 📺 **Study videos**: search "KMP", "Z function", "string hashing" on [William Lin's channel](https://www.youtube.com/@tmwilliamlin168) (verified handle: tmwilliamlin168 — an IOI winner who posts CP-specific content) for the CP-specific string algorithms; for **tries**, [Striver's Trie Series playlist](https://youtube.com/playlist?list=PLgUwDviBIf0pcIDCZnxhv0LkHf5KzG9zp) works well since tries are the same in both CP and DSA contexts
- 📖 **Or read**: [CP-Algorithms – String Processing](https://cp-algorithms.com/#string-processing)
- Practice: CSES "String Algorithms" section, **CP-31 sheet 1700-1900 rated sets**

**✅ Move on when:** CF rating crosses ~1700-1900 (Expert range) — at this point you've cleared the entire CP-31 sheet and have a genuinely solid foundation.

---

## Module 13 onward — Contest Practice & Rating Push
From here, the focus shifts from learning new topics to **solving volume + participating in contests regularly**. There's no fixed sheet beyond this point — it's about consistent contest participation and targeted upsolving.

- Participate in **every** Codeforces Div 2/Div 3/Div 4 round (unrated practice is fine too, but do it live)
- Do a **virtual contest** (upsolve) once a week for old rounds
- Start reading editorials for problems you couldn't solve within 30-40 minutes
- Explore next: Trees (LCA, Euler tour), advanced DP (digit DP, DP with bitmask + tree), game theory, advanced greedy, two-pointer + sliding window mastery, offline queries (Mo's algorithm)
- 📺 For these advanced/niche topics, **Errichto** and **Colin Galen** are generally the best video resources; Striver's content mostly ends around Module 10-11 in terms of CP relevance
- Track weak topics and revisit them via [CF Problemset filtered by tag](https://codeforces.com/problemset)

---

## General Tips
- **Consistency > intensity**: 1-2 hours daily beats 10 hours once a week.
- **Upsolve unsolved contest problems** within 24-48 hours while it's fresh.
- Don't jump to editorial too fast — struggle for at least 30 minutes first.
- Keep a personal "template" file (fast I/O, common snippets) you reuse in every contest.
- Track your weak areas in a simple spreadsheet/notes file and revisit periodically.
- **On CP-31 specifically**: the sheet's own recommendation is to solve problems rated roughly (your current CF rating − 200) to (your current CF rating + 200) — don't force yourself through bands far above your level.
- **On videos vs reading**: for the earlier modules (1-7), Striver's playlists and CP-Algorithms cover roughly the same ground — pick whichever format you retain better. From Module 8 onward, if you're reading, CP-Algorithms alone is honestly enough; you don't strictly need video for the later modules.
