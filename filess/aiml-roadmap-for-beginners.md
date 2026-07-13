# AI / ML Roadmap for Beginners
### (using CampusX alongside Andrew Ng's courses)

A module-by-module plan for machine learning, combining **CampusX's structured Hindi-language playlists** (great for hands-on, code-first learning) with **Andrew Ng's Machine Learning Specialization** (the gold-standard for building deep intuition on the math and theory). Using both together tends to work very well — Andrew Ng for "why it works," CampusX for "how to actually build it in Python."

**📖 Prefer reading over watching videos?**
- [Andrew Ng's course readings on Coursera](https://www.coursera.org/specializations/machine-learning-introduction) — the specialization includes reading material alongside videos
- *Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow* by Aurélien Géron — excellent text resource that pairs well with this whole roadmap
- [scikit-learn documentation](https://scikit-learn.org/stable/) and [official Python docs](https://docs.python.org/3/) — for reference once you know what you're looking for
- [CampusX's GitHub-linked notebooks](https://github.com/campusx-official) (search per playlist) — many of their videos have accompanying Jupyter notebooks you can read through

**General tools**: Python, Jupyter Notebook/Google Colab, NumPy, Pandas, Matplotlib/Seaborn, scikit-learn.

---

## Module 1 — Python for Data Science
- Learn: Python fundamentals, NumPy, Pandas, data manipulation, basic plotting with Matplotlib
- 📺 **Study videos**: [CampusX's 100 Days of Python playlist](https://youtube.com/playlist?list=PLKnIA16_Rmvb1RYR-iTA_hzckhdONtSW4)
- 📖 **Or read**: [Official Python tutorial](https://docs.python.org/3/tutorial/), [Pandas documentation](https://pandas.pydata.org/docs/)
- Practice: load a real dataset (Titanic, housing prices) and do basic exploration with Pandas

**✅ Move on when:** you can load, clean, filter, and plot a dataset in Pandas without constantly searching syntax.

## Module 2 — Math & ML Intuition Foundations
- Learn: what machine learning actually is, supervised vs. unsupervised learning, the intuition behind linear regression and cost functions, gradient descent — at a conceptual level before the code
- 📺 **Study videos**: [Andrew Ng's Machine Learning Specialization — Course 1: Supervised Machine Learning: Regression and Classification](https://www.coursera.org/specializations/machine-learning-introduction) (first few weeks) — this is intentionally visual and intuition-first before introducing code
- 📖 **Or read**: the course's linked readings on Coursera, or *Hands-On ML* Chapter 1-2 for a code-first alternative view of the same concepts
- Practice: none required yet beyond following along with Andrew Ng's own exercises — this module is about intuition

**✅ Move on when:** you can explain in plain language what a cost function and gradient descent are doing, without referencing a formula sheet.

## Module 3 — Data Handling, EDA & Feature Engineering
- Learn: handling missing data, outlier detection, univariate/bivariate/multivariate EDA, feature scaling (standardization, normalization), encoding categorical data, feature transformation, ML pipelines
- 📺 **Study videos**: [CampusX's 100 Days of Machine Learning playlist](https://youtube.com/playlist?list=PLKnIA16_Rmvbr7zKYQuBfsVkjoLcJgxHH) — specifically the early-to-mid days (roughly Day 12 through Day 37) cover exactly this: data loading, EDA, feature scaling, encoding, pipelines, and transformers in detail
- 📖 **Or read**: *Hands-On ML* Chapter 2 (End-to-End ML Project) walks through this same process in text form
- Practice: take a messy real-world dataset and fully clean/prepare it for modeling — this is a skill that matters as much as the modeling itself

**✅ Move on when:** given a new raw dataset, you can independently decide what cleaning/encoding/scaling it needs before modeling.

## Module 4 — Supervised Learning: Regression & Classification
- Learn: linear regression, logistic regression, regularization, evaluation metrics (accuracy, precision, recall, F1, RMSE)
- 📺 **Study videos**: [Andrew Ng's Course 1: Supervised Machine Learning: Regression and Classification](https://www.coursera.org/learn/machine-learning) — covers the theory in depth; pair it with [CampusX's 100 Days of ML playlist](https://youtube.com/playlist?list=PLKnIA16_Rmvbr7zKYQuBfsVkjoLcJgxHH) for the scikit-learn implementation side
- 📖 **Or read**: *Hands-On ML* Chapters 3-4
- Practice: build and evaluate a regression model and a classification model on separate real datasets end-to-end

**✅ Move on when:** you can build, train, and evaluate a regression or classification model from scratch in scikit-learn, and correctly interpret the evaluation metrics.

## Module 5 — Neural Networks & Decision Trees
- Learn: basic neural network architecture and forward propagation, training a neural net with TensorFlow, decision trees, random forests, boosted trees (like XGBoost)
- 📺 **Study videos**: [Andrew Ng's Course 2: Advanced Learning Algorithms](https://www.coursera.org/specializations/machine-learning-introduction) — covers neural networks and tree-based methods in depth; supplement with the corresponding tree/ensemble-method days on [CampusX's ML playlist](https://youtube.com/playlist?list=PLKnIA16_Rmvbr7zKYQuBfsVkjoLcJgxHH)
- 📖 **Or read**: *Hands-On ML* Chapters 6-7 (Decision Trees, Ensemble Learning)
- Practice: build a random forest or XGBoost model and compare its performance to your Module 4 logistic regression

**✅ Move on when:** you can choose between a linear model, a tree-based model, or a small neural net for a given problem and justify the choice.

## Module 6 — Unsupervised Learning & Recommender Systems
- Learn: clustering (K-Means), dimensionality reduction (PCA), anomaly detection, collaborative filtering, content-based recommenders
- 📺 **Study videos**: [Andrew Ng's Course 3: Unsupervised Learning, Recommenders, Reinforcement Learning](https://www.coursera.org/specializations/machine-learning-introduction); [CampusX's ML playlist](https://youtube.com/playlist?list=PLKnIA16_Rmvbr7zKYQuBfsVkjoLcJgxHH) also has clustering/dimensionality-reduction days
- 📖 **Or read**: *Hands-On ML* Chapters 8-9
- Practice: cluster a dataset with no labels and interpret the resulting groups; build a simple recommender on a movies/products dataset

**✅ Move on when:** you can identify whether a real problem calls for supervised, unsupervised, or a recommender-system approach, and implement a basic version of each.

## Module 7 — Model Evaluation, Pipelines & Deployment Basics
- Learn: cross-validation, hyperparameter tuning (GridSearch/RandomSearch), building end-to-end ML pipelines, serving a model via an API
- 📺 **Study videos**: [CampusX's 100 Days of ML playlist](https://youtube.com/playlist?list=PLKnIA16_Rmvbr7zKYQuBfsVkjoLcJgxHH) — the pipelines section (around Day 29) plus the [FastAPI for Machine Learning bonus playlist](https://youtube.com/playlist?list=PLKnIA16_RmvZ41tjbKB2ZnwchfniNsMuQ) for deployment
- 📖 **Or read**: [scikit-learn Pipeline docs](https://scikit-learn.org/stable/modules/compose.html), [FastAPI docs](https://fastapi.tiangolo.com/)
- Practice: wrap one of your earlier models in a FastAPI endpoint so it can be called like a real service

**✅ Move on when:** you can take a trained model and expose it as a working API endpoint without help.

## Module 8 — Deep Learning Foundations
- Learn: artificial neural networks (ANNs) in depth, convolutional neural networks (CNNs) for images, recurrent neural networks (RNNs) for sequences
- 📺 **Study videos**: [CampusX's 100 Days of Deep Learning playlist](https://www.youtube.com/playlist?list=PLKnIA16_RmvYuZauWaPlRTC54KxSNLtNn) — a complete end-to-end playlist covering ANN, CNN, and RNN; if you want the deeper theoretical treatment alongside it, [Andrew Ng's Deep Learning Specialization](https://www.coursera.org/specializations/deep-learning) (a separate, more advanced specialization from the same instructor) is the natural next step
- 📖 **Or read**: *Hands-On ML* Chapters 10-16 cover the same ground in text form
- Practice: build an image classifier with a CNN, and a simple text/sequence model with an RNN

**✅ Move on when:** you understand why CNNs suit images and RNNs suit sequences, and can build a basic version of each from scratch.

## Module 9 — Generative AI (LLMs & LangChain)
- Learn: how large language models work at a high level, prompt engineering, building applications on top of LLMs using LangChain (RAG, chains, memory)
- 📺 **Study videos**: [CampusX's GenAI using Langchain playlist](https://youtube.com/playlist?list=PLKnIA16_RmvaTbihpo4MtzVm4XOQa0ER0)
- 📖 **Or read**: [LangChain official docs](https://docs.langchain.com/) — LangChain moved to this unified docs site; the older python.langchain.com docs are being phased out
- Practice: build a simple RAG (retrieval-augmented generation) application over a small document set

**✅ Move on when:** you can build a basic LLM-powered application (chatbot, document Q&A) using LangChain without heavy hand-holding.

## Module 10 — Agentic AI (LangGraph & MCP)
- Learn: agentic workflows, multi-step reasoning agents, LangGraph for building stateful agent graphs, the Model Context Protocol (MCP) for connecting agents to tools
- 📺 **Study videos**: [CampusX's Agentic AI using LangGraph playlist](https://youtube.com/playlist?list=PLKnIA16_RmvYsvB8qkUQuJmJNuiCUJFPL), [CampusX's MCP playlist](https://youtube.com/playlist?list=PLKnIA16_Rmva_oZ9F4ayUu9qcWgF7Fyc0)
- 📖 **Or read**: [LangGraph docs](https://docs.langchain.com/oss/python/langgraph/overview) (same docs migration as above), [Model Context Protocol docs](https://modelcontextprotocol.io/)
- Practice: build a simple multi-step agent that can call at least one external tool

**✅ Move on when:** you understand the difference between a simple LLM call, a chain, and a full agent — and can build a basic version of each.

## Module 11 — Capstone Projects & Portfolio
- Bring it together: pick 2-3 projects spanning classical ML (a Kaggle-style prediction problem), deep learning (an image or text classifier), and GenAI (an LLM-powered app), and build them end-to-end with clean documentation
- Put these on GitHub with clear READMEs — this becomes your portfolio for internships/jobs

---

## General Tips
- **Don't skip the math intuition for the sake of code** — Andrew Ng's courses exist specifically so you don't end up calling `.fit()` without understanding what's happening; resist the urge to rush past this.
- **Kaggle** is a great source of real datasets and community notebooks once you're past Module 4 — use it for practice, not just competitions.
- Deep learning (Module 8 onward) benefits from a GPU — Google Colab's free tier is enough to get started.
- **On videos vs reading**: Andrew Ng's specialization has strong written material alongside the videos on Coursera itself, so you don't need a separate source for that half of this roadmap; CampusX is more code-first and video-native, so reading alternatives there are mostly external (the book, docs).
