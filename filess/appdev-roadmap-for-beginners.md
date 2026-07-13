# App Development Roadmap for Beginners

A module-by-module plan for mobile app development. App dev forks early depending on which stack you pick, so this roadmap covers **two tracks** — pick one based on your situation (you can always learn the other later):

- **Track A: React Native (cross-platform)** — best if you already know or are learning JS/React from a web dev path; one codebase for both iOS and Android
- **Track B: Native Android (Java/Kotlin)** — best if you want to go deep on one platform first, or specifically want Android-only apps with full access to platform features

*(Assumption: since no specific stack was named, this roadmap defaults to structuring around Track A first since it pairs naturally with JS/React knowledge, with Track B modules given in parallel for anyone who prefers going native. If you want Flutter instead, see the note at the bottom.)*

**📖 Prefer reading over watching videos?**
- [React Native official docs](https://reactnative.dev/docs/getting-started) — Track A
- [Android Developers official docs](https://developer.android.com/courses) — Track B, has a structured "fundamentals" and "advanced" course
- [CodeWithHarry's tutorials](https://www.codewithharry.com/tutorials) — text versions of several of his video series

---

## Module 1 — Mobile Dev Fundamentals & Environment Setup
- Learn: how mobile apps differ from web apps (lifecycle, native APIs, app store distribution), setting up your dev environment
- **Track A**: install Node.js, Expo CLI (easiest way to start with React Native), Android Studio/Xcode for emulators
- **Track B**: install Android Studio, set up an emulator, get familiar with the IDE
- 📺 **Study videos — Track A**: [Chai aur React Native playlist](https://www.youtube.com/playlist?list=PLu71SKxNbfoAKL_sTfg5CgCxlrpH5b2jS) — project-based, starts from setup
- 📺 **Study videos — Track B**: [CodeWithHarry's Android Development playlist](https://www.youtube.com/playlist?list=PLu0W_9lII9aiL0kysYlfSOUgY5rNlOhUd)
- Practice: get a "Hello World" app running on an emulator (or your own phone) in your chosen stack

**✅ Move on when:** you can run and see changes reflected live on an emulator/device without setup issues.

## Module 2 — Language Refresher
- **Track A**: if your JS/React is already solid (see the Web Dev roadmap, Modules 3, 6-7), you can skip most of this and go straight to Module 3; otherwise brush up on JS fundamentals and React hooks first
- **Track B**: Java fundamentals (CodeWithHarry's Android playlist has a "Java Refresher" chapter built in specifically for this) or Kotlin basics if you're going the Kotlin route
- 📺 **Study videos — Track B**: the Java Refresher chapter within [CodeWithHarry's Android playlist](https://www.youtube.com/playlist?list=PLu0W_9lII9aiL0kysYlfSOUgY5rNlOhUd)
- Practice: small logic exercises in your chosen language until syntax feels automatic

**✅ Move on when:** you're not stopping to look up basic syntax while writing simple programs.

## Module 3 — Core UI Components & Navigation
- **Track A**: core components (`View`, `Text`, `ScrollView`, `FlatList`), styling with StyleSheet, React Navigation for multi-screen apps
- **Track B**: Activities, layouts (XML), multi-screen apps, Intents for navigation between activities
- 📺 **Study videos — Track A**: [Chai aur React Native playlist](https://www.youtube.com/playlist?list=PLu71SKxNbfoAKL_sTfg5CgCxlrpH5b2jS)
- 📺 **Study videos — Track B**: [CodeWithHarry's Android playlist](https://www.youtube.com/playlist?list=PLu0W_9lII9aiL0kysYlfSOUgY5rNlOhUd) — Activities/Layouts and Multi-Screen Apps chapters
- Practice: build a multi-screen app (e.g., a simple notes app with a list screen and a detail screen)

**✅ Move on when:** you can navigate between multiple screens and pass data between them without referencing the docs.

## Module 4 — Lists, State Management & Local Storage
- Learn: rendering dynamic lists efficiently, managing state across screens, storing data locally on-device
- **Track A**: `FlatList`/`SectionList`, Context API or Zustand for state, AsyncStorage for local persistence
- **Track B**: RecyclerView/ListView, ViewModel + LiveData (or basic state handling), SQLite/Room for local databases
- 📺 **Study videos — Track A**: [Chai aur React Native playlist](https://www.youtube.com/playlist?list=PLu71SKxNbfoAKL_sTfg5CgCxlrpH5b2jS)
- 📺 **Study videos — Track B**: [CodeWithHarry's Android playlist](https://www.youtube.com/playlist?list=PLu0W_9lII9aiL0kysYlfSOUgY5rNlOhUd) — ListView/RecyclerView and Working with Databases chapters
- Practice: build an app that persists data locally (e.g., a to-do list that survives app restarts)

**✅ Move on when:** your app's data survives a restart, and list rendering feels smooth even with more items.

## Module 5 — Working with APIs
- Learn: making network requests, handling loading/error states, displaying remote data
- **Track A**: `fetch`/axios, async/await patterns (should feel familiar if you've done the web dev roadmap)
- **Track B**: Retrofit or Volley for networking, parsing JSON responses
- 📺 **Study videos**: continue the same playlists above — both cover API integration as part of their project-based structure
- Practice: build an app that consumes a public API (weather app, movie search app, etc.)

**✅ Move on when:** you can wire up any new public API to your app confidently, including handling loading and error states gracefully.

## Module 6 — Native Device Features
- Learn: accessing camera, location, push notifications, permissions handling
- **Track A**: Expo's built-in APIs (`expo-camera`, `expo-location`, `expo-notifications`) make this much easier to start with
- **Track B**: Android's native permission system, CameraX, LocationManager, Firebase Cloud Messaging for notifications
- 📺 **Study videos**: check for specific modules on camera/location/media within your chosen playlist above (CodeWithHarry's Android playlist has a "Working with Media" chapter); for React Native, the [Expo documentation](https://docs.expo.dev/) is genuinely excellent and often better than searching for scattered videos on this topic
- Practice: add one native feature (camera or location) to a project from a previous module

**✅ Move on when:** you can request permissions and use at least one native device feature without your app crashing on edge cases (permission denied, etc.)

## Module 7 — Polish: UI/UX & Styling
- Learn: platform-specific design guidelines (Material Design for Android, Human Interface Guidelines for iOS), animations, responsive layouts for different screen sizes
- 📺 **Study videos**: revisit the styling sections of your chosen playlist, and look at [Material Design guidelines](https://m3.material.io/) directly for design principles
- Practice: take an earlier project and give it a full visual polish pass — spacing, consistent colors, basic animations

**✅ Move on when:** your app looks intentional rather than like a rough prototype.

## Module 8 — Publishing to the Play Store / App Store
- Learn: app signing, building a release APK/AAB (or IPA for iOS), Play Store/App Store submission process, basic app monetization concepts
- 📺 **Study videos**: [CodeWithHarry's Android playlist](https://www.youtube.com/playlist?list=PLu0W_9lII9aiL0kysYlfSOUgY5rNlOhUd) has a dedicated "Publishing to Play Store" and "Making Money from Apps" chapter near the end — genuinely useful even if you're on Track A, since the store submission concepts overlap
- Practice: package and (if you want) actually publish one of your capstone-quality apps

**✅ Move on when:** you understand the full path from a finished app to a live store listing, even if you don't publish immediately.

## Module 9 — Capstone Project
- Bring it all together: pick a real app idea (a habit tracker, a marketplace app, a social app) and build it end-to-end — UI, navigation, API/backend integration, local storage, and at least one native feature
- This is also a natural point to pair with the Web Dev roadmap's backend modules (Node/Express/MongoDB) if you want to build your own API for the app rather than relying only on public APIs

---

## A note on Flutter
Neither Chai aur Code nor Code with Harry has a definitive free Flutter playlist, so if you'd rather go cross-platform with Flutter/Dart instead of React Native, the best free options are the [official Flutter YouTube channel](https://docs.flutter.dev/resources/videos) and freeCodeCamp's full Flutter course. The module structure above still applies — just swap in Flutter-specific resources for the "Track A" video links.

## General Tips
- **Don't try to learn both tracks at once** — pick one, get to a working capstone, then explore the other if you're curious.
- Use a real device to test occasionally, not just an emulator — things like camera, GPS, and performance feel very different on real hardware.
- Publish something, even something small — a live app in a store (or at least an installable build) is a strong portfolio piece.
