# JobsiteSync Frontend Client

## Description

The client layer provides an administrative workflow dashboard tailored for project managers and logistics coordinators. The application
uses a custom CSS layout instead of external component libraries, using pure CSS Modules, Flexbox, and CSS Grid systems for rendering. The
application features data-driven table structures that parse database rows and support client-side query parameters. It also features a
fully functional "Guest Bypass" path, allowing immediate application testing without profile signups.

## Tech Stack & Dependencies

- Core UI Engine: React 19 (Vite)
- Data Synchronization: TanStack React Query v5
- Grid Tabulation: TanStack React Table v8
- App Navigation: React Router DOM v7
- Telemetry Engine: Vercel Analytics & Vercel Speed Insights trackers
- Utility Modules: React Lazy Load Image Component (Used in older project versions)

## Environment Variables

Create a file named `.env` in the root configuration section of the `/frontend` directory:

```env
VITE_LOGIN_URL = "http://localhost:8081/login"
VITE_API_URL = "http://localhost:8081/api/v1/"
```

## Local Development

```bash
cd frontend
npm install
npm run dev
```

The React frontend boots on `http://localhost:5173/`.

## Available Scripts

npm operations within the `/frontend` folder:

- `npm run dev`: Launches the frontend.
- `npm run build`: Compiles and optimizes the frontend to the `/dist` directory.
- `npm run lint`: Runs ESLint to check for code style issues and runtime errors.
- `npm run preview`: Starts a local server to test the production build directory before deploying.

## Folder Structure

```bash
frontend/src/
├── assets/ # Default Images and SVG elements
├── components/
│   ├── dashboard-components/
│   │   ├── css/ # Component-specific CSS
│   │   ├── display-components/ # Inventory data tables and layout grids
│   │   ├── controlledInputsData.js # Legacy method for controlled inputs
│   │   ├── formConfigs.js # Object that outlines controlled inputs
│   │   ├── PostForms.jsx # Form rendering for record creation
│   │   ├── PutForms.jsx # Form rendering for record updates
│   │   └── DeleteForms.jsx # Form rendering for record removals
│   └── minor-components/ # Layout details (Navbar, Footer, Modals, Pagination)
├── contexts/ # Global toast context
├── hooks/ # URL parameters and query mutators
│   ├── useDashboardParams.jsx # State synchronization with browser URLs
│   └── useOptimisticMutation.jsx # Instant client state updates during changes
├── pages/ # Main pages for navigation
├── services/ # Reuseable Fetch API service
└── utils/ # Toast event and input validations
```

## Deployment

The frontend client is hosted on **Vercel** and utilizes automated continuous integration and continuous deployment (CI/CD).

### Automated CI/CD & Environment Management

- **GitHub Integration**: Pushes to the repository's `main` branch automatically trigger automated production builds and deployments on
  Vercel.
- **Environment Variables**: Production-specific keys (such as the live backend service address for `VITE_API_URL`) are configured securely
  inside the Vercel dashboard, keeping production infrastructure isolated from development environments.

### Production Build & Routing Architecture

- **Asset Optimization**: Executing `npm run build` runs the Vite pipeline, compiling and minifying source assets into optimized files
  inside the `/dist` directory.
- **SPA Routing Fallback**: The project includes a `vercel.json` configuration file with a global catch-all rewrite rule (`/(.*) -> /index.html`).
  This allows Vercel to serve the root file for all sub-paths, allowing `react-router-dom` to handle page reloads without triggering
  server-side 404 errors.

### Telemetry & Analytics

The source code integrates tracking hooks for `@vercel/analytics` and `@vercel/speed-insights`. These modules automatically activate in the
live production environment to capture real-world telemetry.
