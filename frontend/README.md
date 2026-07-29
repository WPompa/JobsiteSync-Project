# JobsiteSync Frontend Client

## Description

The client layer provides an administrative workflow dashboard tailored for project managers and logistics coordinators. The application
uses a completely custom CSS layout instead of external component libraries, using pure CSS Modules, Flexbox, and CSS Grid systems for
rendering. The application features data-driven table structures that parse complex database rows and support client-side interactive
parameter synchronization. It also features a fully functional "Guest Bypass" path, allowing immediate application review without
mandatory profile signups.

## Tech Stack & Dependencies

- Core UI Engine: React 19 (Vite EcmaScript Module Build Pipeline)
- Data Synchronization: TanStack React Query v5 (State hydration, caching, and background synchronization)
- Grid Tabulation: TanStack React Table v8 (Row mapping and client sorting parameters)
- App Navigation: React Router DOM v7 (Shared layouts, nested routes, and dashboard parameters)
- Telemetry Engine: Vercel Analytics & Vercel Speed Insights trackers
- Utility Modules: React Lazy Load Image Component (Asynchronous graphic rendering)

## Environment Variables

Create a file named `.env` in the root configuration section of the `/frontend` directory:

```env
VITE_LOGIN_URL = "http://localhost:8081/login"
VITE_API_URL = "http://localhost:8081/api/v1/"
```

## Local Development

To execute and debug the browser layout module on your local system independently:

```bash
cd frontend
npm install
npm run dev
```

The localized server compiles dependencies and hosts the active web context on `http://localhost:5173/`.

## Available Scripts

Run the following npm operations from within the `/frontend` folder:

- `npm run dev`: Launches the interactive Vite hot-reloading development workspace.
- `npm run build`: Compiles project modules, builds code-splitting optimizations, and outputs production assets to the `/dist` directory.
- `npm run lint`: Evaluates client JavaScript and JSX components against strict structural rules via ESLint 9.
- `npm run preview`: Launches a local preview web server to test production build folders before distribution.

## Folder Structure

```bash
frontend/src/
├── assets/ # Local static images and SVG file wrappers
├── components/ # UI elements and interface components
│   ├── dashboard-components/
│   │   ├── css/ # Element layout styling configurations
│   │   ├── display-components/ # Specialized tabular view grids for schemas
│   │   ├── controlledInputsData.js # Dynamic input definitions
│   │   ├── formConfigs.js # Dynamic structure settings for operations
│   │   ├── PostForms.jsx # Record creation handlers
│   │   ├── PutForms.jsx # Record modification handlers
│   │   └── DeleteForms.jsx # Record removal handlers
│   └── minor-components/ # Layout details (Navbar, Footer, Modals, Pagination)
├── contexts/ # Global system operations and alert definitions
├── hooks/ # URL parameter mapping tools and query mutators
│   ├── useDashboardParams.jsx # State synchronization with browser URLs
│   └── useOptimisticMutation.jsx # Instant client state updates during changes
├── pages/ # Landing experiences and core structural views
├── services/ # Centralized API service controller using Fetch API
└── utils/ # Verification checkers and validation parameters
```

## Deployment

The frontend client is hosted on **Vercel** and utilizes automated continuous integration and continuous deployment (CI/CD) pipelines.

### Automated CI/CD & Environment Management

- **GitHub Integration**: Pushes to the repository's `main` branch automatically trigger automated production builds and deployments on
  Vercel.
- **Environment Variables**: Production-specific keys (such as the live backend service address for `VITE_API_URL`) are populated securely
  within the Vercel platform dashboard, overriding the local development configurations.

### Production Build & Routing Architecture

- **Asset Optimization**: Executing `npm run build` runs the Vite pipeline, compiling and minifying source assets into static files inside
  the `/dist` directory.
- **SPA Routing Fallback**: The project includes a `vercel.json` configuration file with a global catch-all rewrite rule (`/(.*) -> /index.html`).
  This configuration forces Vercel to serve the root file for all sub-paths, allowing `react-router-dom` to handle page reloads and deep
  links safely without triggering server-side 404 errors.

### Telemetry & Analytics

The source code integrates tracking hooks for `@vercel/analytics` and `@vercel/speed-insights`. These modules automatically activate in the
live production environment to capture real-world loading performance, user interaction trends, and core web vitals.
