# Trello Clone — Full-Stack Logic with React & TypeScript
A comprehensive project management application inspired by Trello. 
This project focuses on handling complex nested states, custom Drag-and-Drop mechanics, 
and real-time interaction with a REST API.
**[Live Demo](https://koskovtsev.github.io/trello/)**
## Key Features & Technical Challenges
### 1. Custom Drag-and-Drop Engine
Instead of using libraries (like `react-beautiful-dnd`), I implemented a **native HTML5 Drag and Drop** system.
* **Core Logic:** Successfully implemented `ondragstart` and `ondrop` for basic card relocation.
* **Dynamic Positioning:** Developed logic to calculate "slots" for cards and update positions across different lists on the backend.
### 2. Complex State Management
* **Data Hierarchy:** Managing a tree-like structure: `Boards -> Lists -> Cards`.
* **Asynchronous Updates:** Synchronization between local React state and the backend to ensure a "snappy" UI while keeping data consistent.
* **Routing:** Dynamic routes using `react-router-dom` (`/board/:boardId`) to fetch and render context-specific data.
### 3. API Integration & Architecture
* **Axios Layer:** Centralized API service with custom instances and interceptors for cleaner requests.
* **Environment Control:** Security-first approach using `.env` files for API endpoint management.
* **Scalable Styling:** Used **SCSS** with BEM methodology, variables for theming, and custom textures/backgrounds.
## Tech Stack
* **Frontend:** React 18, TypeScript, React Router 6.
* **State & Data:** Axios, Hooks (`useState`, `useEffect`, `useRef`, `useParams`).
* **Styling:** SCSS (Sass), Flexbox, CSS-in-JS.
* **Tools:** ESLint (Airbnb preset), Prettier, Husky (pre-commit hooks).
## Refactoring & Improvements (Current Focus)
I am currently addressing feedback from code reviews and expanding the project's complexity:
* **Advanced DnD UX:** Working on `ondragenter` and `ondragleave` to implement visual "slots" (placeholders) and improve the drag-and-drop flow.
* **System-wide Refactoring:** Decoupling business logic and fixing architectural inconsistencies.
* **State Optimization:** Encapsulating local UI states to prevent unnecessary re-renders in large components.
## Project Roadmap & Upcoming Features
* **User Authentication:** Implementing JWT-based auth (Sign Up/Login).
* **Advanced Card Details:** Modal windows with descriptions and checklists.
* **State Management:** Migrating complex logic to Redux Toolkit or Custom Hooks.
## Key Learnings
* **Separation of Concerns:** Deeply understood why business logic should stay separate from UI rendering.
* **TS Excellence:** Mastering interfaces for complex API responses and event types.
* **Performance:** Handling auto-scroll and UI updates efficiently during heavy DOM manipulations (DnD).
