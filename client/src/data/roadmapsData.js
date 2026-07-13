/**
 * Roadmap static content for the 6 learning tracks.
 */

export const roadmapsData = {
  "cpp": {
    id: "cpp",
    title: "C++ Programming",
    subtitle: "The Cherno C++ series",
    scope: "10 modules",
    color: "#3b82f6",
    description: "Learn C++ as a language — not just syntax, but a real working understanding of how it works under the hood.",
    intro: "A module-by-module plan to learn C++ using The Cherno's C++ series on YouTube. Covers everything from compilation internals to modern C++20 idioms.",
    preferReading: [
      { label: "learncpp.com", url: "https://www.learncpp.com/", desc: "structured text resource, mirrors the video track closely" },
      { label: "cppreference.com", url: "https://en.cppreference.com/", desc: "definitive reference for syntax and standard library" },
      { label: "GeeksforGeeks C++ tutorial", url: "https://www.geeksforgeeks.org/cpp/c-plus-plus/", desc: "quick topic-specific explanations" }
    ],
    generalTools: "g++ or clang compiler, VS Code or CLion, CMake for multi-file projects.",
    modules: [
      {
        id: 1,
        title: "Setup, Syntax & Basics",
        learn: [
          "Variables, data types, operators, input/output (cin/cout)",
          "How compilation works: preprocessor, compiler, linker"
        ],
        videos: [
          { text: "The Cherno C++ Series", url: "https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb" }
        ],
        readings: [
          { text: "learncpp.com — Chapter 1", url: "https://www.learncpp.com/" }
        ],
        practice: "Get a Hello World compiling from the command line (not just an IDE run button) so you understand what's actually happening.",
        checkpoint: "You can explain what happens between writing .cpp code and getting a running program, and you're comfortable with basic I/O."
      },
      {
        id: 2,
        title: "Control Flow & Functions",
        learn: [
          "if/else, loops, switch statements",
          "Functions, function overloading, pass-by-value vs pass-by-reference"
        ],
        videos: [
          { text: "The Cherno C++ Series", url: "https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb" }
        ],
        readings: [
          { text: "learncpp.com — Functions chapter", url: "https://www.learncpp.com/" }
        ],
        practice: "Write programs using functions with both value and reference parameters and notice the difference in behavior.",
        checkpoint: "You understand the practical difference between passing by value and by reference, not just the syntax."
      },
      {
        id: 3,
        title: "Arrays, Strings, Pointers & References",
        learn: [
          "Arrays, C-style strings vs std::string",
          "Pointers, references, pointer arithmetic, stack vs heap"
        ],
        videos: [
          { text: "The Cherno C++ Series", url: "https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb" }
        ],
        readings: [
          { text: "learncpp.com — Pointers and References chapters", url: "https://www.learncpp.com/" }
        ],
        practice: "Write a program that manually manages a dynamically-sized array using raw pointers to feel the pain points before learning the STL.",
        checkpoint: "Pointers and references stop feeling like magic. You can explain what a pointer holds in memory and why references exist."
      },
      {
        id: 4,
        title: "Object-Oriented Programming",
        learn: [
          "Classes, constructors/destructors, encapsulation",
          "Inheritance, polymorphism, virtual functions, abstract classes"
        ],
        videos: [
          { text: "The Cherno C++ Series", url: "https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb" }
        ],
        readings: [
          { text: "learncpp.com — OOP chapters", url: "https://www.learncpp.com/" }
        ],
        practice: "Design a small class hierarchy (Shape → Circle/Rectangle/Triangle) using inheritance and virtual functions.",
        checkpoint: "You can explain why virtual functions are needed and what problem they solve, not just how to write the keyword."
      },
      {
        id: 5,
        title: "Memory Management",
        learn: [
          "Dynamic memory (new/delete), memory leaks",
          "RAII, smart pointers (unique_ptr, shared_ptr, weak_ptr)"
        ],
        videos: [
          { text: "The Cherno C++ Series", url: "https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb" }
        ],
        readings: [
          { text: "learncpp.com — Dynamic memory and smart pointer chapters", url: "https://www.learncpp.com/" }
        ],
        practice: "Take a program written with raw pointers and refactor it to use smart pointers instead.",
        checkpoint: "You default to smart pointers over raw new/delete and understand what RAII is protecting you from."
      },
      {
        id: 6,
        title: "The Standard Template Library (STL)",
        learn: [
          "Containers: vector, map, set, unordered_map",
          "Iterators, algorithms (sort, find, accumulate), when to use which container"
        ],
        videos: [
          { text: "The Cherno C++ Series", url: "https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb" }
        ],
        readings: [
          { text: "cppreference.com — Containers library", url: "https://en.cppreference.com/w/cpp/container.html" }
        ],
        practice: "Rewrite an earlier manual data structure exercise using the appropriate STL container.",
        checkpoint: "Given a new problem, you pick the right STL container without defaulting to vector out of habit."
      },
      {
        id: 7,
        title: "Templates & Generic Programming",
        learn: [
          "Function templates, class templates, template specialization",
          "Why templates exist and how they differ from generics in other languages"
        ],
        videos: [
          { text: "The Cherno C++ Series", url: "https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb" }
        ],
        readings: [
          { text: "learncpp.com — Templates chapter", url: "https://www.learncpp.com/" }
        ],
        practice: "Write a generic container (e.g. a generic Stack<T>) using templates.",
        checkpoint: "You can write a basic templated class or function without copying a pattern from memory."
      },
      {
        id: 8,
        title: "Modern C++ (C++11 through C++20)",
        learn: [
          "auto, lambdas, move semantics and rvalue references",
          "constexpr, structured bindings, range-based for loops"
        ],
        videos: [
          { text: "The Cherno C++ Series", url: "https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb" }
        ],
        readings: [
          { text: "cppreference.com — feature-by-feature reference", url: "https://en.cppreference.com/" }
        ],
        practice: "Refactor an earlier project with modern idioms: range-based for loops, lambdas, and STL algorithms.",
        checkpoint: "Your code starts looking like modern C++ by default rather than C with classes."
      },
      {
        id: 9,
        title: "Multithreading & Performance",
        learn: [
          "std::thread, mutexes, race conditions",
          "Basic profiling and optimization thinking"
        ],
        videos: [
          { text: "The Cherno C++ Series", url: "https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb" }
        ],
        readings: [
          { text: "cppreference.com — Thread support library", url: "https://en.cppreference.com/w/cpp/thread.html" }
        ],
        practice: "Parallelize a simple CPU-bound task using std::thread and observe the speedup.",
        checkpoint: "You understand what a race condition is and how a mutex prevents one."
      },
      {
        id: 10,
        title: "Capstone Project",
        learn: [
          "OOP, STL, memory management, and modern idioms working together",
          "Structuring a non-trivial multi-file project"
        ],
        videos: [
          { text: "The Cherno C++ Series", url: "https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb" }
        ],
        readings: [
          { text: "learncpp.com (reference review)", url: "https://www.learncpp.com/" }
        ],
        practice: "Build a non-trivial CLI application from scratch — a small game, command-line utility, or data-processing tool.",
        checkpoint: "A complete, compiled C++ application pushed to GitHub showing proper resource management and modern idioms."
      }
    ]
  },

  "cp": {
    id: "cp",
    title: "Competitive Programming",
    subtitle: "Codeforces + CSES + TLE CP-31 Sheet",
    scope: "8 modules",
    color: "#ef4444",
    description: "Go from zero to Codeforces-rated through structured STL usage, CP math, and graded problem sets.",
    intro: "A focused roadmap for competitive programming built around the TLE Eliminators CP-31 sheet by Priyansh Agarwal. Skips interview-style DSA entirely. Follows STL usage, math, core techniques, and then live contest practice using graded Codeforces problem sets.",
    preferReading: [
      { label: "CP-Algorithms", url: "https://cp-algorithms.com/", desc: "best all-round text reference for CP math and algorithms" },
      { label: "Competitive Programmer's Handbook", url: "https://cses.fi/book/book.pdf", desc: "free textbook closely mapping STL and complexity" },
      { label: "USACO Guide", url: "https://usaco.guide/", desc: "well-organized syllabus with explanations and linked practice" }
    ],
    generalTools: "Codeforces account, CSES account, CP-31 Sheet (TLE Eliminators), C++ with fast I/O template.",
    modules: [
      {
        id: 1,
        title: "C++ STL Essentials",
        learn: [
          "Vectors, pairs, maps, sets, unordered_map, multiset, priority_queue, deque",
          "Fast I/O template (ios_base::sync_with_stdio, cin.tie), local setup, Codeforces account"
        ],
        videos: [
          { text: "Striver's A2Z DSA — Step 2: STL Tutorial", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz" }
        ],
        readings: [
          { text: "GeeksforGeeks C++ STL Tutorial", url: "https://www.geeksforgeeks.org/cpp/the-c-standard-template-library-stl/" }
        ],
        practice: "Solve CSES Introductory Problems (first 6). Problem set: CP-31 sheet — 800-rated set (all problems).",
        checkpoint: "You can write programs using vectors/maps/sets without looking up syntax and have solved the 6 CSES intro problems."
      },
      {
        id: 2,
        title: "Time Complexity & Number Theory",
        learn: [
          "Big-O notation, 10^8 ops/sec rule of thumb, loop complexity estimation",
          "GCD/LCM, modular arithmetic, fast exponentiation (binary exponentiation), Sieve of Eratosthenes"
        ],
        videos: [
          { text: "Errichto — Modular Arithmetic, GCD & Number Theory", url: "https://www.youtube.com/@Errichto" }
        ],
        readings: [
          { text: "CP-Algorithms — Number Theory section", url: "https://cp-algorithms.com/#number-theory" }
        ],
        practice: "CSES — Introductory Problems (remaining). Problem sets: CP-31 sheet — 900-rated set. Codeforces Div 3/4 A and B problems.",
        checkpoint: "You can look at constraints (n <= 10^5) and guess the required complexity class. CF rating is 800+."
      },
      {
        id: 3,
        title: "Sorting, Searching & Binary Search",
        learn: [
          "sort() with custom comparators, merge sort (divide and conquer), inversion count",
          "Binary search on sorted arrays, binary search on answer (minimise maximum, find first valid)"
        ],
        videos: [
          { text: "Errichto — Binary Search Tutorial", url: "https://www.youtube.com/watch?v=GU7DpgHINWQ" }
        ],
        readings: [
          { text: "CP-Algorithms — Binary Search", url: "https://cp-algorithms.com/num_methods/binary_search.html" }
        ],
        practice: "CSES — Sorting and Searching section (first 10 problems). Problem sets: CP-31 sheet — 1000-rated set. CF Div 3/4 C problems.",
        checkpoint: "You can write binary search without off-by-one bugs on the first try and implement binary search on answer for new problems."
      },
      {
        id: 4,
        title: "Two Pointers, Prefix Sums & Greedy",
        learn: [
          "Two-pointer technique (sorted arrays, subarrays), variable-size sliding window",
          "Prefix sums (1D and 2D), greedy patterns — activity selection, interval scheduling, exchange arguments"
        ],
        videos: [
          { text: "Errichto — Greedy Algorithms", url: "https://www.youtube.com/@Errichto" }
        ],
        readings: [
          { text: "USACO Guide — Two Pointers and Greedy", url: "https://usaco.guide/silver/two-pointers?lang=cpp" }
        ],
        practice: "CSES — Sorting and Searching (remaining). Problem sets: CP-31 sheet — 1100-rated set. CF Div 3/4 C and D problems.",
        checkpoint: "You can identify whether a subarray problem needs two pointers, prefix sums, or sliding window within 2 minutes of reading."
      },
      {
        id: 5,
        title: "Graph Traversals for CP",
        learn: [
          "Adjacency list representation, BFS (shortest path on unweighted graphs), DFS (connected components, cycle detection)",
          "Topological sort (Kahn's algorithm), Dijkstra's algorithm (priority queue variant)"
        ],
        videos: [
          { text: "Errichto — Graph Theory", url: "https://www.youtube.com/@Errichto" }
        ],
        readings: [
          { text: "CP-Algorithms — Graph section", url: "https://cp-algorithms.com/#graphs" }
        ],
        practice: "CSES — Graph Algorithms section (first 8 problems). Problem sets: CP-31 sheet — 1200-rated set. CF Div 2 B and C problems.",
        checkpoint: "Given a new graph problem, you identify within 2 minutes whether it needs BFS, DFS, topological sort, or Dijkstra."
      },
      {
        id: 6,
        title: "Dynamic Programming Fundamentals",
        learn: [
          "Memoization vs tabulation, 1D DP (climbing stairs, coin change, rod cutting)",
          "2D DP (grid paths, LCS, LIS), knapsack (0/1 and unbounded)"
        ],
        videos: [
          { text: "Errichto — Dynamic Programming", url: "https://www.youtube.com/watch?v=YBSt1jYwVfU" }
        ],
        readings: [
          { text: "CP-Algorithms — Dynamic Programming section", url: "https://cp-algorithms.com/#dynamic-programming" }
        ],
        practice: "CSES — Dynamic Programming section (first 8 problems). Problem sets: CP-31 sheet — 1300-rated set.",
        checkpoint: "You can define the state and transition for a brand-new DP problem and implement it without hints."
      },
      {
        id: 7,
        title: "Data Structures for CP",
        learn: [
          "Segment tree (range sum, range min/max queries), Fenwick tree (BIT) for prefix sums",
          "Disjoint Set Union (DSU / Union-Find) for connected components and Kruskal's MST"
        ],
        videos: [
          { text: "Errichto — Segment Trees and Fenwick Trees", url: "https://www.youtube.com/@Errichto" }
        ],
        readings: [
          { text: "CP-Algorithms — Data Structures section", url: "https://cp-algorithms.com/#data_structures" }
        ],
        practice: "CSES — Range Queries section (first 5 problems). Problem sets: CP-31 sheet — 1400 to 1600-rated set.",
        checkpoint: "You can implement a Fenwick tree and basic segment tree from memory, and know when to reach for DSU."
      },
      {
        id: 8,
        title: "CP Sheets, Live Contests & Upsolving",
        learn: [
          "Contest strategy: reading all problems first, estimating difficulty order, skipping and returning",
          "Upsolving: solving unaccepted problems within 24 hours using editorials correctly"
        ],
        videos: [
          { text: "Colin Galen — How to Practice Competitive Programming", url: "https://www.youtube.com/@ColinGalen" }
        ],
        readings: [
          { text: "CP-31 Sheet by TLE Eliminators (Priyansh Agarwal)", url: "https://www.tle-eliminators.com/cp-sheet" },
          { text: "CSES Problem Set (full list)", url: "https://cses.fi/problemset/list/" }
        ],
        practice: "Complete all remaining CP-31 sheet problems (1600+ rated). Participate in a minimum of 10 live Codeforces Div 2/3 rated rounds. Target: reach CF rating 1200+.",
        checkpoint: "You have participated in 10+ live contests with upsolving, completed the CP-31 sheet through 1600-rated problems, and your CF rating is climbing consistently."
      }
    ]
  },

  "dsa": {
    id: "dsa",
    title: "Data Structures & Algorithms",
    subtitle: "Striver's takeuforward playlists",
    scope: "13 modules",
    color: "#22c55e",
    description: "Build strong problem-solving skills with DSA fundamentals for coding interviews and placements.",
    intro: "A module-by-module plan to build strong DSA fundamentals for interviews and placements. Uses Striver's specific topic playlist links from takeuforward.",
    preferReading: [
      { label: "takeuforward.org notes", url: "https://takeuforward.org/", desc: "Striver's written notes, mirroring the playlists exactly" },
      { label: "GeeksforGeeks DSA section", url: "https://www.geeksforgeeks.org/dsa/dsa-tutorial-learn-data-structures-and-algorithms/", desc: "quick topic-specific explanations" }
    ],
    generalTools: "LeetCode account, GFG account, Striver's A2Z Sheet and SDE Sheet. Language: C++, Java, or Python.",
    modules: [
      {
        id: 1,
        title: "Language + Basic Complexity",
        learn: [
          "Arrays, loops, functions, basic OOP, built-in containers",
          "Time and Space complexity (Big-O, Big-Theta, Big-Omega), loop analysis"
        ],
        videos: [
          { text: "Striver's A2Z DSA — Step 1: Language Basics and Complexities", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz" }
        ],
        readings: [
          { text: "takeuforward — Time and Space Complexity notes", url: "https://takeuforward.org/time-complexity/time-and-space-complexity" }
        ],
        practice: "Basic array and loop traversal problems on GfG or LeetCode Easy.",
        checkpoint: "You can state the time complexity of a piece of code just by reading it, without running it."
      },
      {
        id: 2,
        title: "Arrays & Basic Math",
        learn: [
          "Array traversal patterns, prefix sums, subarray problems",
          "Basic math: primes, GCD/LCM, basic bit manipulation"
        ],
        videos: [
          { text: "Striver's A2Z DSA — Step 3: Arrays and Basic Maths", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz" }
        ],
        readings: [
          { text: "takeuforward Array blogs", url: "https://takeuforward.org/blogs/arrays" }
        ],
        practice: "LeetCode Easy/Medium tagged Array (solve 25-30 problems).",
        checkpoint: "You can solve most Array Easy problems in under 15 minutes and attempt Mediums without checking solutions."
      },
      {
        id: 3,
        title: "Searching & Sorting",
        learn: [
          "Linear search, binary search (rotated arrays, first/last occurrence, search on answer)",
          "Merge sort, quick sort, stability, in-place sort, complexity tradeoffs"
        ],
        videos: [
          { text: "Striver's Binary Search Playlist — Master Class", url: "https://www.youtube.com/watch?v=Kb3KOTQfjew" }
        ],
        readings: [
          { text: "takeuforward Binary Search blogs", url: "https://takeuforward.org/blogs/binary-search" }
        ],
        practice: "LeetCode Binary Search tag (20+ problems), implement merge and quick sort from scratch once.",
        checkpoint: "You can write binary search without off-by-one bugs on the first try, consistently."
      },
      {
        id: 4,
        title: "Hashing & Two Pointers",
        learn: [
          "Hash maps/sets and when to use them",
          "Two-pointer technique, fixed/variable size sliding window"
        ],
        videos: [
          { text: "Striver's A2Z DSA — Step 3: Two Pointer and Sliding Window", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz" }
        ],
        readings: [
          { text: "takeuforward Hashing blogs", url: "https://takeuforward.org/blogs/hashing" }
        ],
        practice: "LeetCode Two Pointers and Sliding Window tags (e.g. Two Sum, Longest Substring without repeating chars).",
        checkpoint: "Given a new problem, you recognize whether it's hashing, two-pointer, or sliding-window within reading it."
      },
      {
        id: 5,
        title: "Recursion & Backtracking",
        learn: [
          "Recursion fundamentals (base cases, recursion trees)",
          "Backtracking (subsets, permutations, N-Queens, Sudoku solver)"
        ],
        videos: [
          { text: "Striver's Recursion and Backtracking Playlist", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0rGlzIn_7rsaR2FQ5e6ZOL9" }
        ],
        readings: [
          { text: "GeeksforGeeks Backtracking articles", url: "https://www.geeksforgeeks.org/dsa/backtracking-algorithms/" }
        ],
        practice: "LeetCode Backtracking tag, 15-20 problems.",
        checkpoint: "You can write a recursive solution for a new problem without drawing the recursion tree on paper first."
      },
      {
        id: 6,
        title: "Linked Lists",
        learn: [
          "Singly/doubly linked lists, reversal",
          "Cycle detection (Floyd's algorithm), merging, LRU cache design"
        ],
        videos: [
          { text: "Striver's Linked List Playlist", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0r47RKH7fdWN54AbWFgGuii" }
        ],
        readings: [
          { text: "takeuforward Linked List blogs", url: "https://takeuforward.org/blogs/linked-list" }
        ],
        practice: "LeetCode Linked List tag (15-20 problems: reverse, cycle detection, merge lists).",
        checkpoint: "You can reverse a linked list and detect a cycle without referencing notes."
      },
      {
        id: 7,
        title: "Stacks & Queues",
        learn: [
          "Stack/queue fundamentals, implementing queue using stacks, circular queues",
          "Monotonic stack pattern (next greater/smaller element)"
        ],
        videos: [
          { text: "Striver's Stacks and Queues Playlist", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz" }
        ],
        readings: [
          { text: "GfG Stack and Queue articles", url: "https://www.geeksforgeeks.org/dsa/stack-data-structure/" }
        ],
        practice: "LeetCode Stack tag (15-20 problems: Valid Parentheses, Min Stack, Next Greater Element).",
        checkpoint: "The monotonic stack pattern feels recognizable rather than mysterious."
      },
      {
        id: 8,
        title: "Trees & Binary Search Trees",
        learn: [
          "Binary tree traversals (in/pre/post/level order), height/diameter",
          "BST properties, insertion, deletion, search, validation, basic tree DP"
        ],
        videos: [
          { text: "Striver's Tree Series Playlist", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0q8Hkd7bK2Bpryj2xVJk8Vk" }
        ],
        readings: [
          { text: "Striver's Tree Series notes", url: "https://takeuforward.org/data-structure/strivers-tree-series-tree-data-structure/" }
        ],
        practice: "LeetCode Tree and BST tags (solve 25-30 problems).",
        checkpoint: "You can implement all 4 tree traversals from memory and solve basic tree DP problems."
      },
      {
        id: 9,
        title: "Heaps & Priority Queues",
        learn: [
          "Heap properties, building a heap, priority queue patterns",
          "Top-K problems, merge K sorted lists"
        ],
        videos: [
          { text: "Striver's Heaps and Priority Queues Playlist", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz" }
        ],
        readings: [
          { text: "GfG Heap Data Structure articles", url: "https://www.geeksforgeeks.org/dsa/heap-data-structure/" }
        ],
        practice: "LeetCode Heap (Priority Queue) tag (10-15 problems: Kth largest, merge K sorted).",
        checkpoint: "You identify top-K or Kth largest/smallest problems and reach for a heap instinctively."
      },
      {
        id: 10,
        title: "Graphs",
        learn: [
          "Representations, BFS/DFS, connected components, cycle detection (directed/undirected)",
          "Topological sort, shortest paths (Dijkstra, Bellman-Ford), DSU, MST"
        ],
        videos: [
          { text: "Striver's Graph Series Playlist", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oE3gA41TKO2H5bHpPd7fzn" }
        ],
        readings: [
          { text: "Striver's Graph Series notes", url: "https://takeuforward.org/graph/striver-graph-series-top-graph-interview-questions/" }
        ],
        practice: "LeetCode Graph tag (solve 30-35 problems like Number of Islands, Course Schedule).",
        checkpoint: "Given a new graph problem, you identify within 2 minutes whether it needs BFS/DFS, shortest paths, MST, or Union-Find."
      },
      {
        id: 11,
        title: "Dynamic Programming",
        learn: [
          "Memoization vs tabulation, 1D DP (climbing stairs, robber)",
          "2D/Grid DP, Knapsack (0/1, unbounded), DP on subsequences and strings"
        ],
        videos: [
          { text: "Striver's DP Series Playlist", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0qUlt5H_kiKYaNSqJ81PMMY" }
        ],
        readings: [
          { text: "Striver's DP Series notes", url: "https://takeuforward.org/dynamic-programming/striver-dp-series-dynamic-programming-problems/" }
        ],
        practice: "LeetCode DP tag (solve 30-40 problems; budget the most time here).",
        checkpoint: "You can define the state and transitions for a brand-new DP problem you haven't seen before."
      },
      {
        id: 12,
        title: "Tries, Greedy & Advanced Strings",
        learn: [
          "Trie construction and autocomplete/word search uses",
          "Greedy patterns (activity selection, interval scheduling), basic string matching (KMP conceptual)"
        ],
        videos: [
          { text: "Striver's Trie Series Playlist", url: "https://youtube.com/playlist?list=PLgUwDviBIf0pcIDCZnxhv0LkHf5KzG9zp" }
        ],
        readings: [
          { text: "GfG Greedy Algorithms section", url: "https://www.geeksforgeeks.org/dsa/greedy-algorithms/" }
        ],
        practice: "LeetCode Trie and Greedy tags (15-20 problems).",
        checkpoint: "You're comfortable with when greedy applies vs when it doesn't, and can justify why greedy works."
      },
      {
        id: 13,
        title: "Interview Prep & Mock Practice",
        learn: [
          "Applying concepts under timed pressure, explaining thought process out loud",
          "Curated sheets: Striver's SDE Sheet"
        ],
        videos: [
          { text: "Striver's SDE Sheet Tutorial Videos", url: "https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/" }
        ],
        readings: [
          { text: "takeuforward SDE Sheet problems", url: "https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/" }
        ],
        practice: "Solve Striver's SDE Sheet end-to-end, do timed mock interviews on Pramp or interviewing.io.",
        checkpoint: "You can explain your logic verbally while solving and code solutions within 30-45 minutes."
      }
    ]
  },

  "webdev": {
    id: "webdev",
    title: "Web Development",
    subtitle: "Piyush Garg · Chai aur Code · CodeWithHarry",
    scope: "12 modules",
    color: "#f59e0b",
    description: "Build modern full-stack websites from HTML/CSS to advanced React and Node.js backends.",
    intro: "A module-by-module full-stack web development roadmap. Uses CodeWithHarry for HTML/CSS, Piyush Garg for JavaScript and Node.js backend, and Chai aur Code for React.",
    preferReading: [
      { label: "MDN Web Docs", url: "https://developer.mozilla.org/", desc: "the gold standard reference for HTML, CSS, and JavaScript" },
      { label: "CodeWithHarry Notes", url: "https://www.codewithharry.com/tutorials", desc: "text tutorials mirroring his videos topic-by-topic" }
    ],
    generalTools: "VS Code, GitHub account, Node.js, Postman for API testing.",
    modules: [
      {
        id: 1,
        title: "How the Web Works + HTML",
        learn: [
          "Client-server model, HTTP requests, HTML structure, forms, semantic tags"
        ],
        videos: [
          { text: "CodeWithHarry's HTML Playlist", url: "https://www.youtube.com/playlist?list=PLV4pXOVqAJqhMfM_WbL2ofB57-luFSCI1" }
        ],
        readings: [
          { text: "MDN HTML Basics", url: "https://developer.mozilla.org/en-US/docs/Web/HTML" }
        ],
        practice: "Build 2-3 static pages (resume, product landing page) using raw HTML.",
        checkpoint: "You can structure a full webpage from blank files without any reference."
      },
      {
        id: 2,
        title: "CSS + Responsive Design",
        learn: [
          "Box model, flexbox, CSS grid, media queries, responsive design principles"
        ],
        videos: [
          { text: "CodeWithHarry's CSS Playlist", url: "https://www.codewithharry.com/tutorial/css-home" }
        ],
        readings: [
          { text: "MDN CSS Basics and Layouts", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" }
        ],
        practice: "Rebuild Module 1 pages to be fully responsive and attempt recreating a real website's layout.",
        checkpoint: "You can build a responsive layout with flexbox and grid without looking up basic properties."
      },
      {
        id: 3,
        title: "JavaScript Fundamentals",
        learn: [
          "Variables, data types, functions, loops, conditionals, arrays, objects, scope"
        ],
        videos: [
          { text: "Piyush Garg's Full JavaScript Playlist", url: "https://www.youtube.com/playlist?list=PLinedj3B30sDFRdgPYvjnBs2JsDdHPIMv" }
        ],
        readings: [
          { text: "MDN JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" }
        ],
        practice: "Build a calculator or to-do list using vanilla JS.",
        checkpoint: "You can write functions, loop through arrays/objects, and reason about scope without confusion."
      },
      {
        id: 4,
        title: "DOM Manipulation + Git/GitHub",
        learn: [
          "Selecting and manipulating DOM elements, event listeners",
          "Git basics (init, commit, push, branches, merge) and GitHub workflow"
        ],
        videos: [
          { text: "Chai aur Code — Git and GitHub Playlist", url: "https://docs.chaicode.com/youtube/chai-aur-git/welcome/" }
        ],
        readings: [
          { text: "Chai aur Docs — Git and GitHub", url: "https://docs.chaicode.com/youtube/chai-aur-git/welcome/" }
        ],
        practice: "Build an interactive DOM project (quiz app, image gallery) and push it to GitHub.",
        checkpoint: "You can manipulate the DOM in response to user inputs, and commit/push/branch on Git without hesitation."
      },
      {
        id: 5,
        title: "Advanced JavaScript (ES6+, Async, APIs)",
        learn: [
          "Arrow functions, destructuring, spread/rest, promises, async/await, fetch, third-party APIs"
        ],
        videos: [
          { text: "Piyush Garg's JavaScript Playlist (ES6+ and Async section)", url: "https://www.youtube.com/playlist?list=PLinedj3B30sDFRdgPYvjnBs2JsDdHPIMv" }
        ],
        readings: [
          { text: "MDN — Asynchronous JavaScript", url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous" }
        ],
        practice: "Build a weather app or GitHub-profile-lookup app that fetches from a public API.",
        checkpoint: "Async/await and promise chains feel natural, and you can consume public APIs confidently."
      },
      {
        id: 6,
        title: "React Basics",
        learn: [
          "Components, JSX, props, state, useState and useEffect, conditional rendering, lists"
        ],
        videos: [
          { text: "Chai aur Code — React Playlist", url: "https://www.youtube.com/playlist?list=PLu71SKxNbfoDqgPchmvIsL4hTnJIrtige" }
        ],
        readings: [
          { text: "React official docs — Learn React", url: "https://react.dev/learn" }
        ],
        practice: "Rebuild one of your earlier vanilla JS projects in React.",
        checkpoint: "You can build a multi-component app with props and state flowing correctly between them."
      },
      {
        id: 7,
        title: "React Advanced (Router, Context, State Management)",
        learn: [
          "React Router for client-side routing, Context API, Redux Toolkit basics, custom hooks"
        ],
        videos: [
          { text: "Chai aur Code — Advanced React, Redux and State Management", url: "https://www.youtube.com/playlist?list=PLu71SKxNbfoDqgPchmvIsL4hTnJIrtige" }
        ],
        readings: [
          { text: "React Router documentation", url: "https://reactrouter.com/" }
        ],
        practice: "Build a multi-page app with routing and global state (shopping cart, notes app).",
        checkpoint: "You can decide when to use local state vs Context vs Redux, and implement whichever you choose."
      },
      {
        id: 8,
        title: "Backend: Node.js + Express",
        learn: [
          "Node.js fundamentals, Express routing, middleware, request/response cycle, REST API design"
        ],
        videos: [
          { text: "Piyush Garg's Master NodeJS Playlist", url: "https://www.youtube.com/playlist?list=PLinedj3B30sDby4Al-i13hQJGQoRQDfPo" }
        ],
        readings: [
          { text: "Express.js guide to routing and middleware", url: "https://expressjs.com/en/guide/routing.html" }
        ],
        practice: "Build a simple REST API (notes API with CRUD routes returning JSON).",
        checkpoint: "You can build a working REST API with multiple routes and middleware without referencing a tutorial."
      },
      {
        id: 9,
        title: "Databases: MongoDB + SQL Basics",
        learn: [
          "MongoDB fundamentals, Mongoose schemas/models, database connections",
          "Basic grounding in SQL (tables, joins, queries)"
        ],
        videos: [
          { text: "Chai aur Code — Backend Playlist (MongoDB and Connections)", url: "https://www.youtube.com/playlist?list=PLu71SKxNbfoBGh_8p_NS-ZAh6v7HhYqHW" }
        ],
        readings: [
          { text: "MongoDB official documentation", url: "https://www.mongodb.com/docs/" }
        ],
        practice: "Connect your Module 8 API to a real MongoDB database (Atlas free tier).",
        checkpoint: "Your API performs full CRUD operations against a real database."
      },
      {
        id: 10,
        title: "Auth & Full Backend Projects",
        learn: [
          "Authentication (JWT, cookies, sessions), password hashing (bcrypt), file uploads, production structure"
        ],
        videos: [
          { text: "Piyush Garg's NodeJS Backend — Auth and Projects", url: "https://www.youtube.com/playlist?list=PLinedj3B30sDby4Al-i13hQJGQoRQDfPo" }
        ],
        readings: [
          { text: "Piyush Garg GitHub — project code and README", url: "https://github.com/piyushgarg-dev" }
        ],
        practice: "Build your own backend project with login/signup, protected routes, and file uploads.",
        checkpoint: "You can implement authentication and protected routes in a backend project from scratch."
      },
      {
        id: 11,
        title: "Deployment & Basic DevOps",
        learn: [
          "Environment variables, frontend hosting (Vercel/Netlify), backend hosting (Render/Railway), Docker basics"
        ],
        videos: [
          { text: "Chai aur Code — Docker and DevOps Videos", url: "https://www.youtube.com/@chaiaurcode" }
        ],
        readings: [
          { text: "Vercel deployments docs", url: "https://vercel.com/docs" }
        ],
        practice: "Deploy a full-stack project end-to-end (frontend + backend + database) on a public URL.",
        checkpoint: "You have successfully deployed at least one full-stack project accessible via a public link."
      },
      {
        id: 12,
        title: "Full Stack Capstone Project",
        learn: [
          "Combining frontend, backend, auth, database, and deployments into a single production application"
        ],
        videos: [
          { text: "CodeWithHarry's Sigma Course Project Playlist", url: "https://www.youtube.com/playlist?list=PLu0W_9lII9agq5TrH9XLIKQvv0iaF2X3w" }
        ],
        readings: [
          { text: "MDN Web Docs (reference check)", url: "https://developer.mozilla.org/" }
        ],
        practice: "Build, deploy, and document a complete capstone project (e-commerce, blogging platform, or social app).",
        checkpoint: "A functional, fully deployed production-grade capstone is pushed to GitHub."
      }
    ]
  },

  "appdev": {
    id: "appdev",
    title: "App Development",
    subtitle: "Chai aur Code · CodeWithHarry",
    scope: "9 modules",
    color: "#ec4899",
    description: "Create cross-platform mobile apps with React Native or go deep on native Android with Kotlin/Java.",
    intro: "A module-by-module plan for mobile app development using Expo React Native (Track A) or native Android with Kotlin/Java (Track B).",
    preferReading: [
      { label: "React Native official docs", url: "https://reactnative.dev/docs/getting-started", desc: "Track A reference" },
      { label: "Android Developers official docs", url: "https://developer.android.com/courses", desc: "Track B structured courses" }
    ],
    generalTools: "Track A: Node.js, Expo CLI, emulators. Track B: Android Studio. Language: JS/TS or Java/Kotlin.",
    modules: [
      {
        id: 1,
        title: "Mobile Dev Fundamentals & Setup",
        learn: [
          "Mobile vs web apps (lifecycle, native APIs, stores)",
          "Track A: Node.js + Expo CLI setup. Track B: Android Studio + emulators"
        ],
        videos: [
          { text: "Chai aur React Native — starts from setup", url: "https://www.youtube.com/playlist?list=PLu71SKxNbfoAKL_sTfg5CgCxlrpH5b2jS" }
        ],
        readings: [
          { text: "Expo CLI Getting Started guide", url: "https://docs.expo.dev/tutorial/introduction/" }
        ],
        practice: "Get a Hello World app running on an emulator or your physical phone.",
        checkpoint: "You can run and see changes reflected live on an emulator or device without setup issues."
      },
      {
        id: 2,
        title: "Language Refresher",
        learn: [
          "Track A: JS fundamentals and React hooks",
          "Track B: Java fundamentals or Kotlin basics"
        ],
        videos: [
          { text: "CodeWithHarry's Android Playlist (Java Refresher chapter)", url: "https://www.youtube.com/playlist?list=PLu0W_9lII9aiL0kysYlfSOUgY5rNlOhUd" }
        ],
        readings: [
          { text: "Kotlin Basics reference guide", url: "https://developer.android.com/courses" }
        ],
        practice: "Perform small logic exercises in your chosen language until syntax feels automatic.",
        checkpoint: "You are not stopping to look up basic syntax while writing simple programs."
      },
      {
        id: 3,
        title: "Core UI Components & Navigation",
        learn: [
          "Track A: View, Text, ScrollView, FlatList, StyleSheet, React Navigation",
          "Track B: Activities, XML layouts, Intents for navigation"
        ],
        videos: [
          { text: "Chai aur React Native — UI Components and Navigation", url: "https://www.youtube.com/playlist?list=PLu71SKxNbfoAKL_sTfg5CgCxlrpH5b2jS" }
        ],
        readings: [
          { text: "React Navigation Docs", url: "https://reactnavigation.org/docs/getting-started/" }
        ],
        practice: "Build a multi-screen notes app with list screen and detail screen.",
        checkpoint: "You can navigate between multiple screens and pass data between them without referencing documentation."
      },
      {
        id: 4,
        title: "Lists, State & Local Storage",
        learn: [
          "Track A: FlatList/SectionList, Context API or Zustand, AsyncStorage",
          "Track B: RecyclerView, ViewModel + LiveData, SQLite/Room databases"
        ],
        videos: [
          { text: "Chai aur React Native — Lists and AsyncStorage", url: "https://www.youtube.com/playlist?list=PLu71SKxNbfoAKL_sTfg5CgCxlrpH5b2jS" }
        ],
        readings: [
          { text: "AsyncStorage Documentation", url: "https://react-native-async-storage.github.io/async-storage/docs/usage" }
        ],
        practice: "Build an app that persists data locally (to-do list that survives restarts).",
        checkpoint: "Your app's data survives a restart, and list rendering feels smooth even with many items."
      },
      {
        id: 5,
        title: "Working with APIs",
        learn: [
          "Track A: fetch/axios, async/await patterns",
          "Track B: Retrofit or Volley for networking, parsing JSON responses"
        ],
        videos: [
          { text: "Chai aur React Native — Networking and API fetch", url: "https://www.youtube.com/playlist?list=PLu71SKxNbfoAKL_sTfg5CgCxlrpH5b2jS" }
        ],
        readings: [
          { text: "Retrofit official guide (Track B)", url: "https://developer.android.com/courses" }
        ],
        practice: "Build an app that consumes a public API (weather app, movie search).",
        checkpoint: "You can wire up any new public API, handling loading and error states gracefully."
      },
      {
        id: 6,
        title: "Native Device Features",
        learn: [
          "Track A: Expo's Camera, Location, and Notifications APIs",
          "Track B: Android native permissions, CameraX, LocationManager, Firebase Cloud Messaging"
        ],
        videos: [
          { text: "CodeWithHarry's Android Playlist — Media and Camera", url: "https://www.youtube.com/playlist?list=PLu0W_9lII9aiL0kysYlfSOUgY5rNlOhUd" }
        ],
        readings: [
          { text: "Expo SDK Device APIs Docs", url: "https://docs.expo.dev/" }
        ],
        practice: "Add one native feature (camera or GPS location) to an earlier project.",
        checkpoint: "You can request permissions and use a device API without crashing on permission denials."
      },
      {
        id: 7,
        title: "UI Polish & Animations",
        learn: [
          "Material Design guidelines, responsive mobile layouts, animations and transitions"
        ],
        videos: [
          { text: "Chai aur Code — React Native Styling and NativeWind", url: "https://www.youtube.com/playlist?list=PLu71SKxNbfoAKL_sTfg5CgCxlrpH5b2jS" }
        ],
        readings: [
          { text: "Material Design 3 Guidelines", url: "https://m3.material.io/" }
        ],
        practice: "Give an earlier project a full visual polish pass: spacing, consistent colors, basic transitions.",
        checkpoint: "Your app looks clean and intentional rather than like a rough prototype."
      },
      {
        id: 8,
        title: "Publishing to App Stores",
        learn: [
          "App signing, building release APK/AAB or IPA, Play Store/App Store submission, monetization concepts"
        ],
        videos: [
          { text: "CodeWithHarry's Android Playlist — Publishing to Play Store", url: "https://www.youtube.com/playlist?list=PLu0W_9lII9aiL0kysYlfSOUgY5rNlOhUd" }
        ],
        readings: [
          { text: "React Native Signed APK Guide", url: "https://reactnative.dev/docs/signed-apk-android" }
        ],
        practice: "Package and build a release-mode APK/AAB of one of your apps.",
        checkpoint: "You understand the full path from code to a live app store listing."
      },
      {
        id: 9,
        title: "Capstone Project",
        learn: [
          "UI/UX, navigation, API integration, local storage, and native features in a single production app"
        ],
        videos: [
          { text: "Chai aur React Native — Projects walkthrough", url: "https://www.youtube.com/playlist?list=PLu71SKxNbfoAKL_sTfg5CgCxlrpH5b2jS" }
        ],
        readings: [
          { text: "React Native official docs", url: "https://reactnative.dev/" }
        ],
        practice: "Build a complete app (habit tracker, marketplace, or chat app) and document it fully.",
        checkpoint: "A fully functional, release-ready mobile project is built and pushed to GitHub."
      }
    ]
  },

  "aiml": {
    id: "aiml",
    title: "AI / ML",
    subtitle: "CampusX alongside Andrew Ng's courses",
    scope: "11 modules",
    color: "#8b5cf6",
    description: "Build deep machine learning intuition and hands-on Python skills from data cleaning to Generative AI.",
    intro: "A module-by-module plan combining CampusX's structured Hindi-language playlists (code-first) with Andrew Ng's Machine Learning Specialization (gold-standard for math and intuition).",
    preferReading: [
      { label: "Andrew Ng's ML Specialization", url: "https://www.coursera.org/specializations/machine-learning-introduction", desc: "reading materials embedded alongside course videos" },
      { label: "Hands-On Machine Learning (Book)", url: "https://www.google.com/search?q=Hands-On+Machine+Learning+Aurelien+Geron", desc: "Aurelien Geron — excellent companion textbook" },
      { label: "scikit-learn documentation", url: "https://scikit-learn.org/stable/", desc: "official documentation and guides" },
      { label: "CampusX GitHub notebooks", url: "https://github.com/campusx-official", desc: "Jupyter notebooks to read through topic-by-topic" }
    ],
    generalTools: "Python, Jupyter Notebook or Google Colab, NumPy, Pandas, Matplotlib/Seaborn, scikit-learn, TensorFlow, FastAPI, LangChain.",
    modules: [
      {
        id: 1,
        title: "Python for Data Science",
        learn: [
          "Python fundamentals, NumPy arrays/indexing, Pandas DataFrames, basic plotting with Matplotlib"
        ],
        videos: [
          { text: "CampusX's 100 Days of Python Playlist", url: "https://youtube.com/playlist?list=PLKnIA16_Rmvb1RYR-iTA_hzckhdONtSW4" }
        ],
        readings: [
          { text: "Official Python Tutorial", url: "https://docs.python.org/3/tutorial/" },
          { text: "Pandas Documentation", url: "https://pandas.pydata.org/docs/" }
        ],
        practice: "Load a real dataset (Titanic, housing prices) and perform basic cleaning and exploration.",
        checkpoint: "You can load, clean, filter, and plot a dataset in Pandas without constantly searching syntax."
      },
      {
        id: 2,
        title: "Math & ML Intuition Foundations",
        learn: [
          "Supervised vs unsupervised learning, linear regression cost functions, gradient descent intuition"
        ],
        videos: [
          { text: "Andrew Ng's ML Specialization — Course 1: Regression and Classification", url: "https://www.coursera.org/specializations/machine-learning-introduction" }
        ],
        readings: [
          { text: "Hands-On ML Book — Chapters 1-2", url: "https://www.google.com/search?q=Hands-On+Machine+Learning" }
        ],
        practice: "Follow along with Andrew Ng's Coursera exercises for weeks 1-3.",
        checkpoint: "You can explain in plain language what cost functions and gradient descent are doing without formulas."
      },
      {
        id: 3,
        title: "Data Handling, EDA & Feature Engineering",
        learn: [
          "Missing data, outlier detection, EDA (uni/bi/multivariate)",
          "Scaling, encoding categorical data, transformers, ML pipelines"
        ],
        videos: [
          { text: "CampusX's 100 Days of ML — Days 12 through 37", url: "https://youtube.com/playlist?list=PLKnIA16_Rmvbr7zKYQuBfsVkjoLcJgxHH" }
        ],
        readings: [
          { text: "Hands-On ML Book — Chapter 2", url: "https://www.google.com/search?q=Hands-On+Machine+Learning" }
        ],
        practice: "Take a messy real-world dataset and fully clean, scale, encode, and prepare it for modeling.",
        checkpoint: "Given a new raw dataset, you can independently decide what scaling/encoding/pipelines it needs."
      },
      {
        id: 4,
        title: "Supervised Learning: Regression & Classification",
        learn: [
          "Linear regression, logistic regression, regularization, metrics (accuracy, precision, recall, F1, RMSE)"
        ],
        videos: [
          { text: "Andrew Ng's Course 1 — Regression and Classification theory", url: "https://www.coursera.org/learn/machine-learning" }
        ],
        readings: [
          { text: "Hands-On ML Book — Chapters 3-4", url: "https://www.google.com/search?q=Hands-On+Machine+Learning" }
        ],
        practice: "Build and evaluate both a regression and a classification model on separate real datasets.",
        checkpoint: "You can train and evaluate linear/logistic regression models in scikit-learn and interpret the metrics."
      },
      {
        id: 5,
        title: "Neural Networks & Decision Trees",
        learn: [
          "Neural net architectures, forward propagation, training with TensorFlow",
          "Decision trees, random forests, boosted trees (XGBoost)"
        ],
        videos: [
          { text: "Andrew Ng's Course 2: Advanced Learning Algorithms", url: "https://www.coursera.org/specializations/machine-learning-introduction" }
        ],
        readings: [
          { text: "Hands-On ML Book — Chapters 6-7", url: "https://www.google.com/search?q=Hands-On+Machine+Learning" }
        ],
        practice: "Build a random forest or XGBoost model and compare performance to logistic regression.",
        checkpoint: "You can choose between a linear model, tree-based model, or small neural net and justify the choice."
      },
      {
        id: 6,
        title: "Unsupervised Learning & Recommender Systems",
        learn: [
          "Clustering (K-Means), dimensionality reduction (PCA), anomaly detection",
          "Collaborative filtering, content-based recommenders"
        ],
        videos: [
          { text: "Andrew Ng's Course 3: Unsupervised Learning, Recommenders, RL", url: "https://www.coursera.org/specializations/machine-learning-introduction" }
        ],
        readings: [
          { text: "Hands-On ML Book — Chapters 8-9", url: "https://www.google.com/search?q=Hands-On+Machine+Learning" }
        ],
        practice: "Cluster a dataset with no labels and build a simple collaborative filtering recommender.",
        checkpoint: "You can identify whether a problem calls for supervised, unsupervised, or recommender approaches."
      },
      {
        id: 7,
        title: "Model Evaluation, Pipelines & Deployment",
        learn: [
          "Cross-validation, hyperparameter tuning (GridSearch/RandomSearch), pipelines, APIs for model serving"
        ],
        videos: [
          { text: "CampusX's FastAPI for Machine Learning Playlist", url: "https://youtube.com/playlist?list=PLKnIA16_RmvZ41tjbKB2ZnwchfniNsMuQ" }
        ],
        readings: [
          { text: "scikit-learn Pipelines Documentation", url: "https://scikit-learn.org/stable/modules/compose.html" },
          { text: "FastAPI official documentation", url: "https://fastapi.tiangolo.com/" }
        ],
        practice: "Wrap one of your trained models in a FastAPI endpoint.",
        checkpoint: "You can expose a trained scikit-learn model as a working API endpoint without assistance."
      },
      {
        id: 8,
        title: "Deep Learning Foundations",
        learn: [
          "ANNs, convolutional neural networks (CNNs) for images, recurrent neural networks (RNNs)"
        ],
        videos: [
          { text: "CampusX's 100 Days of Deep Learning — ANN, CNN, RNN", url: "https://www.youtube.com/playlist?list=PLKnIA16_RmvYuZauWaPlRTC54KxSNLtNn" }
        ],
        readings: [
          { text: "Hands-On ML Book — Chapters 10-16", url: "https://www.google.com/search?q=Hands-On+Machine+Learning" }
        ],
        practice: "Build a CNN image classifier and a simple RNN text classification model.",
        checkpoint: "You understand why CNNs suit images and RNNs suit sequences, and can build both using Keras."
      },
      {
        id: 9,
        title: "Generative AI (LLMs & LangChain)",
        learn: [
          "Large language models, prompt engineering, LangChain (RAG, chains, memory)"
        ],
        videos: [
          { text: "CampusX's GenAI using LangChain Playlist", url: "https://youtube.com/playlist?list=PLKnIA16_RmvaTbihpo4MtzVm4XOQa0ER0" }
        ],
        readings: [
          { text: "LangChain Unified Documentation", url: "https://docs.langchain.com/" }
        ],
        practice: "Build a Retrieval-Augmented Generation (RAG) application over custom PDF/txt files.",
        checkpoint: "You can build a basic LLM-powered document Q&A chatbot using LangChain."
      },
      {
        id: 10,
        title: "Agentic AI (LangGraph & MCP)",
        learn: [
          "Agentic workflows, multi-step reasoning, stateful agent graphs with LangGraph, Model Context Protocol (MCP)"
        ],
        videos: [
          { text: "CampusX's Agentic AI using LangGraph Playlist", url: "https://youtube.com/playlist?list=PLKnIA16_RmvYsvB8qkUQuJmJNuiCUJFPL" }
        ],
        readings: [
          { text: "LangGraph documentation overview", url: "https://docs.langchain.com/oss/python/langgraph/overview" },
          { text: "Model Context Protocol official documentation", url: "https://modelcontextprotocol.io/" }
        ],
        practice: "Build a multi-step LangGraph agent that calls external APIs dynamically based on user prompts.",
        checkpoint: "You understand the difference between chains and agents, and can build a tool-use agent."
      },
      {
        id: 11,
        title: "Capstone Projects & Portfolio",
        learn: [
          "Integrating classical ML, deep learning, and generative AI into portfolio projects with documentation"
        ],
        videos: [
          { text: "CampusX — Portfolio and Project Advice", url: "https://youtube.com/playlist?list=PLKnIA16_Rmvbr7zKYQuBfsVkjoLcJgxHH" }
        ],
        readings: [
          { text: "Kaggle community notebook guides", url: "https://www.kaggle.com" }
        ],
        practice: "Select 3 high-quality projects (1 classic ML, 1 CNN/RNN, 1 LLM/Agent), build them fully, write readmes, push to GitHub.",
        checkpoint: "A complete ML portfolio with clean repos is live and ready for job/internship applications."
      }
    ]
  }
};
