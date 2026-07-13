# DSA (Data Structures & Algorithms) Roadmap for Beginners

A module-by-module plan to build strong DSA fundamentals — useful for interviews, placements, and as the foundation before/alongside competitive programming. Move to the next module only once you hit the checkpoint at the end of each one; don't rush past a topic just to "finish the list."

**📖 Prefer reading over watching videos?** Every module below has a "study videos" link, but if you'd rather read at your own pace, these text resources cover the same ground:
- [takeuforward.org blog/notes](https://takeuforward.org/) — Striver's written notes exist for almost every topic below and closely mirror his videos, so you can follow the exact same structure while reading instead
- [GeeksforGeeks DSA section](https://www.geeksforgeeks.org/dsa/dsa-tutorial-learn-data-structures-and-algorithms/) — good for quick topic-specific explanations and extra practice problems
- *Cracking the Coding Interview* by Gayle Laakmann McDowell — good text-based resource once you're closer to interview prep (Module 13+)

**General tools you'll use throughout:**
- **Practice**: [LeetCode](https://leetcode.com), [GeeksforGeeks](https://www.geeksforgeeks.org/), [Codeforces](https://codeforces.com) (for some topics)
- **Structured Sheets**: [Striver's A2Z DSA Sheet](https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/) — the most widely used free, structured sheet, and its accompanying playlist is the backbone of the video links below; [Striver's SDE Sheet](https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/) for interview-focused practice later

Pick **one language** (C++, Java, or Python all work fine for DSA/interviews — pick whichever you're comfortable in) and stick with it.

---

## Module 1 — Language + Basic Complexity
Before learning any data structure, be fluent in your language and understand how to reason about efficiency.

- Learn: arrays, loops, functions, basic OOP concepts, and your language's built-in structures (`vector`/`ArrayList`/`list`, `pair`, basic string operations)
- Learn: Time & Space complexity (Big-O, Big-Θ, Big-Ω at a conceptual level), how to analyze a loop/nested loop's complexity
- 📺 **Study videos**: [Striver's A2Z DSA Course playlist](https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz) — Step 1 (Language Basics) and the [Time Complexity video](https://www.youtube.com/watch?v=FPu9Uld7W-E) specifically
- 📖 **Or read**: [Time & Space Complexity notes](https://takeuforward.org/time-complexity/time-and-space-complexity)
- Practice: basic array/loop problems on GfG or LeetCode Easy

**✅ Move on when:** you can state the time complexity of a piece of code just by reading it, without running it.

## Module 2 — Arrays & Basic Math
- Learn: array traversal patterns, prefix sums, subarray problems, basic sorting-related array tricks
- Learn: basic math for DSA — primes, GCD/LCM, basic bit manipulation (AND/OR/XOR, checking a bit)
- 📺 **Study videos**: [Striver's A2Z DSA Course playlist](https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz) — the Arrays step (Step 3) and Basic Maths step cover this
- 📖 **Or read**: [takeuforward Array blogs](https://takeuforward.org/blogs/arrays), [GfG Bit Manipulation articles](https://www.geeksforgeeks.org/dsa/bits-manipulation-important-tactics/)
- Practice: LeetCode Easy/Medium tagged `Array`, ~25-30 problems

**✅ Move on when:** you can solve most Array-tagged Easy problems in under 15 minutes and attempt Mediums without immediately checking the solution.

## Module 3 — Searching & Sorting
- Learn: linear search, binary search (and its many variants — search in rotated array, first/last occurrence, binary search on answer), all major sorts (merge sort, quick sort, and why they matter — stability, in-place, complexity trade-offs)
- 📺 **Study videos**: [Striver's Binary Search Master Class — L1: Binary Search Algorithm](https://www.youtube.com/watch?v=SpS9dMj0B_Y), [L2: Binary Search on Sorted Arrays](https://www.youtube.com/watch?v=B4t3NB0478k), [L3: Binary Search on Answers](https://www.youtube.com/watch?v=Kb3KOTQfjew); for sorting, the Sorting step of the [A2Z playlist](https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz) covers merge sort, quick sort, etc.
- 📖 **Or read**: [takeuforward Binary Search blogs](https://takeuforward.org/blogs/binary-search), [GfG Sorting Algorithms](https://www.geeksforgeeks.org/dsa/sorting-algorithms/)
- Practice: LeetCode `Binary Search` tag (20+ problems), implement merge sort & quick sort from scratch at least once

**✅ Move on when:** you can write binary search without off-by-one bugs on the first try, consistently.

## Module 4 — Hashing & Two Pointers
- Learn: hash maps/sets and when to reach for them, two-pointer technique, sliding window (fixed and variable size)
- 📺 **Study videos**: [Striver's A2Z playlist](https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz) — Hashing step and the Two Pointer/Sliding Window step; for a deeper sliding-window-specific dive, [Aditya Verma's Sliding Window & Two Pointer playlist](https://www.youtube.com/playlist?list=PL_z_8CaSLPWeM8BDJmIYDaoQ5zuwyxnfj) is one of the most recommended anywhere and goes pattern-by-pattern in more depth than most other sources
- 📖 **Or read**: [takeuforward Hashing blogs](https://takeuforward.org/blogs/hashing), [GfG Sliding Window Technique](https://www.geeksforgeeks.org/dsa/window-sliding-technique/)
- Practice: LeetCode `Two Pointers` and `Sliding Window` tags, classic problems like "two sum", "longest substring without repeating characters"

**✅ Move on when:** given a new problem, you can recognize on your own whether it's a hashing, two-pointer, or sliding-window problem.

## Module 5 — Recursion & Backtracking
- Learn: recursion fundamentals (base case, recursive case, recursion tree), backtracking (subsets, permutations, N-Queens, Sudoku solver style problems)
- 📺 **Study videos**: [Striver's Recursion & Backtracking playlist](https://www.youtube.com/playlist?list=PLgUwDviBIf0rGlzIn_7rsaR2FQ5e6ZOL9) — go through this end to end, it's built exactly for this module
- 📖 **Or read**: [GeeksforGeeks Backtracking articles](https://www.geeksforgeeks.org/dsa/backtracking-algorithms/)
- Practice: LeetCode `Backtracking` tag, ~15-20 problems

**✅ Move on when:** you can write a recursive solution for a new problem without drawing out the whole recursion tree on paper first.

## Module 6 — Linked Lists
- Learn: singly/doubly linked lists, reversal, cycle detection (Floyd's algorithm), merging, LRU cache design
- 📺 **Study videos**: [Striver's Linked List Placement Series playlist](https://www.youtube.com/playlist?list=PLgUwDviBIf0r47RKH7fdWN54AbWFgGuii) covers this end to end, from basic traversal through LRU cache design
- 📖 **Or read**: [takeuforward Linked List blogs](https://takeuforward.org/blogs/linked-list)
- Practice: LeetCode `Linked List` tag, ~15-20 problems

**✅ Move on when:** you can reverse a linked list and detect a cycle without referencing notes.

## Module 7 — Stacks & Queues
- Learn: stack/queue fundamentals, monotonic stack, implementing queue using stacks (and vice versa), circular queue, next greater/smaller element pattern
- 📺 **Study videos**: [Aditya Verma's Stack playlist](https://www.youtube.com/playlist?list=PL_z_8CaSLPWdeOezg68SKkeLN4-T_jNHd) is the most commonly recommended resource specifically for the monotonic-stack pattern (next greater/smaller element, histogram problems); the Stack/Queue step of [Striver's A2Z playlist](https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz) also covers the fundamentals well
- 📖 **Or read**: [GfG Stack and Queue articles](https://www.geeksforgeeks.org/dsa/stack-data-structure/)
- Practice: LeetCode `Stack` tag, ~15-20 problems (valid parentheses, next greater element, min stack)

**✅ Move on when:** the "monotonic stack" pattern feels recognizable rather than mysterious.

## Module 8 — Trees & Binary Search Trees
- Learn: binary tree traversals (inorder/preorder/postorder, level order), height/diameter, BST properties, insertion/deletion/search in BST, common tree DP (e.g., max path sum)
- 📺 **Study videos**: [Striver's Tree Series playlist](https://www.youtube.com/playlist?list=PLgUwDviBIf0q8Hkd7bK2Bpryj2xVJk8Vk) — one of the most complete free tree playlists available, covers traversals through BST and tree-DP
- 📖 **Or read**: [Striver's Tree Series notes (text version)](https://takeuforward.org/data-structure/strivers-tree-series-tree-data-structure/)
- Practice: LeetCode `Tree` and `Binary Search Tree` tags, ~25-30 problems

**✅ Move on when:** you can implement all 4 traversals from memory and solve basic tree DP problems.

## Module 9 — Heaps / Priority Queues
- Learn: heap properties, building a heap, priority queue usage patterns, top-K problems, merge K sorted lists
- 📺 **Study videos**: [Aditya Verma's Heap playlist](https://www.youtube.com/playlist?list=PL_z_8CaSLPWdtY9W22VjnPxG30CXNZpI9) — clear, pattern-first explanations of heap-based problems
- 📖 **Or read**: [GfG Heap Data Structure articles](https://www.geeksforgeeks.org/dsa/heap-data-structure/)
- Practice: LeetCode `Heap (Priority Queue)` tag, ~10-15 problems

**✅ Move on when:** you can identify "top-K" or "Kth largest/smallest" problems and reach for a heap instinctively.

## Module 10 — Graphs
- Learn: graph representations, BFS/DFS, connected components, cycle detection (directed & undirected), topological sort, shortest paths (Dijkstra, Bellman-Ford), Union-Find (DSU), MST (Kruskal/Prim)
- 📺 **Study videos**: [Striver's Graph Series playlist](https://www.youtube.com/playlist?list=PLgUwDviBIf0oE3gA41TKO2H5bHpPd7fzn) — this is one of the most comprehensive free graph playlists available and covers everything in this module in order
- 📖 **Or read**: [Striver's Graph Series notes (text version)](https://takeuforward.org/graph/striver-graph-series-top-graph-interview-questions/)
- Practice: LeetCode `Graph` tag + GfG graph practice, ~30-35 problems (this is a big topic — don't rush)

**✅ Move on when:** given a new graph problem, you can identify within a minute or two whether it needs BFS/DFS, shortest path, MST, or Union-Find.

## Module 11 — Dynamic Programming
- Learn: memoization vs tabulation, 1D DP (climbing stairs, house robber), 2D DP (grid paths, LCS, edit distance), knapsack patterns (0/1, unbounded), DP on subsequences, DP on strings
- 📺 **Study videos**: [Striver's DP Series playlist](https://www.youtube.com/playlist?list=PLgUwDviBIf0qUlt5H_kiKYaNSqJ81PMMY) — follows a clear "recursion → memoization → tabulation → space optimization" teaching approach for every pattern; one of the best free DP resources available
- 📖 **Or read**: [Striver's DP Series notes (text version)](https://takeuforward.org/dynamic-programming/striver-dp-series-dynamic-programming-problems/)
- Practice: LeetCode `Dynamic Programming` tag, ~30-40 problems — this is usually the single hardest topic in DSA, budget the most time here

**✅ Move on when:** you can define the DP state and transition for a brand-new problem you haven't seen before, not just recall memorized patterns.

## Module 12 — Tries, Advanced Strings & Greedy
- Learn: trie construction and use cases (autocomplete, word search), greedy algorithm patterns (activity selection, interval scheduling), basic string algorithms (KMP, Rabin-Karp at a conceptual level)
- 📺 **Study videos**: [Striver's Trie Series playlist](https://youtube.com/playlist?list=PLgUwDviBIf0pcIDCZnxhv0LkHf5KzG9zp) for tries; the Greedy step of the [A2Z playlist](https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz) for greedy
- 📖 **Or read**: [GfG Greedy Algorithms section](https://www.geeksforgeeks.org/dsa/greedy-algorithms/)
- Practice: LeetCode `Trie` and `Greedy` tags, ~15-20 problems

**✅ Move on when:** you're comfortable with when greedy applies vs. when it doesn't (and can informally justify why greedy works for a given problem).

---

## Module 13 onward — Interview Prep & Mock Practice
Once you've covered Modules 1-12, the focus shifts to applying everything under interview-like conditions.

- Solve [Striver's SDE Sheet](https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/) end-to-end — it's curated specifically for interview prep
- Do timed mock interviews (Pramp, interviewing.io, or with a friend) — solving under time pressure is a different skill from solving at home
- Revisit weak topics using LeetCode's tag-filtered problem lists
- Practice explaining your thought process out loud while solving — this matters as much as getting the right answer in real interviews
- Start doing "company-tagged" problem lists on LeetCode if targeting specific companies

---

## General Tips
- **Consistency > intensity**: 1-2 hours daily beats a weekend cram.
- Don't jump to the solution too fast — struggle for at least 20-30 minutes on a new problem first.
- Re-solve problems you struggled with after a few days — spaced repetition matters a lot for pattern recognition.
- Keep a personal notes doc of patterns per topic (e.g., "sliding window: use when subarray/substring + contiguous + some condition").
- DSA and Competitive Programming overlap heavily — if you're doing both, Modules 1-11 here map closely to the early modules of a CP roadmap, so you can often combine practice.
- **On videos vs reading**: Striver's written notes on takeuforward.org almost always mirror his videos topic-for-topic, so switching between reading and watching mid-roadmap won't leave gaps — pick whichever you retain better on a given day.
