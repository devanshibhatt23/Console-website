/**
 * Static seed data for Console Resources.
 * Domains: C++ Programming, DSA, Web Development, App Development, AI/ML, Competitive Programming
 *
 * Structure: domain → modules → resources
 * Used as fallback when Supabase has no rows (dev mode).
 * Admins can add/override rows via the Admin panel.
 */

/**
 * Module topic titles for Library Mode headers.
 * domain id → module number → title string
 */
export const MODULE_TITLES = {
  "cpp-programming": {
    1: "Introduction & Basics",
    2: "Operators & Flow Control",
    3: "Pointers, Arrays & Data Types",
    4: "Functions & Recursion",
    5: "Revise & Practice",
    6: "OOP - Part 1",
    7: "OOP - Part 2",
    8: "OOP - Part 3",
    9: "STL & Advanced Topics",
  },
  "dsa": {
    1: "Level 0: How to Prepare & Roadmaps",
    2: "Basics & Fundamentals",
    3: "Sorting Techniques",
    4: "Arrays",
    5: "Binary Search",
    6: "Strings",
    7: "Linked Lists",
    8: "Recursion & Backtracking",
    9: "Bit Manipulation",
    10: "Stacks & Queues",
    11: "Sliding Window & Two Pointers",
    12: "Heaps",
    13: "Greedy Algorithms",
    14: "Binary Trees & BSTs",
    15: "Graphs",
    16: "Dynamic Programming",
  },
  "web-development": {
    1: "HTML & CSS Fundamentals",
    2: "JavaScript Basics",
    3: "Advanced JavaScript",
    4: "React.js",
    5: "Backend with Node.js",
    6: "Databases & Auth",
    7: "Deployment",
    8: "TypeScript & Performance",
  },
  "app-development": {
    1: "Mobile Dev Fundamentals",
    2: "React Native Core",
    3: "State Management & Data",
    4: "Flutter Introduction",
    5: "Publishing Apps",
    6: "Advanced & Optimization",
  },
  "ai-ml": {
    1: "Python for ML",
    2: "ML Fundamentals",
    3: "Data Visualization & EDA",
    4: "Deep Learning",
    5: "NLP & Computer Vision",
    6: "Projects & APIs",
    7: "Generative AI",
    8: "Interview Prep",
  },
  "competitive-programming": {
    1: "Getting Started with CP",
    2: "Math for CP",
    3: "Greedy & Brute Force",
    4: "Dynamic Programming",
    5: "Advanced Graphs",
    6: "Contest Strategy",
  },
};

export const DOMAINS = [
  {
    id: "cpp-programming",
    name: "C++ Programming",
    icon: "⚡",
    color: "#4f8ef7",
    gradient: "linear-gradient(135deg, #1e3a6e, #4f8ef7)",
    description: "Master C++ from basics to advanced concepts",
    totalWeeks: 9,
  },
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    icon: "🌲",
    color: "#22c55e",
    gradient: "linear-gradient(135deg, #064e3b, #22c55e)",
    description: "Build problem-solving skills with DSA fundamentals",
    totalWeeks: 16,
  },
  {
    id: "web-development",
    name: "Web Development",
    icon: "🌐",
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #78350f, #f59e0b)",
    description: "Build modern websites from HTML to full-stack",
    totalWeeks: 8,
  },
  {
    id: "app-development",
    name: "App Development",
    icon: "📱",
    color: "#ec4899",
    gradient: "linear-gradient(135deg, #831843, #ec4899)",
    description: "Create mobile apps with React Native & Flutter",
    totalWeeks: 6,
  },
  {
    id: "ai-ml",
    name: "AI / ML",
    icon: "🤖",
    color: "#8b5cf6",
    gradient: "linear-gradient(135deg, #4c1d95, #8b5cf6)",
    description: "Explore machine learning and artificial intelligence",
    totalWeeks: 8,
  },
  {
    id: "competitive-programming",
    name: "Competitive Programming",
    icon: "🏆",
    color: "#ef4444",
    gradient: "linear-gradient(135deg, #7f1d1d, #ef4444)",
    description: "Sharpen your competitive coding edge",
    totalWeeks: 6,
  },
];

export const RESOURCES_BY_DOMAIN = {
  "cpp-programming": [
    // Module 1: Introduction & Basics
    { week: 1, order: 1, title: "C++ Tutorial for Beginners (Full Course)", type: "video", url: "https://www.youtube.com/watch?v=vLnPwxZdW4Y", description: "Bro Code — Complete C++ beginner tutorial in one video", alt_url: "https://www.youtube.com/watch?v=yGB9jhsEsr8", alt_source: "CodeWithHarry" },
    { week: 1, order: 2, title: "Introduction to C++", type: "article", url: "https://www.learncpp.com/cpp-tutorial/introduction-to-cplusplus/", description: "What is C++, history, and why learn it" },
    { week: 1, order: 3, title: "Setting Up Your IDE", type: "article", url: "https://www.learncpp.com/cpp-tutorial/introduction-to-the-compiler-linker-and-libraries/", description: "Compiler, linker, and IDE setup guide" },
    { week: 1, order: 4, title: "Variables & Data Types", type: "video", url: "https://www.youtube.com/watch?v=zB9RI8_wExo", description: "The Cherno — Variables and data types in C++", alt_url: "https://www.youtube.com/watch?v=jigb6W35zHc", alt_source: "CodeWithHarry" },
    { week: 1, order: 5, title: "Input & Output (cin/cout)", type: "article", url: "https://www.learncpp.com/cpp-tutorial/introduction-to-iostream-cout-cin-and-endl/", description: "Using iostream for user input and output" },
    { week: 1, order: 6, title: "C++ Hello World Challenge", type: "exercise", url: "https://www.hackerrank.com/challenges/cpp-hello-world/problem", description: "HackerRank — Your very first C++ challenge" },
    { week: 1, order: 7, title: "LearnCPP.com (Full Reference)", type: "docs", url: "https://www.learncpp.com/", description: "The best free structured C++ tutorial — bookmark this" },

    // Module 2: Operators & Flow Control
    { week: 2, order: 1, title: "Operators in C++", type: "video", url: "https://www.youtube.com/watch?v=cZc-bSCSliU", description: "Caleb Curry — Operators and expressions in C++", alt_url: "https://www.youtube.com/watch?v=7D5A5ZMKRWw", alt_source: "CodeWithHarry" },
    { week: 2, order: 2, title: "If-else & Switch Statements", type: "article", url: "https://www.learncpp.com/cpp-tutorial/if-statements-and-blocks/", description: "Conditional control flow with if-else and switch" },
    { week: 2, order: 3, title: "Loops in C++ (for, while, do-while)", type: "article", url: "https://www.learncpp.com/cpp-tutorial/for-statements/", description: "All loop types explained with examples" },
    { week: 2, order: 4, title: "Break, Continue & Scope", type: "article", url: "https://www.learncpp.com/cpp-tutorial/break-and-continue/", description: "Loop control statements and variable scope" },
    { week: 2, order: 5, title: "Type Conversion & Casting", type: "article", url: "https://www.learncpp.com/cpp-tutorial/implicit-type-conversion-coercion/", description: "Implicit and explicit type conversions in C++" },
    { week: 2, order: 6, title: "Bitwise Operators", type: "article", url: "https://www.learncpp.com/cpp-tutorial/bitwise-operators/", description: "AND, OR, XOR, NOT, shift operators explained" },
    { week: 2, order: 7, title: "HackerRank C++ Conditionals & Loops", type: "exercise", url: "https://www.hackerrank.com/domains/cpp?filters%5Bsubdomains%5D%5B%5D=cpp-introduction", description: "HackerRank — Practice conditionals and loops in C++" },

    // Module 3: Pointers, Arrays & Data Types
    { week: 3, order: 1, title: "Pointers in C++", type: "video", url: "https://www.youtube.com/watch?v=DTxHyVn0ODg", description: "The Cherno — Understanding pointers clearly", alt_url: "https://www.youtube.com/watch?v=EvYmTCx9BFs", alt_source: "CodeWithHarry" },
    { week: 3, order: 2, title: "References in C++", type: "video", url: "https://www.youtube.com/watch?v=IzoFn3dfsPA", description: "The Cherno — References vs pointers", alt_url: "https://www.youtube.com/watch?v=a7Wim2t053E", alt_source: "CodeWithHarry" },
    { week: 3, order: 3, title: "Arrays in C++", type: "video", url: "https://www.youtube.com/watch?v=ENDaJi08jCU", description: "The Cherno — Static and dynamic arrays", alt_url: "https://www.youtube.com/watch?v=ePJxpxsnkGw", alt_source: "CodeWithHarry" },
    { week: 3, order: 4, title: "Strings in C++", type: "video", url: "https://www.youtube.com/watch?v=ijIxcB9qjaU", description: "The Cherno — C-style strings vs std::string" },
    { week: 3, order: 5, title: "Structs in C++", type: "article", url: "https://www.learncpp.com/cpp-tutorial/introduction-to-structs-members-and-member-selection/", description: "User-defined data types with structs" },
    { week: 3, order: 6, title: "Enums in C++", type: "video", url: "https://www.youtube.com/watch?v=x55jfOd5PEE", description: "The Cherno — Enumerations and scoped enums", alt_url: "https://www.youtube.com/watch?v=jCfR7CFlzts", alt_source: "CodeWithHarry" },
    { week: 3, order: 7, title: "Pointers Practice (GFG)", type: "exercise", url: "https://www.geeksforgeeks.org/c-programming-language/#pointers", description: "GFG — Hands-on pointer and array exercises" },

    // Module 4: Functions & Recursion
    { week: 4, order: 1, title: "Functions in C++", type: "video", url: "https://www.youtube.com/watch?v=V9zuox47zr0", description: "The Cherno — Function declaration, definition, and calling", alt_url: "https://www.youtube.com/watch?v=RFLFX1boGwo", alt_source: "CodeWithHarry" },
    { week: 4, order: 2, title: "Function Parameters (Pass by Value/Reference)", type: "article", url: "https://www.learncpp.com/cpp-tutorial/passing-arguments-by-value/", description: "Pass by value, reference, and pointer" },
    { week: 4, order: 3, title: "Default Arguments & Overloading", type: "article", url: "https://www.learncpp.com/cpp-tutorial/default-arguments/", description: "Default parameters and function overloading" },
    { week: 4, order: 4, title: "Recursion", type: "video", url: "https://www.youtube.com/watch?v=ke0zy5-K6RY", description: "Reducible — Recursion explained visually", alt_url: "https://www.youtube.com/watch?v=JRKs3s15Kjc", alt_source: "CodeWithHarry" },
    { week: 4, order: 5, title: "Header Files & Multi-file Projects", type: "video", url: "https://www.youtube.com/watch?v=9RJTQmK0YPI", description: "The Cherno — Header files, include guards, and linking", alt_url: "https://www.youtube.com/watch?v=7D5A5ZMKRWw", alt_source: "CodeWithHarry" },
    { week: 4, order: 6, title: "Inline Functions & Overloading", type: "article", url: "https://www.learncpp.com/cpp-tutorial/introduction-to-function-overloading/", description: "Inline, overloaded functions and how to use them" },

    // Module 5: Revise & Practice
    { week: 5, order: 1, title: "C++ Practice: Basic Problems", type: "exercise", url: "https://www.geeksforgeeks.org/cpp-programming-examples/", description: "GFG — Even/Odd, Sum of Digits, Reverse Number" },
    { week: 5, order: 2, title: "C++ Practice: Logic Building", type: "exercise", url: "https://www.hackerrank.com/domains/cpp", description: "HackerRank — C++ domain problems" },
    { week: 5, order: 3, title: "C++ Practice: Arrays & Strings", type: "exercise", url: "https://leetcode.com/problemset/?topicSlugs=array,string", description: "LeetCode — Array and string problems" },
    { week: 5, order: 4, title: "C++ Exercises (W3Schools)", type: "exercise", url: "https://www.w3schools.com/cpp/cpp_exercises.asp", description: "W3Schools — Interactive C++ exercises by topic" },
    { week: 5, order: 5, title: "cppreference.com (Complete Reference)", type: "docs", url: "https://en.cppreference.com/w/cpp", description: "The gold standard C++ language and STL reference" },
    { week: 5, order: 6, title: "Codechef C++ Beginner Problems", type: "exercise", url: "https://www.codechef.com/practice/course/c-plus-plus", description: "Codechef — Beginner-friendly structured C++ practice" },

    // Module 6: OOP Part 1
    { week: 6, order: 1, title: "Classes & Objects", type: "video", url: "https://www.youtube.com/watch?v=2BP8NhxjrO0", description: "The Cherno — Classes in C++", alt_url: "https://www.youtube.com/watch?v=nGJTWaaFdjc", alt_source: "CodeWithHarry" },
    { week: 6, order: 2, title: "Classes vs Structs", type: "video", url: "https://www.youtube.com/watch?v=fLgTtaqqJp0", description: "The Cherno — When to use class vs struct", alt_url: "https://www.youtube.com/watch?v=tL8vnfFFzVQ", alt_source: "CodeWithHarry" },
    { week: 6, order: 3, title: "Constructors & Destructors", type: "video", url: "https://www.youtube.com/watch?v=FXhALMsHwEY", description: "The Cherno — Constructor types and destructor", alt_url: "https://www.youtube.com/watch?v=EEJUPXFKe8Q", alt_source: "CodeWithHarry" },
    { week: 6, order: 4, title: "Encapsulation & Access Specifiers", type: "article", url: "https://www.geeksforgeeks.org/cpp/encapsulation-in-cpp/", description: "Public, private, protected access modifiers and encapsulation" },
    { week: 6, order: 5, title: "Static Members & Methods", type: "video", url: "https://www.youtube.com/watch?v=V-BFlMrBtqQ", description: "The Cherno — Static keyword in classes", alt_url: "https://www.youtube.com/watch?v=QcLI2zGVYFo", alt_source: "CodeWithHarry" },
    { week: 6, order: 6, title: "The 'this' Pointer", type: "article", url: "https://www.learncpp.com/cpp-tutorial/the-hidden-this-pointer-and-member-function-chaining/", description: "The implicit this pointer and its uses" },
    { week: 6, order: 7, title: "Const in Classes", type: "video", url: "https://www.youtube.com/watch?v=4fJBrditnJU", description: "The Cherno — Const correctness with classes", alt_url: "https://www.youtube.com/watch?v=i3a-G6Ebh9E", alt_source: "CodeWithHarry" },

    // Module 7: OOP Part 2
    { week: 7, order: 1, title: "Copy Constructor & Copy Assignment", type: "article", url: "https://www.learncpp.com/cpp-tutorial/the-copy-constructor/", description: "Deep copy vs shallow copy, Rule of Three" },
    { week: 7, order: 2, title: "Operator Overloading", type: "video", url: "https://www.youtube.com/watch?v=mS9755gF66w", description: "The Cherno — Overloading operators in C++" },
    { week: 7, order: 3, title: "Dynamic Memory (new/delete)", type: "video", url: "https://www.youtube.com/watch?v=sNcj0lPxFfc", description: "The Cherno — Heap allocation with new and delete", alt_url: "https://www.youtube.com/watch?v=2Y0b9nFA9s8", alt_source: "CodeWithHarry" },
    { week: 7, order: 4, title: "Smart Pointers", type: "video", url: "https://www.youtube.com/watch?v=UOB7-B2MfwA", description: "The Cherno — unique_ptr, shared_ptr, weak_ptr" },
    { week: 7, order: 5, title: "Move Semantics & Rvalue References", type: "video", url: "https://www.youtube.com/watch?v=ehMg6zvXuMY", description: "The Cherno — Move semantics explained" },
    { week: 7, order: 6, title: "Shallow vs Deep Copy", type: "article", url: "https://www.geeksforgeeks.org/shallow-copy-and-deep-copy-in-c/", description: "GFG — Difference between shallow and deep copy" },
    { week: 7, order: 7, title: "Friend Functions & Classes", type: "article", url: "https://www.learncpp.com/cpp-tutorial/friend-functions-and-classes/", description: "Accessing private members via friend keyword" },

    // Module 8: OOP Part 3 — Inheritance & Polymorphism
    { week: 8, order: 1, title: "Inheritance", type: "video", url: "https://www.youtube.com/watch?v=X8nYM8wdNRE", description: "The Cherno — Inheritance in C++", alt_url: "https://www.youtube.com/watch?v=RO1ZYW9NAzg", alt_source: "CodeWithHarry" },
    { week: 8, order: 2, title: "Types of Inheritance", type: "article", url: "https://www.learncpp.com/cpp-tutorial/introduction-to-inheritance/", description: "Single, multiple, multilevel inheritance" },
    { week: 8, order: 3, title: "Virtual Functions", type: "video", url: "https://www.youtube.com/watch?v=oIV2KchSyGQ", description: "The Cherno — Virtual functions & vtables", alt_url: "https://www.youtube.com/watch?v=fB3JHNnlRfI", alt_source: "CodeWithHarry" },
    { week: 8, order: 4, title: "Pure Virtual Functions (Interfaces)", type: "video", url: "https://www.youtube.com/watch?v=UWAdd13EfM8", description: "The Cherno — Abstract classes and interfaces", alt_url: "https://www.youtube.com/watch?v=RBAWWutf0fY", alt_source: "CodeWithHarry" },
    { week: 8, order: 5, title: "Virtual Destructors", type: "video", url: "https://www.youtube.com/watch?v=jELbKhGkEi0", description: "The Cherno — Why virtual destructors matter" },
    { week: 8, order: 6, title: "Multiple Inheritance & Diamond Problem", type: "article", url: "https://www.learncpp.com/cpp-tutorial/virtual-base-classes/", description: "Virtual base classes and the diamond problem" },
    { week: 8, order: 7, title: "Casting in C++ (static, dynamic, const, reinterpret)", type: "video", url: "https://www.youtube.com/watch?v=pWZS1MtxI-A", description: "The Cherno — All four C++ casts explained" },
    { week: 8, order: 8, title: "OOP Practice Problems", type: "exercise", url: "https://www.geeksforgeeks.org/cpp-polymorphism/", description: "GFG — Practice polymorphism and inheritance" },

    // Module 9: STL & Advanced Topics
    { week: 9, order: 1, title: "Templates in C++", type: "video", url: "https://www.youtube.com/watch?v=I-hZkUa9mIs", description: "The Cherno — Function and class templates", alt_url: "https://www.youtube.com/watch?v=kKJeekDKU30", alt_source: "CodeWithHarry" },
    { week: 9, order: 2, title: "Introduction to STL", type: "article", url: "https://www.geeksforgeeks.org/the-c-standard-template-library-stl/", description: "GFG — Overview of Standard Template Library", alt_url: "https://www.youtube.com/watch?v=c9iREsYpayk", alt_source: "CodeWithHarry" },
    { week: 9, order: 3, title: "Containers in STL", type: "article", url: "https://www.geeksforgeeks.org/containers-cpp-stl/", description: "GFG — Different types of containers in C++", alt_url: "https://www.youtube.com/watch?v=m0gnToak2-g", alt_source: "CodeWithHarry" },
    { week: 9, order: 4, title: "std::vector", type: "video", url: "https://www.youtube.com/watch?v=PocJ5jXv8No", description: "The Cherno — Using vectors properly", alt_url: "https://www.youtube.com/watch?v=wKDvMcJiEPM", alt_source: "CodeWithHarry" },
    { week: 9, order: 5, title: "std::list", type: "article", url: "https://www.geeksforgeeks.org/list-cpp-stl/", description: "GFG — Doubly linked list in STL", alt_url: "https://www.youtube.com/watch?v=OI4CXwpMBhE", alt_source: "CodeWithHarry" },
    { week: 9, order: 6, title: "std::map & std::unordered_map", type: "article", url: "https://www.geeksforgeeks.org/map-cpp-stl/", description: "Key-value containers: map, unordered_map", alt_url: "https://www.youtube.com/watch?v=KwS-Vbsha1k", alt_source: "CodeWithHarry" },
    { week: 9, order: 7, title: "Iterators", type: "article", url: "https://www.learncpp.com/cpp-tutorial/introduction-to-iterators/", description: "Iterator types and how to traverse containers" },
    { week: 9, order: 8, title: "Function Objects (Functors)", type: "article", url: "https://www.geeksforgeeks.org/functors-in-cpp/", description: "GFG — Using objects as functions", alt_url: "https://www.youtube.com/watch?v=g4AQiptpcI8", alt_source: "CodeWithHarry" },
    { week: 9, order: 9, title: "Lambda Functions", type: "video", url: "https://www.youtube.com/watch?v=mWgmBBz0y8c", description: "The Cherno — Lambda expressions in C++" },
    { week: 9, order: 10, title: "STL Algorithms (sort, find, accumulate)", type: "article", url: "https://www.learncpp.com/cpp-tutorial/introduction-to-standard-library-algorithms/", description: "Common STL algorithms and how to use them" },
    { week: 9, order: 11, title: "C++ STL Cheat Sheet", type: "docs", url: "https://www.geeksforgeeks.org/cpp-stl-cheat-sheet/", description: "GFG — Quick reference for all STL containers and algorithms" },
    { week: 9, order: 12, title: "Exception Handling in C++", type: "article", url: "https://www.learncpp.com/cpp-tutorial/basic-exception-handling/", description: "try, catch, throw — handle runtime errors gracefully" },
  ],

      "dsa": [
    // Module 1 - Level 0: How to Prepare & Roadmaps
    { week: 1, order: 1, title: "Striver's A2Z DSA Sheet", type: "tool", url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2", description: "The definitive structured DSA roadmap - your main guide." },
    { week: 1, order: 2, title: "Apna College DSA Roadmap", type: "video", url: "https://www.youtube.com/watch?v=kWE-0Y5v68k", description: "Complete strategy and roadmap by Shraddha Didi & Aman Bhaiya." },
    { week: 1, order: 3, title: "Love Babbar DSA Sheet", type: "tool", url: "https://www.geeksforgeeks.org/dsa/dsa-sheet-by-love-babbar/", description: "The legendary 450 DSA questions sheet." },

    // Module 2 - Basics & Fundamentals
    { week: 2, order: 1, title: "Striver's Basics & STL (A2Z Playlist)", type: "video", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz", description: "Basics of C++/Java, time complexity, and STL walkthrough." },
    { week: 2, order: 2, title: "Striver's C++ STL in 1 Video", type: "video", url: "https://www.youtube.com/watch?v=RRVYpIUr5NE", description: "Master the Standard Template Library in one single tutorial." },
    { week: 2, order: 3, title: "C++ Basics Playlist (Love Babbar)", type: "video", url: "https://www.youtube.com/playlist?list=PLDzeHZWIZsTryvtXdFs6bLnx0cZpWjH2Z", description: "Learn the absolute basics of C++ programming." },

    // Module 3 - Sorting Techniques
    { week: 3, order: 1, title: "Striver's Sorting Section (A2Z Playlist)", type: "video", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz", description: "Selection, Bubble, Insertion, Merge, and Quick Sort algorithms." },
    { week: 3, order: 2, title: "Sorting Algorithms Playlist (CodeHelp)", type: "video", url: "https://www.youtube.com/playlist?list=PLDzeHZWIZsTryvtXdFs6bLnx0cZpWjH2Z", description: "Sorting algorithm concepts & implementations by Love Babbar." },

    // Module 4 - Arrays
    { week: 4, order: 1, title: "Striver's Arrays Section (A2Z Playlist)", type: "video", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz", description: "Array fundamentals to hard FAANG interview questions." },
    { week: 4, order: 2, title: "Arrays Playlist (Love Babbar)", type: "video", url: "https://www.youtube.com/playlist?list=PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA", description: "Excellent array problem solving sessions." },

    // Module 5 - Binary Search
    { week: 5, order: 1, title: "Striver's Binary Search Playlist", type: "video", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0pMFvwWEPEmZbdzFng_pB1-", description: "Detailed Binary Search on 1D, 2D arrays and search-on-answers." },
    { week: 5, order: 2, title: "Binary Search Playlist (Aditya Verma)", type: "video", url: "https://www.youtube.com/playlist?list=PL_z_8CaSLPW1xkswkNDwL_T6D28W1Y57P", description: "Aditya Verma's legendary take on Binary Search variations." },

    // Module 6 - Strings
    { week: 6, order: 1, title: "Striver's Strings Section (A2Z Playlist)", type: "video", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz", description: "Complete string manipulation and pattern matching." },

    // Module 7 - Linked Lists
    { week: 7, order: 1, title: "Striver's Linked List Playlist", type: "video", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0p4ozDR_kJJk0nb1wTbOPx_", description: "Singly, Doubly, and hard Linked List problems." },
    { week: 7, order: 2, title: "Linked List Playlist (Love Babbar)", type: "video", url: "https://www.youtube.com/playlist?list=PLDzeHZWIZsTr54_GL_SSQDz1keAEx_Ivs", description: "Very detailed LL concepts and interview questions." },

    // Module 8 - Recursion & Backtracking
    { week: 8, order: 1, title: "Striver's Recursion Playlist", type: "video", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0rGlzIn_7rsaR2FQ5e6ZOL9", description: "Recursion & Backtracking from beginner to advanced." },
    { week: 8, order: 2, title: "Recursion Playlist (Aditya Verma)", type: "video", url: "https://www.youtube.com/playlist?list=PL_z_8CaSLPWdeOznilMo7GZpWJ_zU-8U4", description: "The best recursion playlist to build strong logical foundations." },

    // Module 9 - Bit Manipulation
    { week: 9, order: 1, title: "Striver's Bit Manipulation Playlist", type: "video", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0rnqhcgjsKANqrFZIGmX9iP", description: "Learn tricks and techniques with binary operators." },
    { week: 9, order: 2, title: "Bit Manipulation (Love Babbar)", type: "video", url: "https://www.youtube.com/playlist?list=PLDzeHZWIZsTryvtXdFs6bLnx0cZpWjH2Z", description: "Master bitwise operators for interviews." },

    // Module 10 - Stacks & Queues
    { week: 10, order: 1, title: "Striver's Stacks & Queues Playlist", type: "video", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oSO572kQ7KCSvCUh1AdILj", description: "Comprehensive coverage of stack/queue patterns." },
    { week: 10, order: 2, title: "Stacks Playlist (Aditya Verma)", type: "video", url: "https://www.youtube.com/playlist?list=PL_z_8CaSLPWdeOshneZ8S9V4MuUW938Zz", description: "Aditya Verma's legendary Stack playlist (NGR, NGL, MAH, etc)." },

    // Module 11 - Sliding Window & Two Pointers
    { week: 11, order: 1, title: "Striver's Two Pointer & Sliding Window", type: "video", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0q7qhIAQhU9bV9T8jR-14ZJ", description: "Learn Two Pointer and Sliding Window algorithms." },
    { week: 11, order: 2, title: "Sliding Window Playlist (Aditya Verma)", type: "video", url: "https://www.youtube.com/playlist?list=PL_z_8CaSLPWeM8BDJmIYDaoQ5zuwyxnfj", description: "Master the fixed and variable size sliding window patterns." },

    // Module 12 - Heaps
    { week: 12, order: 1, title: "Striver's Heaps Section (A2Z Playlist)", type: "video", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz", description: "Understanding Min Heap, Max Heap, and Priority Queue." },
    { week: 12, order: 2, title: "Heaps Playlist (Aditya Verma)", type: "video", url: "https://www.youtube.com/playlist?list=PL_z_8CaSLPWdeOznilMo8Sj5pM8Jv-KK-", description: "Aditya Verma's legendary heap identification and problem-solving." },

    // Module 13 - Greedy Algorithms
    { week: 13, order: 1, title: "Striver's Greedy Algorithms Playlist", type: "video", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0po52OqBEEwOqJ7yPqP9Qx8", description: "Learn to identify and solve greedy strategy problems." },

    // Module 14 - Binary Trees & BSTs
    { week: 14, order: 1, title: "Striver's Trees Playlist", type: "video", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0q8Hkd7bK2Bpryj2xVJk8Vk", description: "The most exhaustive Binary Tree and BST playlist." },
    { week: 14, order: 2, title: "Binary Trees Playlist (Love Babbar)", type: "video", url: "https://www.youtube.com/playlist?list=PLDzeHZWIZsToJ9zCR0zn_BscwW0M8G9zU", description: "Alternative detailed series on Tree data structures." },

    // Module 15 - Graphs
    { week: 15, order: 1, title: "Striver's Graphs Playlist", type: "video", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oE3gA41TKO2H5bHpPd7fzn", description: "The ultimate 50-video Graph series (BFS, DFS, Shortest Paths, DSU)." },
    { week: 15, order: 2, title: "Graphs Playlist (Love Babbar)", type: "video", url: "https://www.youtube.com/playlist?list=PLDzeHZWIZsTobi35C3I-tKB3tKDX6cgXn", description: "Excellent graph algorithms playlist." },

    // Module 16 - Dynamic Programming
    { week: 16, order: 1, title: "Striver's Dynamic Programming Playlist", type: "video", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0qUlt5H_kiKYaNSqJ81P89X", description: "Modern DP series with space optimization strategies." },
    { week: 16, order: 2, title: "Dynamic Programming Playlist (Aditya Verma)", type: "video", url: "https://www.youtube.com/playlist?list=PL_z_8CaSLPWekqhdCPmFohncHwz8TY2Go", description: "The best DP playlist on YouTube. Period. Knapsack, LCS, MCM." },
  ],
"web-development": [
    // Module 1 – HTML, CSS & Git (Absolute Essentials)
    { week: 1, order: 1, title: "Git & GitHub Crash Course", type: "video", url: "https://www.youtube.com/watch?v=RGOj5yH7evk", description: "Version control — the #1 skill every developer needs from day one" },
    { week: 1, order: 2, title: "HTML5 Fundamentals", type: "article", url: "https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML", description: "Semantic HTML, forms, accessibility basics" },
    { week: 1, order: 3, title: "CSS Basics, Box Model & Flexbox", type: "video", url: "https://www.youtube.com/watch?v=1Rs2ND1ryYc", description: "CSS fundamentals crash course" },
    { week: 1, order: 4, title: "Flexbox Froggy (Interactive)", type: "tool", url: "https://flexboxfroggy.com/", description: "Learn Flexbox interactively — then try Grid Garden for CSS Grid" },
    { week: 1, order: 5, title: "CSS Grid Garden (Interactive)", type: "tool", url: "https://cssgridgarden.com/", description: "Learn CSS Grid layout with a fun interactive game" },
    { week: 1, order: 6, title: "HTML & CSS Full Course (FCC)", type: "video", url: "https://www.youtube.com/watch?v=mU6anWqZJcc", description: "FreeCodeCamp — 4-hour comprehensive HTML & CSS course" },

    // Module 2 – JavaScript Basics
    { week: 2, order: 1, title: "JavaScript for Beginners", type: "video", url: "https://www.youtube.com/watch?v=W6NZfCO5SIk", description: "JS crash course — variables, functions, arrays, objects" },
    { week: 2, order: 2, title: "DOM Manipulation", type: "article", url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Manipulating_documents", description: "Query, modify, and listen to DOM events" },
    { week: 2, order: 3, title: "Responsive Design & Media Queries", type: "article", url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design", description: "Mobile-first design and breakpoints" },
    { week: 2, order: 4, title: "The Odin Project Foundations", type: "exercise", url: "https://www.theodinproject.com/paths/foundations/courses/foundations", description: "Best free full-stack curriculum — covers HTML/CSS/JS with projects" },
    { week: 2, order: 5, title: "JavaScript.info (Modern Tutorial)", type: "docs", url: "https://javascript.info/", description: "The most complete modern JS tutorial — bookmark this site" },
    { week: 2, order: 6, title: "FCC JavaScript Certification", type: "exercise", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/", description: "300+ hours of free JS exercises and projects" },

    // Module 3 – JavaScript Advanced
    { week: 3, order: 1, title: "ES6+ Features (Arrow, Destructure, Async/Await)", type: "video", url: "https://www.youtube.com/watch?v=NCwa_xi0Uuc", description: "Modern JS: arrow functions, spread, promises, async/await" },
    { week: 3, order: 2, title: "Fetch API & Working with REST APIs", type: "article", url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch", description: "Making HTTP requests from JavaScript" },
    { week: 3, order: 3, title: "Tailwind CSS Crash Course", type: "video", url: "https://www.youtube.com/watch?v=pfaSUYaSgRo", description: "Utility-first CSS — the most popular styling approach in 2024/25" },
    { week: 3, order: 4, title: "JavaScript30 Challenge", type: "exercise", url: "https://javascript30.com/", description: "30 vanilla JS projects — build real things without frameworks" },
    { week: 3, order: 5, title: "Event Loop Explained (JSConf)", type: "video", url: "https://www.youtube.com/watch?v=8aGhZQkoFbQ", description: "Philip Roberts — What is the event loop? (most-watched JS talk)" },
    { week: 3, order: 6, title: "JavaScript Closures (MDN)", type: "article", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures", description: "MDN — Closures explained — one of JS's most important concepts" },

    // Module 4 – React
    { week: 4, order: 1, title: "React Crash Course", type: "video", url: "https://www.youtube.com/watch?v=w7ejDZ8SWv8", description: "React fundamentals by Traversy Media" },
    { week: 4, order: 2, title: "React Hooks (useState, useEffect, useContext)", type: "docs", url: "https://react.dev/reference/react", description: "Official React documentation — hooks reference" },
    { week: 4, order: 3, title: "State Management with Zustand", type: "docs", url: "https://docs.pmnd.rs/zustand/getting-started/introduction", description: "Lightweight global state — simpler than Redux for most projects" },
    { week: 4, order: 4, title: "React Router v6", type: "article", url: "https://reactrouter.com/en/main/start/tutorial", description: "Client-side routing in React apps" },
    { week: 4, order: 5, title: "Build 15 React Projects (FCC)", type: "exercise", url: "https://www.freecodecamp.org/news/solidify-your-react-skills-by-building-15-projects/", description: "FCC — 15 real React projects to solidify your skills" },
    { week: 4, order: 6, title: "React Performance (Rendering & Memo)", type: "article", url: "https://react.dev/learn/render-and-commit", description: "Official React — understand rendering, memo, useMemo, useCallback" },

    // Module 5 – Next.js & Backend
    { week: 5, order: 1, title: "Next.js Crash Course", type: "video", url: "https://www.youtube.com/watch?v=mTz0GXj8NN0", description: "The React framework for production — SSR, SSG, App Router" },
    { week: 5, order: 2, title: "Node.js & Express Basics", type: "video", url: "https://www.youtube.com/watch?v=fBNz5xF-Kx4", description: "Build a Node.js REST API with Express" },
    { week: 5, order: 3, title: "REST API Design Best Practices", type: "article", url: "https://expressjs.com/en/starter/basic-routing.html", description: "Routes, middleware, error handling in Express" },
    { week: 5, order: 4, title: "Supabase – Backend as a Service", type: "docs", url: "https://supabase.com/docs", description: "Auth, database, storage — backend without writing a server" },
    { week: 5, order: 5, title: "tRPC – End-to-end Typesafe APIs", type: "docs", url: "https://trpc.io/docs/quickstart", description: "Type-safe API calls between Next.js frontend and backend" },

    // Module 6 – Databases & Auth
    { week: 6, order: 1, title: "SQL Basics (Full Course)", type: "video", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY", description: "SELECT, JOIN, WHERE, GROUP BY — SQL from scratch" },
    { week: 6, order: 2, title: "PostgreSQL with Supabase", type: "docs", url: "https://supabase.com/docs/guides/database/overview", description: "Database management with Supabase" },
    { week: 6, order: 3, title: "Authentication Flows (JWT, OAuth, Sessions)", type: "article", url: "https://supabase.com/docs/guides/auth", description: "Supabase Auth with Google/GitHub OAuth" },
    { week: 6, order: 4, title: "Web Security Basics (XSS, CSRF, SQL Injection)", type: "article", url: "https://owasp.org/www-project-top-ten/", description: "OWASP Top 10 — essential security knowledge for every dev" },
    { week: 6, order: 5, title: "SQLZoo (Interactive SQL Practice)", type: "exercise", url: "https://sqlzoo.net/", description: "Interactive SQL problems with instant feedback" },

    // Module 7 – Deployment & DevOps Basics
    { week: 7, order: 1, title: "Deploying with Vercel", type: "docs", url: "https://vercel.com/docs", description: "Deploy Next.js/Vite apps to Vercel in minutes" },
    { week: 7, order: 2, title: "CI/CD with GitHub Actions", type: "article", url: "https://docs.github.com/en/actions/quickstart", description: "Automate tests and deployments with GitHub Actions" },
    { week: 7, order: 3, title: "Environment Variables & Secrets Management", type: "article", url: "https://www.freecodecamp.org/news/how-to-use-node-environment-variables-with-a-dotenv-file-for-node-js-and-npm/", description: "Securely manage .env variables in production" },
    { week: 7, order: 4, title: "Docker for Developers (Crash Course)", type: "video", url: "https://www.youtube.com/watch?v=pTFZFxd5hgI", description: "Docker crash course — containerize your web application" },
    { week: 7, order: 5, title: "Deploy on Railway / Render", type: "docs", url: "https://docs.railway.app/guides/deploy", description: "Free Node.js & database hosting for your side projects" },

    // Module 8 – TypeScript, Performance & Portfolio
    { week: 8, order: 1, title: "TypeScript for React Developers", type: "video", url: "https://www.youtube.com/watch?v=jBmrduvKl5w", description: "Add types to your React/Next.js codebase" },
    { week: 8, order: 2, title: "Web Performance & Core Web Vitals", type: "docs", url: "https://web.dev/performance/", description: "LCP, FID, CLS — optimize for real-world speed" },
    { week: 8, order: 3, title: "Testing with Jest & React Testing Library", type: "docs", url: "https://testing-library.com/docs/react-testing-library/intro/", description: "Unit and integration testing for React components" },
    { week: 8, order: 4, title: "Full Stack Portfolio Project Ideas", type: "article", url: "https://www.freecodecamp.org/news/full-stack-project-ideas/", description: "Build 2-3 portfolio-worthy projects to land your first job" },
    { week: 8, order: 5, title: "TypeScript Official Handbook", type: "docs", url: "https://www.typescriptlang.org/docs/handbook/intro.html", description: "Official TypeScript docs — interfaces, generics, utility types" },
  ],

  "app-development": [
    // Module 1 – Foundations & Environment Setup
    { week: 1, order: 1, title: "Intro to Mobile Development (Native vs Cross-Platform)", type: "video", url: "https://www.youtube.com/watch?v=0-S5a0eXPoc", description: "Why cross-platform? React Native vs Flutter comparison" },
    { week: 1, order: 2, title: "React Native + Expo Setup", type: "docs", url: "https://docs.expo.dev/tutorial/introduction/", description: "Get started with Expo — the fastest path to your first RN app" },
    { week: 1, order: 3, title: "JavaScript/React Refresher for RN", type: "article", url: "https://reactnative.dev/docs/intro-react", description: "React concepts that directly transfer to React Native" },
    { week: 1, order: 4, title: "React Native Core Components Deep Dive", type: "docs", url: "https://reactnative.dev/docs/intro-react-native-components", description: "View, Text, Image, ScrollView, FlatList — the building blocks" },
    { week: 1, order: 5, title: "React Native Full Course (FCC)", type: "video", url: "https://www.youtube.com/watch?v=obH0Po_RdWk", description: "FreeCodeCamp — 5-hour React Native crash course for beginners" },

    // Module 2 – Styling & Navigation
    { week: 2, order: 1, title: "Styling in React Native (StyleSheet + Flexbox)", type: "article", url: "https://reactnative.dev/docs/style", description: "StyleSheet API, Flexbox layout, platform-specific styles" },
    { week: 2, order: 2, title: "React Navigation – Stack, Tab & Drawer", type: "docs", url: "https://reactnavigation.org/docs/getting-started/", description: "The standard navigation library for React Native" },
    { week: 2, order: 3, title: "NativeWind (Tailwind for React Native)", type: "docs", url: "https://www.nativewind.dev/quick-starts/expo", description: "Use Tailwind CSS utility classes in React Native" },
    { week: 2, order: 4, title: "Build a Simple Multi-Screen App", type: "exercise", url: "https://www.youtube.com/watch?v=0-S5a0eXPoc", description: "Practice: build a 3-screen app with navigation and custom styles" },
    { week: 2, order: 5, title: "Gluestack UI — RN Components", type: "docs", url: "https://gluestack.io/ui/docs/overview/introduction", description: "Beautiful accessible component library for React Native & Expo" },

    // Module 3 – State, Data & APIs
    { week: 3, order: 1, title: "Hooks in React Native (useState, useEffect, useContext)", type: "video", url: "https://www.youtube.com/watch?v=9U3IhLAnSxM", description: "State management fundamentals for mobile" },
    { week: 3, order: 2, title: "AsyncStorage – Persist Data Locally", type: "docs", url: "https://react-native-async-storage.github.io/async-storage/docs/usage", description: "Store data on device without a server" },
    { week: 3, order: 3, title: "Zustand for Global State in RN", type: "docs", url: "https://docs.pmnd.rs/zustand/getting-started/introduction", description: "Simple global state management for mobile apps" },
    { week: 3, order: 4, title: "Fetching APIs with Axios", type: "article", url: "https://www.freecodecamp.org/news/how-to-use-react-native-with-axios/", description: "REST API calls from your mobile app" },
    { week: 3, order: 5, title: "TanStack Query for React Native", type: "docs", url: "https://tanstack.com/query/latest/docs/framework/react/react-native", description: "Powerful server-state caching and data fetching in mobile apps" },

    // Module 4 – Firebase & Backend Integration
    { week: 4, order: 1, title: "Firebase Setup & Firestore Database", type: "docs", url: "https://firebase.google.com/docs/firestore/quickstart", description: "Add a real-time database to your app — no backend server needed" },
    { week: 4, order: 2, title: "Firebase Authentication (Google, Email)", type: "docs", url: "https://firebase.google.com/docs/auth/web/start", description: "Add login/signup to your app with Firebase Auth" },
    { week: 4, order: 3, title: "Supabase with React Native", type: "docs", url: "https://supabase.com/docs/guides/getting-started/quickstarts/reactnative", description: "Alternative to Firebase — open source backend" },
    { week: 4, order: 4, title: "Push Notifications with Expo", type: "docs", url: "https://docs.expo.dev/push-notifications/overview/", description: "Send push notifications to iOS and Android devices" },
    { week: 4, order: 5, title: "Build a Chat App with Firebase", type: "exercise", url: "https://www.youtube.com/watch?v=B6bKBiljKxU", description: "Real-time chat app tutorial with Firebase & React Native" },

    // Module 5 – Advanced Features & Device APIs
    { week: 5, order: 1, title: "Expo Camera, Location & Device APIs", type: "docs", url: "https://docs.expo.dev/versions/latest/sdk/camera/", description: "Access camera, GPS, accelerometer, contacts from your app" },
    { week: 5, order: 2, title: "App Performance Optimization", type: "article", url: "https://reactnative.dev/docs/performance", description: "FlatList optimization, memo, useMemo, avoid re-renders" },
    { week: 5, order: 3, title: "Animations with React Native Reanimated", type: "docs", url: "https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/your-first-animation/", description: "Smooth 60fps animations and gestures" },
    { week: 5, order: 4, title: "Build a Full App: Todo + Auth + DB", type: "exercise", url: "https://www.youtube.com/watch?v=2lXD-vv4hGQ", description: "End-to-end project: auth, CRUD, local + remote storage" },
    { week: 5, order: 5, title: "Gesture Handler & Swipeable Components", type: "docs", url: "https://docs.swmansion.com/react-native-gesture-handler/docs/", description: "Add swipe, pinch, and pan gestures to your app" },

    // Module 6 – Publishing & Beyond
    { week: 6, order: 1, title: "Publishing to Google Play Store", type: "docs", url: "https://reactnative.dev/docs/signed-apk-android", description: "Generate signed APK/AAB and publish to Android" },
    { week: 6, order: 2, title: "Publishing to Apple App Store", type: "docs", url: "https://reactnative.dev/docs/publishing-to-app-store", description: "iOS App Store submission guide" },
    { week: 6, order: 3, title: "EAS Build & Over-the-Air Updates", type: "docs", url: "https://docs.expo.dev/build/introduction/", description: "Expo Application Services for CI/CD mobile builds" },
    { week: 6, order: 4, title: "App Monetization (Ads, IAP, Subscriptions)", type: "article", url: "https://www.freecodecamp.org/news/how-to-monetize-your-mobile-app/", description: "Strategies to earn from your published app" },
    { week: 6, order: 5, title: "Flutter Intro for RN Developers", type: "video", url: "https://www.youtube.com/watch?v=1ukSR1GRtMU", description: "Quick transition guide — Flutter basics for RN developers" },
  ],

  "ai-ml": [
    // Module 1 – Python for ML
    { week: 1, order: 1, title: "Python Crash Course", type: "video", url: "https://www.youtube.com/watch?v=_uQrJ0TkZlc", description: "Python basics — the language of AI/ML" },
    { week: 1, order: 2, title: "NumPy for ML (Arrays & Operations)", type: "docs", url: "https://numpy.org/doc/stable/user/quickstart.html", description: "NumPy arrays, indexing, broadcasting, vectorization" },
    { week: 1, order: 3, title: "Pandas for Data Analysis", type: "video", url: "https://www.youtube.com/watch?v=vmEHCJofslg", description: "DataFrames, groupby, merging, cleaning data" },
    { week: 1, order: 4, title: "Google Colab Setup & Jupyter Basics", type: "docs", url: "https://colab.research.google.com/", description: "Your free GPU-powered environment for ML experiments" },
    { week: 1, order: 5, title: "Kaggle Python Course (Free)", type: "exercise", url: "https://www.kaggle.com/learn/python", description: "Kaggle's free Python course with hands-on coding exercises" },

    // Module 2 – ML Fundamentals
    { week: 2, order: 1, title: "Intro to Machine Learning (Supervised vs Unsupervised)", type: "video", url: "https://www.youtube.com/watch?v=ukzFI9rgwfU", description: "Core ML concepts: training, testing, overfitting" },
    { week: 2, order: 2, title: "scikit-learn Quickstart", type: "docs", url: "https://scikit-learn.org/stable/getting_started.html", description: "Classification, regression, clustering with sklearn" },
    { week: 2, order: 3, title: "Linear & Logistic Regression", type: "video", url: "https://www.youtube.com/watch?v=VmbA0pi2cRQ", description: "The two foundational ML algorithms explained intuitively" },
    { week: 2, order: 4, title: "Model Evaluation: Metrics That Matter", type: "article", url: "https://scikit-learn.org/stable/modules/model_evaluation.html", description: "Accuracy, precision, recall, F1, ROC-AUC — when to use each" },
    { week: 2, order: 5, title: "Kaggle Intro to Machine Learning (Free)", type: "exercise", url: "https://www.kaggle.com/learn/intro-to-machine-learning", description: "Kaggle's beginner ML course — build your first model in hours" },
    { week: 2, order: 6, title: "Decision Trees & Random Forests (StatQuest)", type: "video", url: "https://www.youtube.com/watch?v=jVh5NA9ERDA", description: "StatQuest — Decision trees explained clearly with visuals" },

    // Module 3 – Data Visualization & Feature Engineering
    { week: 3, order: 1, title: "Matplotlib & Seaborn Visualizations", type: "video", url: "https://www.youtube.com/watch?v=3Xc3CA655Y4", description: "Line plots, scatter plots, heatmaps, pair plots" },
    { week: 3, order: 2, title: "Exploratory Data Analysis (EDA)", type: "article", url: "https://www.kaggle.com/learn/pandas", description: "Kaggle free pandas + EDA course — analyze real datasets" },
    { week: 3, order: 3, title: "Feature Engineering", type: "article", url: "https://www.kaggle.com/learn/feature-engineering", description: "Kaggle feature engineering — the most impactful ML skill" },
    { week: 3, order: 4, title: "Cross-Validation & Regularization", type: "article", url: "https://scikit-learn.org/stable/modules/cross_validation.html", description: "K-fold CV, L1/L2 regularization, bias-variance tradeoff" },
    { week: 3, order: 5, title: "Data Cleaning (Kaggle)", type: "exercise", url: "https://www.kaggle.com/learn/data-cleaning", description: "Kaggle — Handle missing data, outliers, and inconsistencies" },

    // Module 4 – Deep Learning
    { week: 4, order: 1, title: "Neural Networks – Visual Intuition", type: "video", url: "https://www.youtube.com/watch?v=aircAruvnKk", description: "3Blue1Brown's legendary neural network series" },
    { week: 4, order: 2, title: "Convolutional Neural Networks (CNNs)", type: "video", url: "https://www.youtube.com/watch?v=ArPaAX_PhIs", description: "How CNNs work for image classification" },
    { week: 4, order: 3, title: "TensorFlow & Keras Tutorials", type: "docs", url: "https://www.tensorflow.org/tutorials", description: "Build and train neural networks with Keras" },
    { week: 4, order: 4, title: "PyTorch Crash Course", type: "video", url: "https://www.youtube.com/watch?v=c36lUUr864M", description: "PyTorch tensors, autograd, and training loop" },
    { week: 4, order: 5, title: "fast.ai Practical Deep Learning (Free)", type: "docs", url: "https://course.fast.ai/", description: "World-class free DL course — top-down practical approach" },
    { week: 4, order: 6, title: "Backpropagation Explained (3Blue1Brown)", type: "video", url: "https://www.youtube.com/watch?v=Ilg3gGewQ5U", description: "3Blue1Brown — Best visual explanation of backpropagation" },

    // Module 5 – NLP, Computer Vision & Transformers
    { week: 5, order: 1, title: "Intro to NLP (Tokenization, Embeddings, BERT)", type: "video", url: "https://www.youtube.com/watch?v=8rXD5-xhemo", description: "Text processing fundamentals and transformer-based NLP" },
    { week: 5, order: 2, title: "Computer Vision with OpenCV", type: "docs", url: "https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html", description: "Image processing: edges, contours, object detection" },
    { week: 5, order: 3, title: "Hugging Face Transformers (BERT, GPT, CLIP)", type: "docs", url: "https://huggingface.co/docs/transformers/quicktour", description: "Use state-of-the-art pre-trained models in 5 lines of code" },
    { week: 5, order: 4, title: "Fine-Tuning a Pre-Trained Model", type: "article", url: "https://huggingface.co/docs/transformers/training", description: "Adapt BERT/GPT-2 to your own dataset" },
    { week: 5, order: 5, title: "The Illustrated Transformer (Jay Alammar)", type: "article", url: "https://jalammar.github.io/illustrated-transformer/", description: "Best visual guide to understanding transformer architecture" },

    // Module 6 – Projects & MLOps
    { week: 6, order: 1, title: "Kaggle Competitions (Start Here)", type: "tool", url: "https://www.kaggle.com/competitions", description: "Compete on real datasets — titanic → house prices → open competitions" },
    { week: 6, order: 2, title: "Serve an ML Model with FastAPI", type: "article", url: "https://www.youtube.com/watch?v=h5wLuVDr0oc", description: "Deploy your model as a REST API" },
    { week: 6, order: 3, title: "Deploy ML Models with Hugging Face Spaces", type: "docs", url: "https://huggingface.co/docs/hub/spaces", description: "Free hosting for ML demos with Gradio or Streamlit" },
    { week: 6, order: 4, title: "ML Engineer Roadmap 2025", type: "tool", url: "https://roadmap.sh/ai-data-scientist", description: "Complete visual roadmap for AI/ML engineering careers" },
    { week: 6, order: 5, title: "Weights & Biases (Experiment Tracking)", type: "docs", url: "https://docs.wandb.ai/quickstart", description: "Track ML experiments, visualize metrics, compare models" },

    // Module 7 – Generative AI
    { week: 7, order: 1, title: "Prompt Engineering Guide", type: "docs", url: "https://www.promptingguide.ai/", description: "Chain-of-thought, few-shot, role prompting, RAG patterns" },
    { week: 7, order: 2, title: "LangChain & RAG Applications", type: "docs", url: "https://python.langchain.com/docs/get_started/quickstart", description: "Build LLM-powered apps: chatbots, document Q&A" },
    { week: 7, order: 3, title: "Gemini API (Google)", type: "docs", url: "https://ai.google.dev/gemini-api/docs/quickstart", description: "Use Google's Gemini API for multimodal AI apps" },
    { week: 7, order: 4, title: "OpenAI API & GPT Integration", type: "docs", url: "https://platform.openai.com/docs/quickstart", description: "Integrate GPT-4 into your Python or web applications" },
    { week: 7, order: 5, title: "Build a RAG Chatbot (LangChain + Chroma)", type: "exercise", url: "https://www.youtube.com/watch?v=tcqEUSNCn8I", description: "Build a document Q&A chatbot with local embeddings" },
    { week: 7, order: 6, title: "Stable Diffusion & Image Generation APIs", type: "docs", url: "https://huggingface.co/docs/diffusers/using-diffusers/write_own_pipeline", description: "Generate images with diffusion models via Hugging Face" },

    // Module 8 – Statistics & Interview Prep
    { week: 8, order: 1, title: "Statistics for ML (Probability & Distributions)", type: "video", url: "https://www.youtube.com/watch?v=zouPoc49xbk", description: "Bayesian thinking, distributions, hypothesis testing" },
    { week: 8, order: 2, title: "ML Interview Questions (100+ Q&A)", type: "article", url: "https://www.geeksforgeeks.org/machine-learning-interview-questions/", description: "Top ML interview prep — bias, variance, regularization, metrics" },
    { week: 8, order: 3, title: "System Design for ML Systems", type: "article", url: "https://www.educative.io/blog/machine-learning-system-design", description: "Design recommendation systems, fraud detection, search ranking" },
    { week: 8, order: 4, title: "Build Your AI Portfolio (GitHub + Papers)", type: "article", url: "https://www.kaggle.com/discussion/370015", description: "How to showcase ML projects to get hired" },
    { week: 8, order: 5, title: "StatQuest YouTube Channel", type: "video", url: "https://www.youtube.com/@statquest", description: "Best channel for statistics and ML intuition — subscribe now" },
  ],

  "competitive-programming": [
    // Module 1 – Getting Started & Fast I/O
    { week: 1, order: 1, title: "CP Introduction & How to Practice", type: "video", url: "https://www.youtube.com/watch?v=xAeiXy8-9Y8", description: "Mindset, how to pick problems, how to improve rating" },
    { week: 1, order: 2, title: "Codeforces Guide for Beginners", type: "docs", url: "https://codeforces.com/blog/entry/99660", description: "Setup, how contests work, your first submission" },
    { week: 1, order: 3, title: "Fast I/O in C++ for CP", type: "article", url: "https://www.geeksforgeeks.org/fast-io-for-competitive-programming/", description: "ios::sync_with_stdio, cin.tie, printf vs cout" },
    { week: 1, order: 4, title: "STL for Competitive Programming", type: "article", url: "https://cp-algorithms.com/", description: "CP-Algorithms — your main reference for all topics" },
    { week: 1, order: 5, title: "Solve First 10 Codeforces Problems", type: "exercise", url: "https://codeforces.com/problemset?tags=800", description: "Start here — solve the easiest 800-rated CF problems to get started" },

    // Module 2 – Math for CP
    { week: 2, order: 1, title: "Number Theory (GCD, LCM, Sieve, Modular Arithmetic)", type: "article", url: "https://cp-algorithms.com/algebra/fundamentals-of-arithmetics.html", description: "Fundamental math operations used in almost every CP problem" },
    { week: 2, order: 2, title: "Combinatorics for CP (nCr mod p, Lucas, Inclusion-Exclusion)", type: "article", url: "https://cp-algorithms.com/combinatorics/binomial-coefficients.html", description: "CP-Algorithms — Binomial coefficients mod p, Lucas theorem, precomputed factorials with modular inverse" },
    { week: 2, order: 3, title: "Binary Exponentiation & Modular Inverse", type: "article", url: "https://cp-algorithms.com/algebra/binary-exp.html", description: "Fast power in O(log n), Fermat's little theorem" },
    { week: 2, order: 4, title: "Math Problems on Codeforces", type: "exercise", url: "https://codeforces.com/problemset?tags=math", description: "Solve 800-1200 rated math problems" },
    { week: 2, order: 5, title: "Sieve of Eratosthenes", type: "article", url: "https://cp-algorithms.com/algebra/sieve-of-eratosthenes.html", description: "Efficient prime generation and factorization techniques" },

    // Module 3 – Greedy, Brute Force & Two Pointers
    { week: 3, order: 1, title: "Greedy Algorithms (Activity Selection, Intervals)", type: "video", url: "https://www.youtube.com/watch?v=HzeK7g8cD0Y", description: "When greedy works and how to prove it" },
    { week: 3, order: 2, title: "Two Pointers & Sliding Window in CP", type: "article", url: "https://usaco.guide/silver/two-pointers?lang=cpp", description: "USACO guide — two pointer technique with problems" },
    { week: 3, order: 3, title: "Brute Force & Complete Search", type: "article", url: "https://usaco.guide/bronze/intro-complete-search?lang=cpp", description: "USACO bronze — when to brute force" },
    { week: 3, order: 4, title: "Greedy Problems on Codeforces", type: "exercise", url: "https://codeforces.com/problemset?tags=greedy", description: "Practice 800-1400 rated greedy problems" },
    { week: 3, order: 5, title: "Prefix Sums & Difference Arrays", type: "article", url: "https://cp-algorithms.com/sequences/prefix-sums.html", description: "Constant-time range queries using prefix sums" },

    // Module 4 – Dynamic Programming for CP
    { week: 4, order: 1, title: "DP Patterns for CP (LCS, Knapsack, Bitmask)", type: "video", url: "https://www.youtube.com/watch?v=aPQY__2H3tE", description: "The 8 most important DP patterns in competitive programming" },
    { week: 4, order: 2, title: "Binary Search on the Answer", type: "article", url: "https://usaco.guide/silver/binary-search?lang=cpp", description: "The most powerful and underrated CP technique — USACO guide" },
    { week: 4, order: 3, title: "CSES DP Problem Set", type: "exercise", url: "https://cses.fi/problemset/list/", description: "The best structured problem set — do the DP section first" },
    { week: 4, order: 4, title: "AtCoder DP Educational Contest (26 problems)", type: "exercise", url: "https://atcoder.jp/contests/dp", description: "Classic DP problems from AtCoder — essential practice" },
    { week: 4, order: 5, title: "Digit DP & Bitmask DP", type: "article", url: "https://cp-algorithms.com/dynamic_programming/digit-dp.html", description: "Advanced DP patterns used in harder competitive problems" },

    // Module 5 – Graphs & Advanced Data Structures
    { week: 5, order: 1, title: "MST: Kruskal & Prim", type: "article", url: "https://cp-algorithms.com/graph/mst_kruskal.html", description: "Minimum spanning tree algorithms with Union-Find" },
    { week: 5, order: 2, title: "Segment Trees (Range Queries & Updates)", type: "article", url: "https://cp-algorithms.com/data_structures/segment_tree.html", description: "Build, query, and update segment trees — essential for CP" },
    { week: 5, order: 3, title: "Fenwick Tree (BIT) for Prefix Sums", type: "article", url: "https://cp-algorithms.com/data_structures/fenwick.html", description: "Binary Indexed Tree — simpler than segment tree for sums" },
    { week: 5, order: 4, title: "Strongly Connected Components (Kosaraju/Tarjan)", type: "article", url: "https://cp-algorithms.com/graph/scc.html", description: "Find SCCs in directed graphs" },
    { week: 5, order: 5, title: "Advanced Graph Problems", type: "exercise", url: "https://codeforces.com/problemset?tags=graphs", description: "1400-1800 rated graph problems on Codeforces" },
    { week: 5, order: 6, title: "Sparse Table & LCA", type: "article", url: "https://cp-algorithms.com/graph/lca.html", description: "O(1) range minimum queries and LCA with binary lifting" },

    // Module 6 – String Algorithms & Contest Strategy
    { week: 6, order: 1, title: "KMP & Z-Algorithm for String Matching", type: "article", url: "https://cp-algorithms.com/string/z-function.html", description: "Z-function and KMP — the two must-know string algorithms" },
    { week: 6, order: 2, title: "Hashing for Strings (Polynomial Hashing)", type: "article", url: "https://cp-algorithms.com/string/string-hashing.html", description: "Rolling hash for O(1) substring comparisons" },
    { week: 6, order: 3, title: "Contest Strategy: How to Read & Solve Problems", type: "article", url: "https://codeforces.com/blog/entry/62730", description: "Avoid misreading, time allocation, upsolving strategy" },
    { week: 6, order: 4, title: "A2OJ Ladders (Rating-Based Problem Lists)", type: "tool", url: "https://earthshakira.github.io/a2oj-clientside/server/Ladders.html", description: "Practice at your exact Codeforces rating level" },
    { week: 6, order: 5, title: "CP Algorithms Reference (Complete)", type: "docs", url: "https://cp-algorithms.com/", description: "Bookmark this — comprehensive algorithm reference for all topics" },
    { week: 6, order: 6, title: "Suffix Arrays & Suffix Trees", type: "article", url: "https://cp-algorithms.com/string/suffix-array.html", description: "Advanced string data structures for substring queries" },
  ],
};
