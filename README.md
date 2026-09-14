# Math Frontier

> **Explore the questions mathematics hasn't answered — and the ideas that changed how we think.**

*Digital Mathematics Museum + Interactive Laboratory + Mathematical Knowledge Base*

[![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?logo=three.js)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Render](https://img.shields.io/badge/Deploy-Render-46E3B7?logo=render)](https://render.com)

---

## 1. Product Vision

**Math Frontier** is a premium interactive mathematics platform designed to inspire curiosity and rigorous mathematical intuition. It is not a blog, static list of problems, or generic encyclopedia. It operates as a digital museum and exploratory laboratory where users:

* **Discover famous unsolved problems** (Millennium Prize Problems, number-theoretic conjectures).
* **Understand why they are difficult** and see the precise boundaries of current mathematical knowledge.
* **Distinguish proof from evidence** — recognizing that checking trillions of cases on supercomputers never constitutes a mathematical proof.
* **Experience 3D topological phenomena** (the flagship 5-step animated Möbius Strip, 4D Klein Bottle immersion, Torus geodesic loops).
* **Run real-time experiments** in the interactive laboratory (Collatz trajectories, Goldbach comet decompositions, Twin Prime sieves, Fractal iterations, Hilbert's Hotel).
* **Understand the foundational boundaries of logic** — distinguishing between open problems, proven undecidability (Turing's Halting Problem), and foundational independence (Cohen & Gödel's Continuum Hypothesis).

> *"Some questions have answers. Some have proofs. Some have neither."*

---

## 2. Core Content Principle: Epistemological Integrity

Math Frontier enforces strict classification across the database and user interface:

| Mathematical Concept | Rigorous Classification | Educational Significance |
| :--- | :--- | :--- |
| **Möbius Strip** | `PHENOMENON` | One-sided, non-orientable 2-manifold with single boundary curve |
| **Poincaré Conjecture** | `SOLVED` | Resolved by Grigori Perelman (2002–2003) via Ricci flow with surgery |
| **Riemann Hypothesis** | `OPEN` | Millennium Prize Problem; 10+ trillion zeros checked, unproved generally |
| **The Halting Problem** | `UNDECIDABLE` | Proven impossible by Alan Turing (1936); no general algorithm can exist |
| **Continuum Hypothesis** | `INDEPENDENT` | Independent of standard ZFC axioms (Gödel 1940, Cohen 1963) |
| **Banach–Tarski Paradox** | `PARADOX` | Pure theorem of ZFC; decomposes 3D ball into 5 non-measurable point sets |

Every entry maintains source verification metadata:
* `LastVerified`: Date of latest academic literature review.
* `StatusSource`: Authoritative peer-reviewed source or foundation (e.g. Clay Mathematics Institute, Annals of Mathematics).
* `SourceType`: Official Prize Problem, Breakthrough Theorem, Foundational Paper, or Disputed Claim.
* `StatusNotes`: Distinguishes verified status from recent unverified preprints or computer calculations.

---

## 3. Technology Stack & Architecture

### Backend (.NET 10 Web API)
* **Framework**: .NET 10 (`net10.0`), C# 13, ASP.NET Core Web API
* **ORM**: Entity Framework Core with dual database support:
  * **Development**: SQLite (`Data Source=mathfrontier.db`)
  * **Production**: PostgreSQL (`Npgsql.EntityFrameworkCore.PostgreSQL`)
  * Switchable seamlessly via `DATABASE_PROVIDER=sqlite` or `DATABASE_PROVIDER=postgresql`
* **API Documentation**: Built-in OpenAPI (`Microsoft.AspNetCore.OpenApi`) with interactive Swagger UI at `/swagger`
* **Observability**: Structured logging, health check endpoints at `/health` and `/health/db`
* **Port Handling**: Dynamically respects `PORT` environment variable (required by Render)

### Frontend (React + TypeScript + Three.js)
* **Build System**: Vite, TypeScript, React 19
* **Styling**: Tailwind CSS v4, custom museum aesthetic with Cinzel serif and Fira Code monospace typography
* **Mathematical Typesetting**: KaTeX (`katex`) for crisp LaTeX mathematical expressions
* **3D Visualizations**: Three.js, `@react-three/fiber`, `@react-three/drei`
* **Icons & Animation**: Lucide React, Framer Motion
* **Testing**: Vitest test suite for pure mathematical functions

---

## 4. Monorepo Structure

```
MATH-FRONTIER/
├── backend/
│   ├── MathFrontier.slnx                 # Solution configuration
│   ├── MathFrontier.Core/                # Domain models, enums, interfaces, DTOs
│   │   ├── Entities/                     # Problem, Wonder, Category, TimelineEvent, etc.
│   │   ├── Enums/                        # ProblemStatus, DifficultyLevel, VisualizationType
│   │   ├── Interfaces/                   # Repository contracts
│   │   └── DTOs/                         # Search and filter DTOs
│   ├── MathFrontier.Infrastructure/      # EF Core DbContext, migrations, and seed data
│   │   ├── Data/                         # MathFrontierDbContext & DatabaseSeeder
│   │   └── Repositories/                 # ProblemRepository, SearchService, etc.
│   ├── MathFrontier.Api/                 # ASP.NET Core Web API controllers & pipeline
│   │   ├── Controllers/                  # Problems, Wonders, Search, Timeline, Health
│   │   ├── Dockerfile                    # Multi-stage container build
│   │   └── Program.cs                    # Server bootstrap, CORS, OpenAPI
│   └── MathFrontier.Tests/               # xUnit unit and integration tests
├── frontend/
│   └── math-frontier-web/                # React + Vite + TypeScript application
│       ├── src/
│       │   ├── components/common/        # KaTeXMath, StatusBadge, IntuitionVsMath, ErrorBoundary
│       │   ├── components/layout/        # Navbar, Footer, SearchModal, HeroBackground
│       │   ├── components/visualizations/# MobiusStripScene, KleinBottle, Torus, FractalLab, etc.
│       │   ├── pages/                    # Home, Problems, Detail, Wonders, Gallery, Lab, Timeline
│       │   ├── services/                 # Centralized api.ts client & resilient fallbackData.ts
│       │   ├── types/                    # math.ts TypeScript domain definitions
│       │   └── utils/                    # mathUtils.ts pure functions & mathUtils.test.ts
│       ├── index.html                    # HTML shell with Google Fonts & KaTeX styles
│       ├── package.json
│       └── vite.config.ts
├── deployment/
│   └── render.yaml                       # Render Blueprint (API Docker Web Service + Web Static Site)
├── docker-compose.yml                    # Local container orchestration
├── .gitignore
└── README.md
```

---

## 5. Local Development Setup

### Prerequisites
* [.NET 10 SDK](https://dotnet.microsoft.com/download)
* [Node.js (v20+) and npm](https://nodejs.org/)

### 1. Run the Backend API
```bash
# Navigate to the repository root
export DOTNET_CLI_HOME=$PWD/.dotnet_home

# Restore and run the Web API (defaults to SQLite and port 5000)
dotnet run --project backend/MathFrontier.Api
```
The API is now live at:
* API Base: `http://localhost:5000`
* Swagger Documentation: `http://localhost:5000/swagger`
* Health Check: `http://localhost:5000/health`
* Database Health: `http://localhost:5000/health/db`

### 2. Run the Frontend Web App
In a separate terminal:
```bash
# Install frontend dependencies
npm install --legacy-peer-deps --prefix frontend/math-frontier-web

# Start Vite development server
npm run dev --prefix frontend/math-frontier-web
```
The web application is now live at:
* Local URL: `http://localhost:5173`

---

## 6. Running Automated Tests

### Backend xUnit Tests
```bash
export DOTNET_CLI_HOME=$PWD/.dotnet_home
dotnet test backend/MathFrontier.Tests
```
Verifies:
* Mathematical status integrity (Poincaré is `SOLVED`, Riemann is `OPEN`, Halting is `UNDECIDABLE`, Continuum is `INDEPENDENT`).
* Metadata completeness (`LastVerified`, `StatusSource`, `SourceType`, `StatusNotes`).
* Database querying, category filtering, and unified search service.

### Frontend Vitest Suite
```bash
npm test --prefix frontend/math-frontier-web
```
Tests pure mathematical calculation functions:
* `generateCollatzSequence()`: Stopping time, peak value, and convergence.
* `isPrime()` & `goldbachPairs()`: Prime decomposition partitions.
* `twinPrimesInRange()`: Prime gap scanner.
* `mobiusPoint()`: Closed parametric loop and single boundary continuity.
* `mandelbrotIteration()` & `juliaIteration()`: Complex escape times.
* `kochIteration()`: Recursive geometry generation.

---

## 7. Render Deployment Guide

Math Frontier is pre-configured for automated deployment on [Render](https://render.com) via Render Blueprint (`deployment/render.yaml`).

### Step-by-Step Render Deployment:
1. **Push to GitHub**:
   Ensure your latest code is committed and pushed to the `main` branch of `https://github.com/shatru123/MATH-FRONTIER`.
2. **Log into Render**:
   Open [dashboard.render.com](https://dashboard.render.com) and click **New +** -> **Blueprint**.
3. **Connect Repository**:
   Select the `MATH-FRONTIER` repository.
4. **Deploy Blueprint**:
   Render will parse `deployment/render.yaml` and create two services:
   * `math-frontier-api` (Docker Web Service)
   * `math-frontier-web` (Static Site with SPA rewrites `/* -> /index.html`)
5. **Configure Environment Variables**:
   * For API:
     * `DATABASE_PROVIDER=sqlite` (default) or `postgresql`
     * `DATABASE_CONNECTION_STRING` (if connecting to Render PostgreSQL)
     * `CORS_ORIGINS=https://math-frontier-web.onrender.com`
   * For Frontend:
     * `VITE_API_BASE_URL=https://math-frontier-api.onrender.com`
6. **Verify Endpoints**:
   * API Health: `https://math-frontier-api.onrender.com/health`
   * Web App: `https://math-frontier-web.onrender.com`

---

## 8. Docker Deployment

To build and run the entire backend container locally:
```bash
docker compose up --build
```
This starts `math-frontier-api` on port `5000`.

---

## 9. Adding New Content

### Adding a New Problem
1. Add an entry to `DatabaseSeeder.cs` inside `backend/MathFrontier.Infrastructure/Data/DatabaseSeeder.cs`.
2. Supply mandatory status integrity fields:
   * `Status`: (`OPEN`, `SOLVED`, `UNDECIDABLE`, `INDEPENDENT`, `PARTIALLY_SOLVED`, etc.)
   * `LastVerified`: e.g. `"2026-03-01"`
   * `StatusSource`: e.g. `"Clay Mathematics Institute"`
   * `SourceType`: e.g. `"Millennium Prize Problem"`
   * `StatusNotes`: Summarizing verified facts vs unproven conjectures
3. (Optional) Mirror the entry in `frontend/math-frontier-web/src/services/fallbackData.ts` to ensure zero-downtime offline resilience.

### Adding a New Visualization
1. Implement your scene in `frontend/math-frontier-web/src/components/visualizations/YourScene.tsx`.
2. Register the slug in `frontend/math-frontier-web/src/components/visualizations/registry.ts`:
   ```ts
   'your-slug': {
     title: 'Your Visual Experience',
     description: 'Detailed description.',
     component: YourScene,
     category: 'Geometry',
     isThreeD: true
   }
   ```
3. Set `VisualizationSlug = "your-slug"` on any problem or wonder. The UI will automatically render the interactive 3D canvas on the corresponding detail page.

---

## 10. License

MIT License. Designed with scientific rigor for mathematics educators, researchers, and enthusiasts worldwide.

---

## 11. Creator & Contact

**Math Frontier** was created and developed by:

* **Creator**: Shatrughna Ambhore
* **Email**: [ambhoreshatrughna@gmail.com](mailto:ambhoreshatrughna@gmail.com)
* **Phone / Contact**: [+91 9604466334](tel:+919604466334)
