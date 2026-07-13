/**
 * Roadmap static content for the 6 learning tracks.
 * Ported in full from the source markdown files.
 */

export const roadmapsData = {
  "cpp": {
    id: "cpp",
    title: "C++ Programming",
    subtitle: "using The Cherno alongside CodeWithHarry",
    scope: "10 modules",
    icon: "⚡",
    color: "#3b82f6", // Blue
    gradient: "linear-gradient(135deg, rgba(30, 58, 138, 0.9), rgba(59, 130, 246, 0.9))",
    description: "Learn C++ as a language — not just syntax, but a real working understanding of how it works under the hood.",
    intro: "A module-by-module plan to actually learn C++ as a language — not just enough syntax to pass a course, but a real working understanding of how it works under the hood. This combines two very different but complementary creators: The Cherno (Yan Chernikov, deep explanations) and CodeWithHarry (absolute beginner-friendly first pass in Hindi).",
    preferReading: [
      { label: "learncpp.com", url: "https://www.learncpp.com/", desc: "genuinely one of the best free, structured text resources for C++ anywhere" },
      { label: "cppreference.com", url: "https://en.cppreference.com/", desc: "the definitive reference for syntax and standard library details" },
      { label: "GeeksforGeeks C++ tutorial", url: "https://www.geeksforgeeks.org/cpp/c-plus-plus/", desc: "good for quick topic-specific explanations" }
    ],
    generalTools: "A compiler (g++ or clang), an IDE or editor (VS Code, CLion, or Visual Studio), and CMake once you get to multi-file projects.",
    generalTips: [
      "Don't skip the 'why' for the sake of syntax — C++ punishes people who memorize syntax without understanding memory; The Cherno's whole series is built around this philosophy, so lean into it.",
      "Compile with warnings enabled (-Wall -Wextra) from day one — C++ will happily let you shoot yourself in the foot silently otherwise.",
      "learncpp.com is unusually good as a standalone resource — if you're someone who reads faster than you watch, you could realistically go through this entire roadmap using just learncpp.com."
    ],
    modules: [
      {
        id: 1,
        title: "Setup, Syntax & Basics",
        learn: [
          "variables, data types, operators, input/output (cin/cout)",
          "how compilation actually works (preprocessor → compiler → linker)"
        ],
        videos: [
          { text: "The Cherno's C++ series — covers setup, how C++ works under the hood, variables/types in depth", url: "https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb" },
          { text: "CodeWithHarry's C++ playlist — a gentler, faster-paced first pass if you're new to programming", url: "https://youtube.com/playlist?list=PLu0W_9lII9agpFUAlPFe_VNSlXW5uE0YL" }
        ],
        readings: [
          { text: "learncpp.com Chapter 1", url: "https://www.learncpp.com/" }
        ],
        practice: "Get a 'Hello World' compiling from the command line (not just an IDE run button) so you understand what's actually happening.",
        checkpoint: "You can explain what happens between writing .cpp code and getting a running program, and you're comfortable with basic variables/types/I-O."
      },
      {
        id: 2,
        title: "Control Flow & Functions",
        learn: [
          "if/else, loops, switch statements",
          "functions, function overloading, pass-by-value vs pass-by-reference"
        ],
        videos: [
          { text: "The Cherno's C++ series — covers functions and control flow with a focus on what's happening at the assembly/memory level", url: "https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb" }
        ],
        readings: [
          { text: "learncpp.com — Functions chapter", url: "https://www.learncpp.com/" }
        ],
        practice: "Write small programs using functions with both value and reference parameters, and notice the difference in behavior.",
        checkpoint: "You understand the practical difference between passing by value and by reference, not just the syntax for each."
      },
      {
        id: 3,
        title: "Arrays, Strings, Pointers & References",
        learn: [
          "arrays, C-style strings vs std::string",
          "pointers, references, pointer arithmetic, the stack vs the heap"
        ],
        videos: [
          { text: "The Cherno's C++ series — 'Pointers in C++' and 'References in C++' (widely considered some of the clearest explanations online)", url: "https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb" }
        ],
        readings: [
          { text: "learncpp.com — Pointers and References chapters", url: "https://www.learncpp.com/" }
        ],
        practice: "Write a program that manually manages a dynamically-sized array using raw pointers, so you feel the pain points before learning the STL's solutions.",
        checkpoint: "Pointers and references stop feeling like magic — you can explain what a pointer actually holds in memory and why references exist."
      },
      {
        id: 4,
        title: "Object-Oriented Programming in C++",
        learn: [
          "classes, constructors/destructors, encapsulation",
          "inheritance, polymorphism, virtual functions, abstract classes"
        ],
        videos: [
          { text: "The Cherno's C++ series — classes and OOP concepts in depth, including how virtual functions work (vtables)", url: "https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb" },
          { text: "CodeWithHarry's C++ playlist — dedicated OOP section for a gentler first introduction", url: "https://youtube.com/playlist?list=PLu0W_9lII9agpFUAlPFe_VNSlXW5uE0YL" }
        ],
        readings: [
          { text: "learncpp.com — Object-oriented programming chapters", url: "https://www.learncpp.com/" }
        ],
        practice: "Design a small class hierarchy (e.g., Shape → Circle/Rectangle/Triangle) using inheritance and virtual functions.",
        checkpoint: "You can explain why virtual functions are needed and what problem they solve, not just how to write the virtual keyword."
      },
      {
        id: 5,
        title: "Memory Management",
        learn: [
          "dynamic memory (new/delete), memory leaks",
          "RAII (Resource Acquisition Is Initialization)",
          "smart pointers (unique_ptr, shared_ptr, weak_ptr)"
        ],
        videos: [
          { text: "The Cherno's C++ series — dynamic allocation, smart pointers, and RAII (one of the strongest sections of the series)", url: "https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb" }
        ],
        readings: [
          { text: "learncpp.com — Dynamic memory allocation and smart pointer chapters", url: "https://www.learncpp.com/" }
        ],
        practice: "Take a program you wrote with raw pointers earlier and refactor it to use smart pointers instead.",
        checkpoint: "You default to smart pointers over raw new/delete without having to think about it, and you understand what RAII is protecting you from."
      },
      {
        id: 6,
        title: "The Standard Template Library (STL)",
        learn: [
          "containers (vector, map, set, unordered_map)",
          "iterators, common algorithms (sort, find, accumulate)",
          "when to use which container"
        ],
        videos: [
          { text: "The Cherno's C++ series — STL sub-series covering containers and iterators with performance discussions", url: "https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb" }
        ],
        readings: [
          { text: "cppreference.com — Containers library", url: "https://en.cppreference.com/w/cpp/container.html" },
          { text: "learncpp.com — STL chapters", url: "https://www.learncpp.com/" }
        ],
        practice: "Rewrite an earlier 'manual' data structure exercise (like your Module 3 dynamic array) using the appropriate STL container instead.",
        checkpoint: "Given a new problem, you can pick the right STL container without defaulting to vector out of habit."
      },
      {
        id: 7,
        title: "Templates & Generic Programming",
        learn: [
          "function templates, class templates",
          "template specialization",
          "why templates exist and how they differ from generics in other languages"
        ],
        videos: [
          { text: "The Cherno's C++ series — templates video explaining them from first principles", url: "https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb" }
        ],
        readings: [
          { text: "learncpp.com — Templates chapter", url: "https://www.learncpp.com/" }
        ],
        practice: "Write a generic container or utility function (e.g., a generic Stack<T>) using templates.",
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
          { text: "The Cherno's C++ series — dedicated videos on lambdas and move semantics", url: "https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb" }
        ],
        readings: [
          { text: "learncpp.com — Move semantics and lambda chapters", url: "https://www.learncpp.com/" },
          { text: "cppreference.com for precise feature-by-feature reference", url: "https://en.cppreference.com/" }
        ],
        practice: "Refactor an earlier project to use modern idioms — replace manual loops with range-based for loops and STL algorithms, use lambdas where appropriate.",
        checkpoint: "Your code starts looking like 'modern C++' by default rather than 'C with classes.'"
      },
      {
        id: 9,
        title: "Multithreading & Performance",
        learn: [
          "std::thread, mutexes, race conditions",
          "basic profiling and optimization thinking"
        ],
        videos: [
          { text: "The Cherno's C++ series — multithreading sub-series and separate videos on benchmarking/optimization", url: "https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb" }
        ],
        readings: [
          { text: "cppreference.com — Thread support library", url: "https://en.cppreference.com/w/cpp/thread.html" }
        ],
        practice: "Parallelize a simple CPU-bound task (like processing a large array) using std::thread and observe the speedup.",
        checkpoint: "You understand what a race condition is and how a mutex prevents one (this module is optional depth, not a hard gate)."
      },
      {
        id: 10,
        title: "Capstone Project",
        learn: [
          "OOP, STL, memory management, and modern C++ idioms working together",
          "structuring a non-trivial project"
        ],
        videos: [
          { text: "The Cherno's Hazel game engine series (highly recommended next step if you want to pivot to game dev)", url: "https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb" }
        ],
        readings: [
          { text: "learncpp.com (reference review)", url: "https://www.learncpp.com/" }
        ],
        practice: "Build a non-trivial application from scratch — a small CLI game, a command-line utility, or a mini data-processing tool.",
        checkpoint: "You have a complete, compiled C++ application pushed to GitHub showing proper resource management and modern idioms."
      }
    ]
  },

  "cp": {
    id: "cp",
    title: "Competitive Programming",
    subtitle: "using Striver alongside Errichto & Colin Galen",
    scope: "13 modules",
    icon: "🏆",
    color: "#ef4444", // Red
    gradient: "linear-gradient(135deg, rgba(127, 29, 29, 0.9), rgba(239, 68, 68, 0.9))",
    description: "Go from zero to a solid Competitive Programming foundation and climb the Codeforces ranks.",
    intro: "A module-by-module plan to go from zero to a solid CP foundation. There's no fixed timeline — move to the next module only once you've hit the practice/rating checkpoint given at the end of each one. Striver's playlists are excellent but DSA-oriented; from Module 8 onward, this roadmap shifts to CP-specific creators (Errichto, Colin Galen, William Lin).",
    preferReading: [
      { label: "CP-Algorithms", url: "https://cp-algorithms.com/", desc: "the single best all-round text reference for CP algorithms" },
      { label: "Competitive Programmer's Handbook", url: "https://cses.fi/book/book.pdf", desc: "free textbook mapping very closely to this roadmap" },
      { label: "USACO Guide", url: "https://usaco.guide/", desc: "well-organized syllabus with explanations and linked practice problems" },
      { label: "GeeksforGeeks CP articles", url: "https://www.geeksforgeeks.org/competitive-programming/", desc: "good for quick topic-specific lookups" }
    ],
    generalTools: "Judge/Practice: Codeforces, CSES Problem Set, AtCoder. Problem Sheet: CP-31 by Priyansh Agarwal (TLE Eliminators). Language: C++ is strongly preferred.",
    generalTips: [
      "Consistency > intensity: 1-2 hours daily beats 10 hours once a week.",
      "Upsolve unsolved contest problems within 24-48 hours while it's fresh.",
      "Don't jump to the editorial too fast — struggle for at least 30 minutes first.",
      "Keep a personal template file (fast I/O, common snippets) you reuse in every contest.",
      "On CP-31: solve problems rated roughly (your current CF rating - 200) to (your current CF rating + 200)."
    ],
    modules: [
      {
        id: 1,
        title: "Language Proficiency + Setup",
        learn: [
          "C++ syntax, vectors, pairs, maps, sets, strings",
          "local compilation setup, Codeforces & CSES account setup, fast I/O templates"
        ],
        videos: [
          { text: "Striver's A2Z DSA Course — Step 1 (C++ Basics) & Step 2 (STL)", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz" }
        ],
        readings: [
          { text: "GeeksforGeeks C++ STL Tutorial", url: "https://www.geeksforgeeks.org/cpp/the-c-standard-template-library-stl/" }
        ],
        practice: "Solve the first 5-6 problems in the CSES 'Introductory Problems' set.",
        checkpoint: "You can write a program using vectors/maps/sets without looking up syntax, and you've solved at least 5 CSES intro problems."
      },
      {
        id: 2,
        title: "Time Complexity & Math Basics",
        learn: [
          "Big-O notation, estimating ops/sec (~10^8 ops/sec rule of thumb)",
          "GCD/LCM, modular arithmetic, fast exponentiation, basic prime sieve"
        ],
        videos: [
          { text: "Striver's A2Z Course — Time Complexity video", url: "https://www.youtube.com/watch?v=FPu9Uld7W-E" },
          { text: "Errichto's Number Theory / Math for CP videos", url: "https://www.youtube.com/@Errichto" }
        ],
        readings: [
          { text: "CP-Algorithms — Number Theory section", url: "https://cp-algorithms.com/#number-theory" }
        ],
        practice: "Solve Codeforces Div 3/4 problems A and B, plus remaining CSES Introductory Problems.",
        checkpoint: "You can look at constraints (e.g. n <= 10^5) and correctly guess the required complexity, and your Codeforces rating is 800+."
      },
      {
        id: 3,
        title: "Arrays, Sorting, Basic Greedy",
        learn: [
          "sorting (sort(), custom comparators), two-pointer technique, prefix sums",
          "greedy algorithms and how to prove correctness informally"
        ],
        videos: [
          { text: "Striver's A2Z Course — Sorting Techniques and Greedy Algorithms steps", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz" }
        ],
        readings: [
          { text: "CSES Sorting and Searching section (with editorials)", url: "https://cses.fi/problemset/list/" }
        ],
        practice: "CP-31 sheet 800-rated problems (do as many of the 31 as you can), plus Codeforces problems tagged 'greedy' (800-1200).",
        checkpoint: "You've cleared most of the CP-31 800-rated set and your Codeforces rating is around 900-1000."
      },
      {
        id: 4,
        title: "Binary Search",
        learn: [
          "binary search on arrays, binary search on answer (very common CP pattern)"
        ],
        videos: [
          { text: "Striver's Binary Search Master Class — L1, L2, and L3 (Binary Search on Answer)", url: "https://www.youtube.com/watch?v=Kb3KOTQfjew" }
        ],
        readings: [
          { text: "CP-Algorithms — Binary Search", url: "https://cp-algorithms.com/num_methods/binary_search.html" }
        ],
        practice: "CSES Sorting and Searching (binary search ones), CF problems tagged 'binary search', CP-31 sheet 900-rated set.",
        checkpoint: "You can independently identify 'binary search on answer' problems and implement them bug-free; CF rating around 1000-1100."
      },
      {
        id: 5,
        title: "Recursion & Backtracking",
        learn: [
          "recursion fundamentals, generating subsets and permutations, backtracking"
        ],
        videos: [
          { text: "Striver's Recursion & Backtracking playlist", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0rGlzIn_7rsaR2FQ5e6ZOL9" }
        ],
        readings: [
          { text: "GeeksforGeeks Backtracking articles", url: "https://www.geeksforgeeks.org/dsa/backtracking-algorithms/" }
        ],
        practice: "CSES Introductory Problems (recursive ones), subset/permutation problems, CP-31 sheet 1000-rated set.",
        checkpoint: "You're comfortable writing recursive solutions without drawing recursion trees; CF rating around 1100."
      },
      {
        id: 6,
        title: "Basic Graphs (BFS/DFS)",
        learn: [
          "graph representations (adjacency list), BFS, DFS, connected components, cycle detection"
        ],
        videos: [
          { text: "Striver's Graph Series — first ~10-12 videos covering BFS/DFS and cycle detection", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oE3gA41TKO2H5bHpPd7fzn" }
        ],
        readings: [
          { text: "takeuforward.org Graph Series written notes", url: "https://takeuforward.org/graph/striver-graph-series-top-graph-interview-questions/" },
          { text: "CP-Algorithms — Graphs section", url: "https://cp-algorithms.com/#graphs" }
        ],
        practice: "CSES Graph Algorithms: Counting Rooms, Labyrinth, Building Roads. CP-31 sheet 1100-rated set.",
        checkpoint: "You can code BFS/DFS from scratch in under 5 minutes; CF rating around 1100-1200."
      },
      {
        id: 7,
        title: "Dynamic Programming Basics",
        learn: [
          "memoization vs tabulation, classic patterns: 0/1 Knapsack, LCS, coin change, climbing stairs"
        ],
        videos: [
          { text: "Striver's DP Series — from beginning (1D DP) through Knapsack and LCS", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0qUlt5H_kiKYaNSqJ81PMMY" }
        ],
        readings: [
          { text: "takeuforward.org DP Series notes", url: "https://takeuforward.org/dynamic-programming/striver-dp-series-dynamic-programming-problems/" },
          { text: "CSES Dynamic Programming section", url: "https://cses.fi/problemset/list/" }
        ],
        practice: "CSES DP problems (first 6-8), CP-31 sheet 1200-rated set.",
        checkpoint: "You can define a DP state and transition on your own for a new problem (not just recall patterns); CF rating around 1200-1300."
      },
      {
        id: 8,
        title: "Number Theory Deep Dive",
        learn: [
          "sieve of Eratosthenes, prime factorization, modular inverse, combinatorics basics (nCr mod p)"
        ],
        videos: [
          { text: "Errichto's channel (search 'modular arithmetic', 'combinatorics', 'sieve')", url: "https://www.youtube.com/@Errichto" }
        ],
        readings: [
          { text: "CP-Algorithms — Number Theory (excellent, highly recommended)", url: "https://cp-algorithms.com/#number-theory" }
        ],
        practice: "CF problems tagged 'number theory', 'combinatorics' (rating 900-1300), CP-31 sheet 1300-rated set.",
        checkpoint: "Modular arithmetic and nCr mod p feel routine; CF rating around 1300."
      },
      {
        id: 9,
        title: "Advanced Graphs",
        learn: [
          "shortest paths (Dijkstra, Bellman-Ford), Minimum Spanning Tree (Kruskal/Prim), Union-Find (DSU)"
        ],
        videos: [
          { text: "Striver's Graph Series — shortest paths, DSU, and MST sections", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oE3gA41TKO2H5bHpPd7fzn" }
        ],
        readings: [
          { text: "Striver's Graph Series notes", url: "https://takeuforward.org/graph/striver-graph-series-top-graph-interview-questions/" },
          { text: "CP-Algorithms — Graph Algorithms", url: "https://cp-algorithms.com/#graphs" }
        ],
        practice: "CSES: Shortest Routes I/II, Road Reparation, Road Construction. CP-31 sheet 1400-rated set.",
        checkpoint: "You can pick the right shortest path algorithm for a given constraint set; CF rating around 1400."
      },
      {
        id: 10,
        title: "Advanced Dynamic Programming",
        learn: [
          "DP on subsets (bitmask DP), digit DP, DP on trees"
        ],
        videos: [
          { text: "Errichto's channel (search 'bitmask dp', 'digit dp')", url: "https://www.youtube.com/@Errichto" },
          { text: "Striver's DP Series — tree DP section near the end", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0qUlt5H_kiKYaNSqJ81PMMY" }
        ],
        readings: [
          { text: "CP-Algorithms — Dynamic Programming (bitmask/digit DP depth)", url: "https://cp-algorithms.com/#dynamic-programming" }
        ],
        practice: "CSES remaining DP problems, CF 'dp' tag (1400-1700), CP-31 sheet 1500-rated set.",
        checkpoint: "CF rating around 1500; you can solve at least one bitmask DP problem independently."
      },
      {
        id: 11,
        title: "Data Structures: Segment Tree & Fenwick Tree",
        learn: [
          "range queries/updates, Segment Tree, Binary Indexed Tree (Fenwick), sparse table for static RMQ"
        ],
        videos: [
          { text: "Errichto's channel (search 'segment tree', 'Fenwick tree')", url: "https://www.youtube.com/@Errichto" },
          { text: "Striver's A2Z Course — Segment Tree section under later steps", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz" }
        ],
        readings: [
          { text: "CP-Algorithms — Data Structures (segment tree article is outstanding)", url: "https://cp-algorithms.com/#data-structures" }
        ],
        practice: "CSES Range Queries section (all problems), CP-31 sheet 1600-rated set.",
        checkpoint: "You can implement a segment tree from memory; CF rating around 1600."
      },
      {
        id: 12,
        title: "String Algorithms",
        learn: [
          "string hashing, KMP algorithm, Z-function, basic trie"
        ],
        videos: [
          { text: "William Lin's channel (search 'KMP', 'Z function', 'string hashing')", url: "https://www.youtube.com/@tmwilliamlin168" },
          { text: "Striver's Trie Series playlist", url: "https://youtube.com/playlist?list=PLgUwDviBIf0pcIDCZnxhv0LkHf5KzG9zp" }
        ],
        readings: [
          { text: "CP-Algorithms — String Processing", url: "https://cp-algorithms.com/#string-processing" }
        ],
        practice: "CSES String Algorithms section, CP-31 sheet 1700-1900 rated sets.",
        checkpoint: "CF rating crosses ~1700-1900 (Expert range) and you've cleared the CP-31 sheet."
      },
      {
        id: 13,
        title: "Contest Practice & Rating Push",
        learn: [
          "contest strategy, upsolving, virtual contests",
          "advanced topics: Trees (LCA, Euler tour), game theory, Mo's algorithm, advanced greedy"
        ],
        videos: [
          { text: "Colin Galen's channel — excellent tips on practice strategies and upsolving", url: "https://www.youtube.com/@ColinGalen" }
        ],
        readings: [
          { text: "Codeforces Editorials (read after every round)", url: "https://codeforces.com" }
        ],
        practice: "Participate in every live CF Div 2/3/4 round, run 1 virtual contest per week, solve problems filter-tagged by weak areas.",
        checkpoint: "Ongoing progression — target CF 1900+ (Candidate Master) and beyond."
      }
    ]
  },

  "dsa": {
    id: "dsa",
    title: "Data Structures & Algorithms",
    subtitle: "using Striver (takeuforward) alongside Aditya Verma",
    scope: "13 modules",
    icon: "🌲",
    color: "#22c55e", // Green
    gradient: "linear-gradient(135deg, rgba(6, 78, 59, 0.9), rgba(34, 197, 94, 0.9))",
    description: "Build strong problem-solving skills with DSA fundamentals for coding interviews and placements.",
    intro: "A module-by-module plan to build strong DSA fundamentals — useful for interviews, placements, and as the foundation before/alongside competitive programming. Move to the next module only once you hit the checkpoint at the end of each one; don't rush past a topic.",
    preferReading: [
      { label: "takeuforward.org blog/notes", url: "https://takeuforward.org/", desc: "Striver's written notes, mirroring the playlists exactly" },
      { label: "GeeksforGeeks DSA section", url: "https://www.geeksforgeeks.org/dsa/dsa-tutorial-learn-data-structures-and-algorithms/", desc: "good for quick topic-specific explanations" },
      { label: "Cracking the Coding Interview", url: "https://www.google.com/search?q=Cracking+the+Coding+Interview", desc: "the classic text-based resource for interview prep" }
    ],
    generalTools: "Practice on LeetCode, GeeksforGeeks. Structured sheets: Striver's A2Z DSA Sheet and Striver's SDE Sheet (for interview prep). Language: C++, Java, or Python.",
    generalTips: [
      "Consistency > intensity: 1-2 hours daily beats a weekend cram.",
      "Don't jump to the solution too fast — struggle for at least 20-30 minutes on a new problem first.",
      "Re-solve problems you struggled with after a few days — spaced repetition matters.",
      "Keep a personal notes doc of patterns per topic.",
      "Striver's written notes closely mirror his videos, so you can easily switch formats."
    ],
    modules: [
      {
        id: 1,
        title: "Language + Basic Complexity",
        learn: [
          "arrays, loops, functions, basic OOP, built-in containers",
          "Time & Space complexity (Big-O, Big-Theta, Big-Omega), loop analysis"
        ],
        videos: [
          { text: "Striver's A2Z DSA playlist — Step 1 (Language Basics) & Time Complexity", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz" }
        ],
        readings: [
          { text: "takeuforward — Time & Space Complexity notes", url: "https://takeuforward.org/time-complexity/time-and-space-complexity" }
        ],
        practice: "Basic array and loop traversal problems on GfG or LeetCode Easy.",
        checkpoint: "You can state the time complexity of a piece of code just by reading it, without running it."
      },
      {
        id: 2,
        title: "Arrays & Basic Math",
        learn: [
          "array traversal patterns, prefix sums, subarray problems",
          "basic math: primes, GCD/LCM, basic bit manipulation"
        ],
        videos: [
          { text: "Striver's A2Z DSA playlist — Arrays step (Step 3) & Basic Maths step", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz" }
        ],
        readings: [
          { text: "takeuforward Array blogs", url: "https://takeuforward.org/blogs/arrays" },
          { text: "GfG Bit Manipulation articles", url: "https://www.geeksforgeeks.org/dsa/bits-manipulation-important-tactics/" }
        ],
        practice: "LeetCode Easy/Medium tagged 'Array' (solve ~25-30 problems).",
        checkpoint: "You can solve most Array-tagged Easy problems in under 15 minutes and attempt Mediums without checking solutions."
      },
      {
        id: 3,
        title: "Searching & Sorting",
        learn: [
          "linear search, binary search (rotated arrays, first/last occurrence, search on answer)",
          "merge sort, quick sort, stability, in-place sort, and complexity tradeoffs"
        ],
        videos: [
          { text: "Striver's Binary Search Master Class — L1, L2, L3 (Search on Answers)", url: "https://www.youtube.com/watch?v=Kb3KOTQfjew" },
          { text: "Striver's A2Z playlist — Sorting Techniques step", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz" }
        ],
        readings: [
          { text: "takeuforward Binary Search blogs", url: "https://takeuforward.org/blogs/binary-search" },
          { text: "GfG Sorting Algorithms", url: "https://www.geeksforgeeks.org/dsa/sorting-algorithms/" }
        ],
        practice: "LeetCode 'Binary Search' tag (20+ problems), implement merge & quick sort from scratch once.",
        checkpoint: "You can write binary search without off-by-one bugs on the first try, consistently."
      },
      {
        id: 4,
        title: "Hashing & Two Pointers",
        learn: [
          "hash maps/sets and when to use them",
          "two-pointer technique, fixed/variable size sliding window"
        ],
        videos: [
          { text: "Striver's A2Z playlist — Hashing and Two Pointer/Sliding Window steps", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz" },
          { text: "Aditya Verma's Sliding Window playlist (pattern-by-pattern, highly recommended)", url: "https://www.youtube.com/playlist?list=PL_z_8CaSLPWeM8BDJmIYDaoQ5zuwyxnfj" }
        ],
        readings: [
          { text: "takeuforward Hashing blogs", url: "https://takeuforward.org/blogs/hashing" },
          { text: "GfG Sliding Window Technique", url: "https://www.geeksforgeeks.org/dsa/window-sliding-technique/" }
        ],
        practice: "LeetCode Two Pointers and Sliding Window tags (e.g. Two Sum, Longest Substring without repeating chars).",
        checkpoint: "Given a new problem, you can recognize whether it's a hashing, two-pointer, or sliding-window problem."
      },
      {
        id: 5,
        title: "Recursion & Backtracking",
        learn: [
          "recursion fundamentals (base cases, recursion trees)",
          "backtracking (subsets, permutations, N-Queens, Sudoku solver)"
        ],
        videos: [
          { text: "Striver's Recursion & Backtracking playlist (built exactly for this)", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0rGlzIn_7rsaR2FQ5e6ZOL9" }
        ],
        readings: [
          { text: "GeeksforGeeks Backtracking articles", url: "https://www.geeksforgeeks.org/dsa/backtracking-algorithms/" }
        ],
        practice: "LeetCode 'Backtracking' tag (solve ~15-20 problems).",
        checkpoint: "You can write a recursive solution for a new problem without drawing the recursion tree on paper first."
      },
      {
        id: 6,
        title: "Linked Lists",
        learn: [
          "singly/doubly linked lists, reversal",
          "cycle detection (Floyd's algorithm), merging, LRU cache design"
        ],
        videos: [
          { text: "Striver's Linked List Placement Series playlist", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0r47RKH7fdWN54AbWFgGuii" }
        ],
        readings: [
          { text: "takeuforward Linked List blogs", url: "https://takeuforward.org/blogs/linked-list" }
        ],
        practice: "LeetCode 'Linked List' tag (15-20 problems: reverse, cycle detection, merge lists).",
        checkpoint: "You can reverse a linked list and detect a cycle without referencing notes."
      },
      {
        id: 7,
        title: "Stacks & Queues",
        learn: [
          "stack/queue fundamentals, implementing queue using stacks (and vice versa), circular queues",
          "monotonic stack pattern (next greater/smaller element)"
        ],
        videos: [
          { text: "Aditya Verma's Stack playlist (highly recommended for monotonic stack)", url: "https://www.youtube.com/playlist?list=PL_z_8CaSLPWdeOezg68SKkeLN4-T_jNHd" },
          { text: "Striver's A2Z playlist — Stack/Queue step", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz" }
        ],
        readings: [
          { text: "GfG Stack and Queue articles", url: "https://www.geeksforgeeks.org/dsa/stack-data-structure/" }
        ],
        practice: "LeetCode Stack tag (~15-20 problems: Valid Parentheses, Min Stack, Next Greater Element).",
        checkpoint: "The 'monotonic stack' pattern (Next Greater Element, Histogram) feels recognizable rather than mysterious."
      },
      {
        id: 8,
        title: "Trees & Binary Search Trees",
        learn: [
          "binary tree traversals (in/pre/post/level order), height/diameter",
          "BST properties, insertion, deletion, search, validation",
          "basic tree DP (max path sum)"
        ],
        videos: [
          { text: "Striver's Tree Series playlist (covers traversals through BST & tree-DP)", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0q8Hkd7bK2Bpryj2xVJk8Vk" }
        ],
        readings: [
          { text: "Striver's Tree Series notes (text version)", url: "https://takeuforward.org/data-structure/strivers-tree-series-tree-data-structure/" }
        ],
        practice: "LeetCode Tree and BST tags (solve ~25-30 problems).",
        checkpoint: "You can implement all 4 tree traversals from memory and solve basic tree DP problems."
      },
      {
        id: 9,
        title: "Heaps / Priority Queues",
        learn: [
          "heap properties, building a heap, priority queue patterns",
          "top-K problems, merge K sorted lists"
        ],
        videos: [
          { text: "Aditya Verma's Heap playlist (pattern-first heap explanations)", url: "https://www.youtube.com/playlist?list=PL_z_8CaSLPWdtY9W22VjnPxG30CXNZpI9" }
        ],
        readings: [
          { text: "GfG Heap Data Structure articles", url: "https://www.geeksforgeeks.org/dsa/heap-data-structure/" }
        ],
        practice: "LeetCode 'Heap (Priority Queue)' tag (~10-15 problems: Kth largest, merge K sorted).",
        checkpoint: "You can identify 'top-K' or 'Kth largest/smallest' problems and reach for a heap instinctively."
      },
      {
        id: 10,
        title: "Graphs",
        learn: [
          "representations, BFS/DFS, connected components, cycle detection (directed/undirected)",
          "topological sort, shortest paths (Dijkstra, Bellman-Ford), DSU, MST"
        ],
        videos: [
          { text: "Striver's Graph Series playlist (extremely comprehensive)", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oE3gA41TKO2H5bHpPd7fzn" }
        ],
        readings: [
          { text: "Striver's Graph Series notes (text version)", url: "https://takeuforward.org/graph/striver-graph-series-top-graph-interview-questions/" }
        ],
        practice: "LeetCode Graph tag (solve ~30-35 problems like Number of Islands, Course Schedule).",
        checkpoint: "Given a new graph problem, you can identify whether it needs BFS/DFS, shortest paths, MST, or Union-Find."
      },
      {
        id: 11,
        title: "Dynamic Programming",
        learn: [
          "memoization vs tabulation, 1D DP (climbing stairs, robber)",
          "2D/Grid DP, Knapsack (0/1, unbounded), DP on subsequences and strings"
        ],
        videos: [
          { text: "Striver's DP Series playlist (recursion → memoization → tabulation methodology)", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0qUlt5H_kiKYaNSqJ81PMMY" }
        ],
        readings: [
          { text: "Striver's DP Series notes (text version)", url: "https://takeuforward.org/dynamic-programming/striver-dp-series-dynamic-programming-problems/" }
        ],
        practice: "LeetCode DP tag (solve ~30-40 problems; budget the most time here).",
        checkpoint: "You can define the state and transitions for a brand-new DP problem you haven't seen before."
      },
      {
        id: 12,
        title: "Tries, Advanced Strings & Greedy",
        learn: [
          "trie construction and autocomplete/word search uses",
          "greedy patterns (activity selection, interval scheduling)",
          "basic string matching (KMP, Rabin-Karp conceptual)"
        ],
        videos: [
          { text: "Striver's Trie Series playlist", url: "https://youtube.com/playlist?list=PLgUwDviBIf0pcIDCZnxhv0LkHf5KzG9zp" },
          { text: "Striver's A2Z playlist — Greedy step", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz" }
        ],
        readings: [
          { text: "GfG Greedy Algorithms section", url: "https://www.geeksforgeeks.org/dsa/greedy-algorithms/" }
        ],
        practice: "LeetCode Trie and Greedy tags (~15-20 problems).",
        checkpoint: "You're comfortable with when greedy applies vs when it doesn't, and can justify why greedy works."
      },
      {
        id: 13,
        title: "Interview Prep & Mock Practice",
        learn: [
          "applying concepts under timed pressure, explaining thought process out loud",
          "curated sheets: Striver's SDE Sheet"
        ],
        videos: [
          { text: "takeuforward mock interviews and SDE sheet guides", url: "https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/" }
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
    subtitle: "using Chai aur Code alongside Code with Harry",
    scope: "12 modules",
    icon: "🌐",
    color: "#f59e0b", // Yellow
    gradient: "linear-gradient(135deg, rgba(120, 53, 15, 0.9), rgba(245, 158, 11, 0.9))",
    description: "Build modern, full-stack websites from basic HTML/CSS through advanced React, Node.js, and databases.",
    intro: "A module-by-module plan for full-stack web development, built around Chai aur Code (Hitesh Choudhary) and Code with Harry. Move to the next module only once you hit the checkpoint at the end of each one. JavaScript is used as the core language for both frontend and backend.",
    preferReading: [
      { label: "Chai aur Docs", url: "https://docs.chaicode.com/", desc: "written companion docs for Hitesh's playlists (e.g. Git)" },
      { label: "CodeWithHarry Notes/Tutorials", url: "https://www.codewithharry.com/tutorials", desc: "text tutorials closely mirroring his videos topic-by-topic" },
      { label: "MDN Web Docs", url: "https://developer.mozilla.org/", desc: "the gold standard reference for HTML/CSS/JS" }
    ],
    generalTools: "A code editor (VS Code), a GitHub account, and Postman for testing APIs.",
    generalTips: [
      "Don't jump between the two creators mid-topic — pick one and stick with them through that module.",
      "Build projects, don't just watch — web dev is notorious for 'tutorial hell.' Build variations without the video open.",
      "Keep a GitHub profile from Module 4 onward and push every project.",
      "Use MDN for syntax reference once you understand the core concepts."
    ],
    modules: [
      {
        id: 1,
        title: "How the Web Works + HTML",
        learn: [
          "client-server model, HTTP requests, HTML structure, forms, semantic tags"
        ],
        videos: [
          { text: "CodeWithHarry's HTML playlist or Sigma Web Development Course (Tutorial #1 onward)", url: "https://www.youtube.com/playlist?list=PLu0W_9lII9agq5TrH9XLIKQvv0iaF2X3w" }
        ],
        readings: [
          { text: "MDN HTML Basics", url: "https://developer.mozilla.org/en-US/docs/Web/HTML" }
        ],
        practice: "Build 2-3 static pages (resume page, simple product landing page) using raw HTML.",
        checkpoint: "You can structure a full webpage (header, nav, sections, footer, form) from blank files without any reference."
      },
      {
        id: 2,
        title: "CSS + Responsive Design",
        learn: [
          "box model, flexbox, CSS grid, media queries, responsive design principles"
        ],
        videos: [
          { text: "CodeWithHarry's Sigma Course CSS section", url: "https://www.youtube.com/playlist?list=PLu0W_9lII9agq5TrH9XLIKQvv0iaF2X3w" }
        ],
        readings: [
          { text: "MDN CSS Basics & Layouts", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
          { text: "CodeWithHarry CSS text tutorial", url: "https://www.codewithharry.com/tutorial/css-home" }
        ],
        practice: "Rebuild your Module 1 pages to be fully responsive; attempt recreating a simple real website's layout.",
        checkpoint: "You can build a responsive layout with flexbox and grid without looking up basic properties."
      },
      {
        id: 3,
        title: "JavaScript Fundamentals",
        learn: [
          "variables, data types, functions, loops, conditionals, arrays, objects, scope"
        ],
        videos: [
          { text: "Chai aur Javascript playlist — goes deep into language foundations", url: "https://www.youtube.com/playlist?list=PLu71SKxNbfoBuX3f4EOACle2y-tRC5Q37" },
          { text: "CodeWithHarry's Sigma Course JS section", url: "https://www.youtube.com/playlist?list=PLu0W_9lII9agq5TrH9XLIKQvv0iaF2X3w" }
        ],
        readings: [
          { text: "MDN JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" }
        ],
        practice: "Solve small logic problems; build a calculator or a to-do list using vanilla JS.",
        checkpoint: "You can write functions, loop through arrays/objects, and reason about scope without confusion."
      },
      {
        id: 4,
        title: "DOM Manipulation + Git/GitHub",
        learn: [
          "selecting and manipulating DOM elements, event listeners",
          "Git basics (init, commit, push, branches, merge) and GitHub workflow"
        ],
        videos: [
          { text: "CodeWithHarry's Sigma Course DOM section", url: "https://www.youtube.com/playlist?list=PLu0W_9lII9agq5TrH9XLIKQvv0iaF2X3w" },
          { text: "Chai aur Git playlist on Chai aur Code channel", url: "https://www.youtube.com/@chaiaurcode" }
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
          "arrow functions, destructuring, spread/rest, promises, async/await, fetch, third-party APIs"
        ],
        videos: [
          { text: "Chai aur Javascript playlist (later videos on promises and API calls)", url: "https://www.youtube.com/playlist?list=PLu71SKxNbfoBuX3f4EOACle2y-tRC5Q37" }
        ],
        readings: [
          { text: "MDN — Asynchronous JavaScript", url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous" }
        ],
        practice: "Build a weather app or GitHub-profile-lookup app that fetches data from a public API.",
        checkpoint: "Async/await and promise chains feel natural, and you can consume public APIs confidently."
      },
      {
        id: 6,
        title: "React Basics",
        learn: [
          "components, JSX, props, state, useState and useEffect, conditional rendering, lists"
        ],
        videos: [
          { text: "Chai aur React playlist or CodeWithHarry's Complete React Course", url: "https://www.youtube.com/playlist?list=PLu71SKxNbfoDqgPchmvIsL4hTnJIrtige" }
        ],
        readings: [
          { text: "React official docs — Learn React", url: "https://react.dev/learn" }
        ],
        practice: "Rebuild one of your earlier vanilla-JS projects (like the todo list or calculator) in React.",
        checkpoint: "You can build a multi-component app with props and state flowing correctly between them."
      },
      {
        id: 7,
        title: "React Advanced (Router, Context, State Management)",
        learn: [
          "React Router for client-side routing, Context API, Redux Toolkit basics, custom hooks"
        ],
        videos: [
          { text: "Chai aur React playlist (includes routing, context, and Redux Toolkit crash course)", url: "https://www.youtube.com/playlist?list=PLu71SKxNbfoDqgPchmvIsL4hTnJIrtige" }
        ],
        readings: [
          { text: "React Router documentation", url: "https://reactrouter.com/" },
          { text: "Redux Toolkit documentation", url: "https://redux-toolkit.js.org/" }
        ],
        practice: "Build a multi-page app with routing and global state (e.g. shopping cart, notes app).",
        checkpoint: "You can decide when to use local state vs Context vs Redux for an app, and implement whichever you choose."
      },
      {
        id: 8,
        title: "Backend Basics: Node.js + Express",
        learn: [
          "Node.js fundamentals, Express routing, middleware, request/response cycle, REST API design"
        ],
        videos: [
          { text: "Chai aur Javascript Backend playlist", url: "https://www.youtube.com/playlist?list=PLu71SKxNbfoBGh_8p_NS-ZAh6v7HhYqHW" },
          { text: "CodeWithHarry's Node.js playlist or Sigma Course Express section (Tutorial #88+)", url: "https://www.youtube.com/playlist?list=PLobAq7hWqZWGTfhj4jNQAVzJd_y6iTErQ" }
        ],
        readings: [
          { text: "Express.js official guide to routing and middleware", url: "https://expressjs.com/en/guide/routing.html" }
        ],
        practice: "Build a simple REST API (e.g., a notes API with CRUD routes returning JSON).",
        checkpoint: "You can build a working REST API with multiple routes and middleware without referencing a tutorial."
      },
      {
        id: 9,
        title: "Databases: MongoDB (+ SQL basics)",
        learn: [
          "MongoDB fundamentals, Mongoose schemas/models, database connections",
          "basic grounding in SQL (tables, joins, queries)"
        ],
        videos: [
          { text: "Chai aur Javascript Backend playlist (Mongoose & database connections)", url: "https://www.youtube.com/playlist?list=PLu71SKxNbfoBGh_8p_NS-ZAh6v7HhYqHW" }
        ],
        readings: [
          { text: "MongoDB official documentation", url: "https://www.mongodb.com/docs/" },
          { text: "Mongoose schemas guide", url: "https://mongoosejs.com/docs/guide.html" }
        ],
        practice: "Connect your Module 8 API to a real MongoDB database (Atlas free tier).",
        checkpoint: "Your API can perform full CRUD operations against a real database."
      },
      {
        id: 10,
        title: "Auth & Full Backend Projects",
        learn: [
          "authentication (JWT, cookies, sessions), password hashing (bcrypt), file uploads, production structure"
        ],
        videos: [
          { text: "Hitesh's 'chai-backend' project series (YouTube-like backend, highly recommended)", url: "https://github.com/hiteshchoudhary/chai-backend" }
        ],
        readings: [
          { text: "Chai-backend GitHub repository code and README", url: "https://github.com/hiteshchoudhary/chai-backend" }
        ],
        practice: "Build your own backend project with login/signup, protected routes, and file uploads.",
        checkpoint: "You can implement authentication and protected routes in a backend project from scratch."
      },
      {
        id: 11,
        title: "Deployment & Basic DevOps",
        learn: [
          "environment variables, frontend hosting (Vercel/Netlify), backend hosting (Render/Railway), Docker basics"
        ],
        videos: [
          { text: "Chai aur Code DevOps/Docker videos (search channel for topics)", url: "https://www.youtube.com/@chaiaurcode" }
        ],
        readings: [
          { text: "Vercel deployments docs", url: "https://vercel.com/docs" },
          { text: "Render services docs", url: "https://render.com/docs" },
          { text: "Docker official 'Getting Started' docs", url: "https://docs.docker.com/get-started/" }
        ],
        practice: "Deploy a full-stack project end-to-end (frontend + backend + database) on a public URL.",
        checkpoint: "You've successfully deployed at least one full-stack project accessible via a public link."
      },
      {
        id: 12,
        title: "Full Stack Capstone Project",
        learn: [
          "combining frontend, backend, auth, database, and deployments into a single production application"
        ],
        videos: [
          { text: "Sigma Web Development Course — Next.js project builds near the end", url: "https://www.youtube.com/playlist?list=PLu0W_9lII9agq5TrH9XLIKQvv0iaF2X3w" }
        ],
        readings: [
          { text: "MDN Web Docs (Reference check)", url: "https://developer.mozilla.org/" }
        ],
        practice: "Build, deploy, and document a complete capstone project (e-commerce, blogging platform, or social app).",
        checkpoint: "A functional, fully deployed production-grade capstone project is pushed to GitHub."
      }
    ]
  },

  "appdev": {
    id: "appdev",
    title: "App Development",
    subtitle: "using Chai aur Code alongside Code with Harry",
    scope: "9 modules",
    icon: "📱",
    color: "#ec4899", // Pink
    gradient: "linear-gradient(135deg, rgba(131, 24, 67, 0.9), rgba(236, 72, 153, 0.9))",
    description: "Create cross-platform mobile apps with React Native or go deep on native Android with Kotlin/Java.",
    intro: "A module-by-module plan for mobile app development. App dev forks early depending on which stack you pick, so this roadmap covers two tracks — Track A: React Native (cross-platform, JS/React based) and Track B: Native Android (Java/Kotlin based).",
    preferReading: [
      { label: "React Native official docs", url: "https://reactnative.dev/docs/getting-started", desc: "Track A" },
      { label: "Android Developers official docs", url: "https://developer.android.com/courses", desc: "Track B, structured courses" },
      { label: "CodeWithHarry tutorials", url: "https://www.codewithharry.com/tutorials", desc: "text versions of video courses" }
    ],
    generalTools: "Track A: Node.js, Expo CLI, Android Studio/Xcode emulators. Track B: Android Studio. Language: JS/TS or Java/Kotlin.",
    generalTips: [
      "Don't try to learn both tracks at once — pick one, get to a working capstone, then explore the other.",
      "Use a real device to test occasionally, not just emulators — performance and permissions feel different.",
      "Publish something, even something small — a live app in a store is a strong portfolio piece."
    ],
    modules: [
      {
        id: 1,
        title: "Mobile Dev Fundamentals & Setup",
        learn: [
          "mobile vs web apps (lifecycle, native APIs, stores)",
          "Track A: setting up Node.js, Expo CLI, emulators",
          "Track B: setting up Android Studio & emulators"
        ],
        videos: [
          { text: "Track A: Chai aur React Native playlist — starts from setup", url: "https://www.youtube.com/playlist?list=PLu71SKxNbfoAKL_sTfg5CgCxlrpH5b2jS" },
          { text: "Track B: CodeWithHarry's Android Development playlist", url: "https://www.youtube.com/playlist?list=PLu0W_9lII9aiL0kysYlfSOUgY5rNlOhUd" }
        ],
        readings: [
          { text: "Expo CLI Getting Started guide", url: "https://docs.expo.dev/tutorial/introduction/" }
        ],
        practice: "Get a 'Hello World' app running on an emulator or your physical phone in your chosen stack.",
        checkpoint: "You can run and see changes reflected live on an emulator or device without setup issues."
      },
      {
        id: 2,
        title: "Language Refresher",
        learn: [
          "Track A: JS fundamentals & React hooks (can skip if already solid on web dev)",
          "Track B: Java fundamentals (Java Refresher chapter) or Kotlin basics"
        ],
        videos: [
          { text: "Track B: Java Refresher chapter within CodeWithHarry's Android playlist", url: "https://www.youtube.com/playlist?list=PLu0W_9lII9aiL0kysYlfSOUgY5rNlOhUd" }
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
          "Track A: View, Text, ScrollView, FlatList, styling with StyleSheet, React Navigation",
          "Track B: Activities, layouts (XML), Intents for navigation"
        ],
        videos: [
          { text: "Track A: Chai aur React Native playlist (UI & navigation)", url: "https://www.youtube.com/playlist?list=PLu71SKxNbfoAKL_sTfg5CgCxlrpH5b2jS" },
          { text: "Track B: CodeWithHarry's Android playlist (Activities/Layouts and Multi-Screen Apps)", url: "https://www.youtube.com/playlist?list=PLu0W_9lII9aiL0kysYlfSOUgY5rNlOhUd" }
        ],
        readings: [
          { text: "React Navigation Docs", url: "https://reactnavigation.org/docs/getting-started/" }
        ],
        practice: "Build a multi-screen app (e.g., a simple notes app with a list screen and a detail screen).",
        checkpoint: "You can navigate between multiple screens and pass data between them without referencing documentation."
      },
      {
        id: 4,
        title: "Lists, State & Local Storage",
        learn: [
          "Track A: FlatList/SectionList, Context API or Zustand, AsyncStorage for local persistence",
          "Track B: RecyclerView/ListView, ViewModel + LiveData, SQLite/Room databases"
        ],
        videos: [
          { text: "Track A: Chai aur React Native playlist (Lists & AsyncStorage)", url: "https://www.youtube.com/playlist?list=PLu71SKxNbfoAKL_sTfg5CgCxlrpH5b2jS" },
          { text: "Track B: CodeWithHarry's Android playlist (ListView/RecyclerView & Databases)", url: "https://www.youtube.com/playlist?list=PLu0W_9lII9aiL0kysYlfSOUgY5rNlOhUd" }
        ],
        readings: [
          { text: "AsyncStorage Documentation", url: "https://react-native-async-storage.github.io/async-storage/docs/usage" }
        ],
        practice: "Build an app that persists data locally (e.g., a to-do list that survives app restarts).",
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
          { text: "Continue the playlists above — both cover API integration as part of their projects", url: "https://www.youtube.com/playlist?list=PLu71SKxNbfoAKL_sTfg5CgCxlrpH5b2jS" }
        ],
        readings: [
          { text: "Retrofit official guide (for Track B)", url: "https://developer.android.com/courses" }
        ],
        practice: "Build an app that consumes a public API (weather app, movie search app, etc.).",
        checkpoint: "You can wire up any new public API to your app, handling loading and error states gracefully."
      },
      {
        id: 6,
        title: "Native Device Features",
        learn: [
          "Track A: Expo's Camera, Location, and Notifications APIs",
          "Track B: Android native permission system, CameraX, LocationManager, Firebase Cloud Messaging"
        ],
        videos: [
          { text: "Track B: CodeWithHarry's Android playlist (Working with Media chapter)", url: "https://www.youtube.com/playlist?list=PLu0W_9lII9aiL0kysYlfSOUgY5rNlOhUd" }
        ],
        readings: [
          { text: "Expo SDK Device APIs Docs (Camera & Location)", url: "https://docs.expo.dev/" }
        ],
        practice: "Add one native feature (camera photo taking or GPS location fetching) to an earlier project.",
        checkpoint: "You can request permissions and use a device API without crashing on permission denials."
      },
      {
        id: 7,
        title: "Polish: UI/UX & Styling",
        learn: [
          "platform design guidelines (Material Design for Android, Human Interface Guidelines for iOS)",
          "animations, responsive mobile layouts"
        ],
        videos: [
          { text: "Revisit styling sections of your chosen playlist", url: "https://www.youtube.com/@chaiaurcode" }
        ],
        readings: [
          { text: "Material Design 3 Guidelines", url: "https://m3.material.io/" }
        ],
        practice: "Take an earlier project and give it a full visual polish pass — spacing, consistent colors, basic transitions.",
        checkpoint: "Your app looks clean and intentional rather than like a rough prototype."
      },
      {
        id: 8,
        title: "Publishing to App Stores",
        learn: [
          "app signing, building release APK/AAB or IPA, Play Store/App Store submission, monetization concepts"
        ],
        videos: [
          { text: "CodeWithHarry's Android playlist (Publishing to Play Store & Making Money chapters)", url: "https://www.youtube.com/playlist?list=PLu0W_9lII9aiL0kysYlfSOUgY5rNlOhUd" }
        ],
        readings: [
          { text: "React Native Signed APK Guide", url: "https://reactnative.dev/docs/signed-apk-android" }
        ],
        practice: "Package and build a release-mode APK/AAB of one of your apps.",
        checkpoint: "You understand the full path from code to a live app store listing, even if you don't publish immediately."
      },
      {
        id: 9,
        title: "Capstone Project",
        learn: [
          "UI/UX, navigation, API integration, local storage, and native features in a single production app"
        ],
        videos: [
          { text: "Chai aur React Native playlists (capstone guidance)", url: "https://www.youtube.com/playlist?list=PLu71SKxNbfoAKL_sTfg5CgCxlrpH5b2jS" }
        ],
        readings: [
          { text: "React Native official docs", url: "https://reactnative.dev/" }
        ],
        practice: "Build a complete app (habit tracker, marketplace, or chat app) end-to-end and document it.",
        checkpoint: "A fully functional, release-ready mobile project is built and pushed to GitHub."
      }
    ]
  },

  "aiml": {
    id: "aiml",
    title: "AI / ML",
    subtitle: "using CampusX alongside Andrew Ng's courses",
    scope: "11 modules",
    icon: "🤖",
    color: "#8b5cf6", // Purple
    gradient: "linear-gradient(135deg, rgba(76, 29, 149, 0.9), rgba(139, 92, 246, 0.9))",
    description: "Build deep machine learning intuition and hands-on Python skills from data cleaning to Generative AI.",
    intro: "A module-by-module plan for machine learning, combining CampusX's structured Hindi-language playlists (great for hands-on, code-first learning) with Andrew Ng's Machine Learning Specialization (the gold-standard for math and theory intuition).",
    preferReading: [
      { label: "Andrew Ng's Specialization readings", url: "https://www.coursera.org/specializations/machine-learning-introduction", desc: "reading materials embedded alongside course videos" },
      { label: "Hands-On Machine Learning (Book)", url: "https://www.google.com/search?q=Hands-On+Machine+Learning+Aurelien+Geron", desc: "Aurélien Géron — excellent companion textbook" },
      { label: "scikit-learn documentation", url: "https://scikit-learn.org/stable/", desc: "the official documentation and guides" },
      { label: "CampusX's GitHub-linked notebooks", url: "https://github.com/campusx-official", desc: "Jupyter notebooks to read through topic-by-topic" }
    ],
    generalTools: "Python, Jupyter Notebook or Google Colab, NumPy, Pandas, Matplotlib/Seaborn, scikit-learn, TensorFlow, FastAPI, LangChain.",
    generalTips: [
      "Don't skip the math intuition for code — Andrew Ng's courses exist so you don't call .fit() blindly.",
      "Kaggle is a great source of real datasets and community notebooks — use it for practice, not just competitions.",
      "Deep learning (Module 8 onwards) benefits from a GPU — Google Colab's free tier is enough to get started.",
      "CampusX is code-first and video-native; reading alternatives there are mostly external."
    ],
    modules: [
      {
        id: 1,
        title: "Python for Data Science",
        learn: [
          "Python fundamentals, NumPy arrays/indexing, Pandas DataFrames, basic plotting with Matplotlib"
        ],
        videos: [
          { text: "CampusX's 100 Days of Python playlist", url: "https://youtube.com/playlist?list=PLKnIA16_Rmvb1RYR-iTA_hzckhdONtSW4" }
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
          "supervised vs unsupervised learning, linear regression cost functions, gradient descent intuition"
        ],
        videos: [
          { text: "Andrew Ng's ML Specialization — Course 1 (Regression & Classification first weeks)", url: "https://www.coursera.org/specializations/machine-learning-introduction" }
        ],
        readings: [
          { text: "Hands-On ML Book — Chapters 1-2 for conceptual overview", url: "https://www.google.com/search?q=Hands-On+Machine+Learning" }
        ],
        practice: "No code practice required yet beyond following along with Andrew Ng's Coursera exercises.",
        checkpoint: "You can explain in plain language what cost functions and gradient descent are doing without formulas."
      },
      {
        id: 3,
        title: "Data Handling, EDA & Feature Engineering",
        learn: [
          "missing data, outlier detection, EDA (uni/bi/multivariate)",
          "scaling (standardization/normalization), encoding categorical data, transformers, ML pipelines"
        ],
        videos: [
          { text: "CampusX's 100 Days of Machine Learning (specifically Days 12 through 37)", url: "https://youtube.com/playlist?list=PLKnIA16_Rmvbr7zKYQuBfsVkjoLcJgxHH" }
        ],
        readings: [
          { text: "Hands-On ML Book — Chapter 2 (End-to-End ML Project)", url: "https://www.google.com/search?q=Hands-On+Machine+Learning" }
        ],
        practice: "Take a messy real-world dataset and fully clean, scale, encode, and prepare it for modeling.",
        checkpoint: "Given a new raw dataset, you can independently decide what scaling/encoding/pipelines it needs."
      },
      {
        id: 4,
        title: "Supervised Learning: Regression & Classification",
        learn: [
          "linear regression, logistic regression, regularization, metrics (accuracy, precision, recall, F1, RMSE)"
        ],
        videos: [
          { text: "Andrew Ng's Course 1 (Regression & Classification theory)", url: "https://www.coursera.org/learn/machine-learning" },
          { text: "CampusX's 100 Days of ML (scikit-learn implementation side)", url: "https://youtube.com/playlist?list=PLKnIA16_Rmvbr7zKYQuBfsVkjoLcJgxHH" }
        ],
        readings: [
          { text: "Hands-On ML Book — Chapters 3-4", url: "https://www.google.com/search?q=Hands-On+Machine+Learning" }
        ],
        practice: "Build and evaluate both a regression and a classification model on separate real datasets.",
        checkpoint: "You can train and evaluate linear/logistic regression models in scikit-learn and interpret metrics."
      },
      {
        id: 5,
        title: "Neural Networks & Decision Trees",
        learn: [
          "neural net architectures, forward propagation, training with TensorFlow",
          "decision trees, random forests, boosted trees (like XGBoost)"
        ],
        videos: [
          { text: "Andrew Ng's Course 2: Advanced Learning Algorithms", url: "https://www.coursera.org/specializations/machine-learning-introduction" },
          { text: "CampusX's tree-based ensemble method days on 100 Days of ML", url: "https://youtube.com/playlist?list=PLKnIA16_Rmvbr7zKYQuBfsVkjoLcJgxHH" }
        ],
        readings: [
          { text: "Hands-On ML Book — Chapters 6-7 (Decision Trees & Ensembles)", url: "https://www.google.com/search?q=Hands-On+Machine+Learning" }
        ],
        practice: "Build a random forest or XGBoost model and compare its performance to logistic regression.",
        checkpoint: "You can choose between a linear model, tree-based model, or small neural net and justify the choice."
      },
      {
        id: 6,
        title: "Unsupervised Learning & Recommender Systems",
        learn: [
          "clustering (K-Means), dimensionality reduction (PCA), anomaly detection",
          "collaborative filtering, content-based recommenders"
        ],
        videos: [
          { text: "Andrew Ng's Course 3: Unsupervised Learning, Recommenders, Reinforcement Learning", url: "https://www.coursera.org/specializations/machine-learning-introduction" },
          { text: "CampusX's clustering & PCA videos", url: "https://youtube.com/playlist?list=PLKnIA16_Rmvbr7zKYQuBfsVkjoLcJgxHH" }
        ],
        readings: [
          { text: "Hands-On ML Book — Chapters 8-9", url: "https://www.google.com/search?q=Hands-On+Machine+Learning" }
        ],
        practice: "Cluster a dataset with no labels and interpret groups; build a simple collaborative filtering recommender.",
        checkpoint: "You can identify whether a problem calls for supervised, unsupervised, or recommenders, and write basic implementations."
      },
      {
        id: 7,
        title: "Model Evaluation, Pipelines & Deployment Basics",
        learn: [
          "cross-validation, hyperparameter tuning (GridSearch/RandomSearch), pipelines, APIs for model serving"
        ],
        videos: [
          { text: "CampusX's ML pipelines section & FastAPI for Machine Learning bonus playlist", url: "https://youtube.com/playlist?list=PLKnIA16_RmvZ41tjbKB2ZnwchfniNsMuQ" }
        ],
        readings: [
          { text: "scikit-learn Pipelines Documentation", url: "https://scikit-learn.org/stable/modules/compose.html" },
          { text: "FastAPI official documentation", url: "https://fastapi.tiangolo.com/" }
        ],
        practice: "Wrap one of your trained models in a FastAPI endpoint so it can be queried like a real microservice.",
        checkpoint: "You can expose a trained scikit-learn model as a working API endpoint without assistance."
      },
      {
        id: 8,
        title: "Deep Learning Foundations",
        learn: [
          "artificial neural networks (ANNs), convolutional neural networks (CNNs) for images, recurrent neural networks (RNNs)"
        ],
        videos: [
          { text: "CampusX's 100 Days of Deep Learning playlist (comprehensive ANN, CNN, RNN)", url: "https://www.youtube.com/playlist?list=PLKnIA16_RmvYuZauWaPlRTC54KxSNLtNn" },
          { text: "Andrew Ng's Deep Learning Specialization (for deeper mathematical theory)", url: "https://www.coursera.org/specializations/deep-learning" }
        ],
        readings: [
          { text: "Hands-On ML Book — Chapters 10-16", url: "https://www.google.com/search?q=Hands-On+Machine+Learning" }
        ],
        practice: "Build a CNN image classifier and a simple RNN text classification model.",
        checkpoint: "You understand why CNNs suit images and RNNs suit sequences, and can build both using Keras/TensorFlow."
      },
      {
        id: 9,
        title: "Generative AI (LLMs & LangChain)",
        learn: [
          "large language models, prompt engineering, LangChain applications (RAG, chains, memory)"
        ],
        videos: [
          { text: "CampusX's GenAI using LangChain playlist", url: "https://youtube.com/playlist?list=PLKnIA16_RmvaTbihpo4MtzVm4XOQa0ER0" }
        ],
        readings: [
          { text: "LangChain Unified Documentation", url: "https://docs.langchain.com/" }
        ],
        practice: "Build a Retrieval-Augmented Generation (RAG) application over a custom set of PDF/txt files.",
        checkpoint: "You can build a basic LLM-powered application (like a document Q&A chatbot) using LangChain."
      },
      {
        id: 10,
        title: "Agentic AI (LangGraph & MCP)",
        learn: [
          "agentic workflows, multi-step reasoning, stateful agent graphs with LangGraph, Model Context Protocol (MCP)"
        ],
        videos: [
          { text: "CampusX's Agentic AI using LangGraph & Model Context Protocol (MCP) playlists", url: "https://youtube.com/playlist?list=PLKnIA16_RmvYsvB8qkUQuJmJNuiCUJFPL" }
        ],
        readings: [
          { text: "LangGraph documentation overview", url: "https://docs.langchain.com/oss/python/langgraph/overview" },
          { text: "Model Context Protocol official documentation", url: "https://modelcontextprotocol.io/" }
        ],
        practice: "Build a multi-step LangGraph agent that can call external APIs or tools dynamically based on user prompts.",
        checkpoint: "You understand differences between chains and agents, and can build a tool-use agent."
      },
      {
        id: 11,
        title: "Capstone Projects & Portfolio",
        learn: [
          "integrating classical ML, deep learning, and generative AI into portfolio projects, documentation"
        ],
        videos: [
          { text: "CampusX advice on resume/portfolio projects", url: "https://youtube.com/playlist?list=PLKnIA16_Rmvbr7zKYQuBfsVkjoLcJgxHH" }
        ],
        readings: [
          { text: "Kaggle community notebook guides", url: "https://www.kaggle.com" }
        ],
        practice: "Select 3 high-quality projects (1 classic ML, 1 CNN/RNN, 1 LLM/Agent app), build them fully, write readmes, and push to GitHub.",
        checkpoint: "A complete machine learning portfolio with clean repos is live and ready for job/internship applications."
      }
    ]
  }
};
