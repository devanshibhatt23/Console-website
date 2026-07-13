# C++ Language Roadmap for Beginners
### (using The Cherno alongside CodeWithHarry)

A module-by-module plan to actually learn C++ as a language — not just enough syntax to pass a course, but a real working understanding of how it works under the hood. This combines two very different but complementary creators:

- **The Cherno (Yan Chernikov)** — a renowned C++ YouTuber and game engine developer; his C++ series is widely considered one of the best deep, "how it actually works" explanations of the language freely available anywhere
- **CodeWithHarry** — great for an absolute-beginner-friendly first pass in Hindi before diving into Cherno's more advanced explanations

Using both works well in sequence: CodeWithHarry to get comfortable with syntax fast, then The Cherno to actually understand *why* C++ works the way it does.

**📖 Prefer reading over watching videos?**
- [learncpp.com](https://www.learncpp.com/) — genuinely one of the best free, structured text resources for C++ anywhere, comprehensive from basics through advanced topics
- [cppreference.com](https://en.cppreference.com/) — the definitive reference for syntax and standard library details once you know roughly what you're looking for
- [GeeksforGeeks C++ tutorial](https://www.geeksforgeeks.org/cpp/c-plus-plus/) — good for quick topic-specific explanations and practice problems

**General tools**: a compiler (g++ or clang), an IDE or editor (VS Code, CLion, or Visual Studio), and CMake once you get to multi-file projects.

---

## Module 1 — Setup, Syntax & Basics
- Learn: variables, data types, operators, input/output (`cin`/`cout`), how compilation actually works (preprocessor → compiler → linker)
- 📺 **Study videos**: [The Cherno's C++ series](https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb) — the first several videos cover setup, how C++ works under the hood, and variables/types in real depth; alternatively, [CodeWithHarry's C++ playlist](https://youtube.com/playlist?list=PLu0W_9lII9agpFUAlPFe_VNSlXW5uE0YL) is a gentler, faster-paced first pass if you're completely new to programming
- 📖 **Or read**: [learncpp.com Chapter 1](https://www.learncpp.com/)
- Practice: get a "Hello World" compiling from the command line (not just an IDE run button) so you understand what's actually happening

**✅ Move on when:** you can explain what happens between writing `.cpp` code and getting a running program, and you're comfortable with basic variables/types/I-O.

## Module 2 — Control Flow & Functions
- Learn: if/else, loops, switch statements, functions, function overloading, pass-by-value vs pass-by-reference
- 📺 **Study videos**: continue [The Cherno's C++ series](https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb) — early videos cover functions and control flow with a focus on what's happening at the assembly/memory level, which most beginner courses skip
- 📖 **Or read**: [learncpp.com — Functions chapter](https://www.learncpp.com/)
- Practice: write small programs using functions with both value and reference parameters, and notice the difference in behavior

**✅ Move on when:** you understand the practical difference between passing by value and by reference, not just the syntax for each.

## Module 3 — Arrays, Strings, Pointers & References
- Learn: arrays, C-style strings vs `std::string`, pointers, references, pointer arithmetic, the stack vs the heap
- 📺 **Study videos**: [The Cherno's C++ series](https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb) has dedicated videos specifically titled "Pointers in C++" and "References in C++" that are widely considered some of the clearest explanations of this topic anywhere on YouTube
- 📖 **Or read**: [learncpp.com — Pointers and References chapters](https://www.learncpp.com/)
- Practice: write a program that manually manages a dynamically-sized array using raw pointers, so you feel the pain points before learning the STL's solutions

**✅ Move on when:** pointers and references stop feeling like magic — you can explain what a pointer actually holds in memory and why references exist.

## Module 4 — Object-Oriented Programming in C++
- Learn: classes, constructors/destructors, encapsulation, inheritance, polymorphism, virtual functions, abstract classes
- 📺 **Study videos**: [The Cherno's C++ series](https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb) covers classes and OOP concepts in depth, including how virtual functions actually work under the hood (vtables); [CodeWithHarry's C++ playlist](https://youtube.com/playlist?list=PLu0W_9lII9agpFUAlPFe_VNSlXW5uE0YL) also has a dedicated OOP section that's a gentler first introduction if Cherno's depth feels like too much at first
- 📖 **Or read**: [learncpp.com — Object-oriented programming chapters](https://www.learncpp.com/)
- Practice: design a small class hierarchy (e.g., Shape → Circle/Rectangle/Triangle) using inheritance and virtual functions

**✅ Move on when:** you can explain why virtual functions are needed and what problem they solve, not just how to write the `virtual` keyword.

## Module 5 — Memory Management
- Learn: dynamic memory (`new`/`delete`), memory leaks, RAII (Resource Acquisition Is Initialization), smart pointers (`unique_ptr`, `shared_ptr`, `weak_ptr`)
- 📺 **Study videos**: [The Cherno's C++ series](https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb) — this is genuinely one of the strongest parts of the whole series; the videos on smart pointers and RAII are excellent and go deeper than most courses ever do
- 📖 **Or read**: [learncpp.com — Dynamic memory allocation and smart pointer chapters](https://www.learncpp.com/)
- Practice: take a program you wrote with raw pointers earlier and refactor it to use smart pointers instead

**✅ Move on when:** you default to smart pointers over raw `new`/`delete` without having to think about it, and you understand what RAII is protecting you from.

## Module 6 — The Standard Template Library (STL)
- Learn: containers (`vector`, `map`, `set`, `unordered_map`), iterators, common algorithms (`sort`, `find`, `accumulate`), when to use which container
- 📺 **Study videos**: [The Cherno's C++ series](https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb) has a strong STL sub-series covering containers and iterators with real performance discussion (not just syntax)
- 📖 **Or read**: [cppreference.com Containers library](https://en.cppreference.com/w/cpp/container.html), [learncpp.com STL chapters](https://www.learncpp.com/)
- Practice: rewrite an earlier "manual" data structure exercise (like your Module 3 dynamic array) using the appropriate STL container instead

**✅ Move on when:** given a new problem, you can pick the right STL container without defaulting to `vector` out of habit.

## Module 7 — Templates & Generic Programming
- Learn: function templates, class templates, template specialization, why templates exist and how they differ from generics in other languages
- 📺 **Study videos**: [The Cherno's C++ series](https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb) has a well-regarded templates video that explains them from first principles rather than just showing syntax
- 📖 **Or read**: [learncpp.com — Templates chapter](https://www.learncpp.com/)
- Practice: write a generic container or utility function (e.g., a generic `Stack<T>`) using templates

**✅ Move on when:** you can write a basic templated class or function without copying a pattern from memory.

## Module 8 — Modern C++ (C++11 through C++20)
- Learn: `auto`, lambdas, move semantics and rvalue references, `constexpr`, structured bindings, range-based for loops
- 📺 **Study videos**: [The Cherno's C++ series](https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb) has dedicated videos on lambdas and move semantics that are widely recommended as some of the best explanations of these topics online
- 📖 **Or read**: [learncpp.com — Move semantics and lambda chapters](https://www.learncpp.com/), [cppreference.com](https://en.cppreference.com/) for the precise feature-by-feature reference
- Practice: refactor an earlier project to use modern idioms — replace manual loops with range-based for loops and STL algorithms, use lambdas where appropriate

**✅ Move on when:** your code starts looking like "modern C++" by default rather than "C with classes."

## Module 9 — Multithreading & Performance (optional, more advanced)
- Learn: `std::thread`, mutexes, race conditions, basic profiling and optimization thinking
- 📺 **Study videos**: [The Cherno's C++ series](https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb) has a multithreading sub-series, and The Cherno also has separate videos specifically on benchmarking/optimization that are useful once you're past the fundamentals
- 📖 **Or read**: [cppreference.com — Thread support library](https://en.cppreference.com/w/cpp/thread.html)
- Practice: parallelize a simple CPU-bound task (like processing a large array) using `std::thread` and observe the speedup

**✅ Move on when:** you understand what a race condition is and how a mutex prevents one — this module is optional depth, not a hard gate for general C++ proficiency.

## Module 10 — Capstone Project
- Bring it together: build something non-trivial that forces you to use OOP, STL, memory management, and modern C++ idioms together — a small game, a command-line tool, or a mini data-processing application
- This is also a natural point to pivot into either **competitive programming** (if you want algorithmic depth) or **game development** (The Cherno's own channel shifts into building his Hazel game engine after the core C++ series, which is a great next step if that interests you)

---

## General Tips
- **Don't skip the "why" for the sake of syntax** — C++ punishes people who memorize syntax without understanding memory; The Cherno's whole series is built around this philosophy, so lean into it rather than rushing past it.
- Compile with warnings enabled (`-Wall -Wextra`) from day one — C++ will happily let you shoot yourself in the foot silently otherwise.
- **On videos vs reading**: learncpp.com is unusually good as a standalone resource — if you're someone who reads faster than you watch, you could realistically go through this entire roadmap using just learncpp.com and still come out with a strong foundation.
