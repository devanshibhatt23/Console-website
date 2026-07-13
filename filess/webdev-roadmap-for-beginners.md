# Web Development Roadmap for Beginners
### (using Chai aur Code + Code with Harry)

A module-by-module plan for full-stack web development, built around **Chai aur Code (Hitesh Choudhary)** and **Code with Harry** — two of the most widely followed free resources for web dev. Move to the next module only once you hit the checkpoint at the end of each one.

**📖 Prefer reading over watching videos?**
- [Chai aur Docs](https://docs.chaicode.com/) — written companion docs for several Chai aur Code video series (e.g. Git)
- [CodeWithHarry Notes/Tutorials](https://www.codewithharry.com/tutorials) — text tutorials that closely mirror his videos, topic by topic
- [MDN Web Docs](https://developer.mozilla.org/) — the standard reference for HTML/CSS/JS, good for looking things up as you go

**General tools:** a code editor (VS Code), a GitHub account, [Postman](https://www.postman.com/) for testing APIs later on. Pick JavaScript as your core language — it's what both creators teach and it covers frontend and backend.

---

## Module 1 — How the Web Works + HTML
- Learn: client-server model, what happens when you visit a URL, HTML structure, tags, forms, semantic HTML
- 📺 **Study videos**: [CodeWithHarry's HTML playlist](https://www.youtube.com/playlist?list=PLV4pXOVqAJqhMfM_WbL2ofB57-luFSCI1), or start directly from [CodeWithHarry's Sigma Web Development Course](https://www.youtube.com/playlist?list=PLu0W_9lII9agq5TrH9XLIKQvv0iaF2X3w) (Tutorial #1 onward covers HTML in depth) — the Sigma course is his newer, most comprehensive playlist and works well as a single spine for Modules 1-3
- 📖 **Or read**: [MDN HTML basics](https://developer.mozilla.org/en-US/docs/Web/HTML)
- Practice: build 2-3 static pages (resume page, simple landing page) using just HTML

**✅ Move on when:** you can structure a full webpage (header, nav, sections, footer, forms) from a blank file without a reference.

## Module 2 — CSS + Responsive Design
- Learn: box model, flexbox, grid, media queries, basic responsive design principles
- 📺 **Study videos**: continue the [Sigma Web Development Course playlist](https://www.youtube.com/playlist?list=PLu0W_9lII9agq5TrH9XLIKQvv0iaF2X3w) — the CSS section follows directly after HTML
- 📖 **Or read**: [MDN CSS basics](https://developer.mozilla.org/en-US/docs/Web/CSS), [CodeWithHarry's CSS tutorial](https://www.codewithharry.com/tutorial/css-home)
- Practice: rebuild your Module 1 pages to be fully responsive; try recreating a simple real website's layout

**✅ Move on when:** you can build a responsive layout with flexbox/grid without constantly looking up properties.

## Module 3 — JavaScript Fundamentals
- Learn: variables, data types, functions, loops, conditionals, arrays, objects, scope
- 📺 **Study videos**: [Chai aur Javascript playlist](https://www.youtube.com/playlist?list=PLu71SKxNbfoBuX3f4EOACle2y-tRC5Q37) — Hitesh's dedicated JS series, goes deep into fundamentals; the Sigma course's JS section also works if you want to stay in one playlist
- 📖 **Or read**: [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- Practice: small logic problems, build a calculator or a to-do list using vanilla JS

**✅ Move on when:** you can write functions, loop through arrays/objects, and reason about scope without confusion.

## Module 4 — DOM Manipulation + Git/GitHub
- Learn: selecting/manipulating DOM elements, event listeners, Git basics (init, add, commit, push, branches, merge), GitHub workflow
- 📺 **Study videos**: [Sigma Web Development Course](https://www.youtube.com/playlist?list=PLu0W_9lII9agq5TrH9XLIKQvv0iaF2X3w) covers DOM manipulation in depth (around the JavaScript-DOM section); for Git, look up the **"Chai aur Git"** series on the [Chai aur Code channel](https://www.youtube.com/@chaiaurcode)
- 📖 **Or read**: [Chai aur Docs — Git and GitHub](https://docs.chaicode.com/youtube/chai-aur-git/welcome/) (written companion to the Chai aur Git video series)
- Practice: build an interactive project (quiz app, image gallery, or a simple game) using DOM manipulation; push it to GitHub

**✅ Move on when:** you're comfortable manipulating the DOM in response to events, and you can commit/push/branch on Git without hesitation.

## Module 5 — Advanced JavaScript (ES6+, Async, APIs)
- Learn: arrow functions, destructuring, spread/rest, promises, async/await, `fetch`, working with third-party APIs
- 📺 **Study videos**: [Chai aur Javascript playlist](https://www.youtube.com/playlist?list=PLu71SKxNbfoBuX3f4EOACle2y-tRC5Q37) covers this in its later videos
- 📖 **Or read**: [MDN — Asynchronous JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous)
- Practice: build a weather app or a GitHub-profile-lookup app that fetches data from a public API

**✅ Move on when:** async/await and promise chains feel natural, and you can consume a public API confidently.

## Module 6 — React Basics
- Learn: components, JSX, props, state, hooks (`useState`, `useEffect`), conditional rendering, lists and keys
- 📺 **Study videos**: [Chai aur React playlist](https://www.youtube.com/playlist?list=PLu71SKxNbfoDqgPchmvIsL4hTnJIrtige) or [CodeWithHarry's Complete React Course](https://www.youtube.com/playlist?list=PLCZo59YnSsMaFGT2DHuxqUiyx_PFN3IOB) — either works well, pick based on whose teaching style you preferred in earlier modules
- 📖 **Or read**: [React official docs — Learn React](https://react.dev/learn)
- Practice: rebuild one of your earlier vanilla-JS projects in React

**✅ Move on when:** you can build a multi-component app with props/state flowing correctly between components.

## Module 7 — React Advanced (Router, Context, State Management)
- Learn: React Router for multi-page apps, Context API, Redux Toolkit basics, custom hooks
- 📺 **Study videos**: [Chai aur React playlist](https://www.youtube.com/playlist?list=PLu71SKxNbfoDqgPchmvIsL4hTnJIrtige) — this series includes a dedicated Redux Toolkit crash course and covers routing and context in depth
- 📖 **Or read**: [React Router docs](https://reactrouter.com/), [Redux Toolkit docs](https://redux-toolkit.js.org/)
- Practice: build a multi-page app with routing and global state (e.g., a shopping cart or notes app)

**✅ Move on when:** you can decide when to use local state vs. Context vs. Redux for a given app, and implement whichever you choose.

## Module 8 — Backend Basics: Node.js + Express
- Learn: Node.js fundamentals, building a REST API with Express, routing, middleware, request/response handling
- 📺 **Study videos**: [Chai aur Javascript Backend playlist](https://www.youtube.com/playlist?list=PLu71SKxNbfoBGh_8p_NS-ZAh6v7HhYqHW), or [CodeWithHarry's Node.js playlist](https://www.youtube.com/playlist?list=PLobAq7hWqZWGTfhj4jNQAVzJd_y6iTErQ); the Sigma course's Express section (starting around Tutorial #88) also covers this
- 📖 **Or read**: [Express.js official guide](https://expressjs.com/en/guide/routing.html)
- Practice: build a simple REST API (e.g., a notes API with CRUD routes)

**✅ Move on when:** you can build a working REST API with multiple routes and middleware without referencing a tutorial.

## Module 9 — Databases: MongoDB (+ SQL basics)
- Learn: MongoDB basics, Mongoose schemas/models, connecting a database to your Express API; also get a basic grounding in SQL (tables, joins, basic queries) since it comes up often in real jobs
- 📺 **Study videos**: [Chai aur Javascript Backend playlist](https://www.youtube.com/playlist?list=PLu71SKxNbfoBGh_8p_NS-ZAh6v7HhYqHW) covers MongoDB + Mongoose integration directly
- 📖 **Or read**: [MongoDB official docs](https://www.mongodb.com/docs/), [Mongoose docs](https://mongoosejs.com/docs/guide.html)
- Practice: connect your Module 8 API to a real MongoDB database (Atlas free tier works fine)

**✅ Move on when:** your API can perform full CRUD operations against a real database.

## Module 10 — Auth & Full Backend Projects
- Learn: authentication (JWT, cookies, sessions), password hashing, file uploads, building a production-style backend
- 📺 **Study videos**: [Hitesh's "chai-backend" project series](https://github.com/hiteshchoudhary/chai-backend) — a complete backend project (a YouTube-like video hosting backend) built end-to-end on the Chai aur Code channel; this is the single best resource for this module
- 📖 **Or read**: the chai-backend GitHub repo's README and code alongside the videos
- Practice: build your own backend project with login/signup, protected routes, and file uploads

**✅ Move on when:** you can implement authentication and protected routes in a backend project from scratch.

## Module 11 — Deployment & Basic DevOps
- Learn: environment variables, deploying frontend (Vercel/Netlify) and backend (Render/Railway), Docker basics, CI/CD concepts at a high level
- 📺 **Study videos**: neither creator has one single definitive playlist for this — check the **Chai aur Code channel** for any DevOps-focused series (Hitesh has run cohorts touching Docker/deployment); for the fundamentals, [Docker's official "Getting Started" docs](https://docs.docker.com/get-started/) work well
- 📖 **Or read**: [Vercel deployment docs](https://vercel.com/docs), [Render docs](https://render.com/docs)
- Practice: deploy a full-stack project end-to-end (frontend + backend + database) so it's live on a public URL

**✅ Move on when:** you've deployed at least one full-stack project and it's accessible via a public link.

## Module 12 — Full Stack Capstone Project
- Bring everything together: pick a real project idea (e-commerce site, social media clone, blog platform) and build it end-to-end — frontend, backend, database, auth, deployment
- 📺 **Reference**: the Sigma Web Development Course includes full project builds later in the playlist (e.g., a Next.js-based Patreon-style clone), useful as a template for structuring your own capstone
- Practice: this module *is* the practice — build, deploy, and document one complete project for your portfolio

---

## General Tips
- **Don't jump between the two creators mid-topic** — pick whichever explains a concept better for you and stick with them through that module; switching too often can leave gaps.
- **Build projects, don't just watch** — web dev is one of the areas where tutorial-following without building your own variations leads to "tutorial hell." After each module, try a project without the video open.
- Keep a GitHub profile from Module 4 onward and push every project — it becomes your portfolio.
- **On videos vs reading**: MDN is genuinely excellent and often better than video for looking up specific syntax once you understand the concept — use videos for learning a topic the first time, MDN for reference afterward.
