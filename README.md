# JobsiteSync

## Project Overview

JobsiteSync is a B2B construction material logistics system built to track inventory down to specific yard bins, designated zones, and
localized storage units. The application has a normalized multi-table database schema that uses Sequelize ORM and raw SQL queries. The
application features a mock SaaS landing page selling a product and transitions into a functional, paginated administrative control
dashboard. It is a portfolio project to demonstrate junior-level, full-stack competency and not meant to meet real SaaS product
requirements. **It is a browser-first tool for administrators or logistics coordinators**. A separate companion mobile app is
planned for employees active on a jobsite or running ground logistics. For demo purposes there is access via a dedicated "Guest Bypass"
authentication route.

## Monorepo Strategy

This project is structured as a single-repository multi-app layout. It runs its internal applications without a formal workspace
manager like npm workspaces or pnpm. Instead, the root package configuration uses custom prefix execution scripts and the concurrently
package to boot, install, and execute the separate frontend and backend environments from a single terminal.

## Architecture Diagram

```
┌────────────────────────────────────────────────────────┐
│                      Web Browser                       │
│  ┌───────────────────────┐   ┌──────────────────────┐  │
│  │   Vite Dev Server     │   │  Vercel Analytics &  │  │
│  │     (Port 5173)       │   │    Speed Insights    │  │
│  └───────────┬───────────┘   └──────────┬───────────┘  │
└──────────────┼──────────────────────────┼──────────────┘
               │                          │
               │ HTTP Requests            │ Performance Telemetry
               ▼                          ▼
┌────────────────────────────────────────────────────────┐
│                 Backend Express Server                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │   Express Setup (Port 8081 / Node.js)            │  │
│  │   - App Security (Helmet & CORS)                 │  │
│  │   - Rate Limiting (Express-Rate-Limit)           │  │
│  │   - Authentication (JSON Web Tokens)             │  │
│  │   - Query Controller (Sequelize ORM & Raw SQL)   │  │
│  └────────────────────────┬─────────────────────────┘  │
└────────────────────────────────────────────────────────┘
                            │
                            │ mysql2 Driver Link
                            ▼
┌────────────────────────────────────────────────────────┐
│                        Database                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │                 MySQL Engine                     │  │
│  │   - Normal Tables (5 tables)                     │  │
│  │   - Junction Table (1 table)                     │  │
│  │   - 1 B-Tree Index                               │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

## Directory Structure

```bash
jobsitesync-project/
├── backend/ # Express REST API
│   ├── config/ # Database connection config
│   ├── controllers/ # Route controllers
│   ├── middleware/ # JWT, rate-limiting, and error handling
│   ├── models/ # Sequelize models
│   ├── routes/ # Express endpoints
│   ├── services/ # Core business rules and query related logic
│   ├── tests/ # Basic Jest integration suites and sample seed files
│   └── utils/ # Query helpers, filter parsers, and raw query code
├── frontend/ # React SPA (Vite)
│   ├── public/ # robots.txt
│   └── src/ # React client source code
│       ├── assets/ # Default Images and SVG elements
│       ├── components/ # Grid dashboard elements and input setups
│       ├── contexts/ # Global toast context
│       ├── hooks/ # URL param controllers and optimistic updates
│       ├── pages/ # Main page views
│       ├── services/ # Reuseable Fetch API service
│       └── utils/ # Toast event and input validations
├── DatabaseDesignDoc.pdf # Database info and starter creation scripts
├── package.json # Monorepo launch configuration
└── README.md # Project documentation
```

## Global Prerequisites

- Node.js Version 22.x LTS or higher
- npm Version 10.x or higher
- MySQL Community Server Version 8.0 or higher

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/WPompa/JobsiteSync-Project.git
cd jobsitesync-project
```

### 2. Install Project Dependencies

Execute the combined setup script from the root project directory to install dependencies for both individual projects simultaneously:

```bash
npm run install-all
```

### 3. Initialize the Core Database

Ensure your local MySQL database engine instance is running. Locate the `DatabaseDesignDoc.pdf` file in the root folder. Open
the file and run the table creation + seed queries in your preferred SQL console to build your local tracking tables. The
queries for the performance indexes are in the backend `README.md` file.

### 4. Setup Environment Variables

Create a `.env` file in both the `/frontend` and `/backend` directories. Fill in your local database credentials and port configurations
by following the template instructions provided in the respective READMEs.

### 5. Launch the Development Services

Start both systems concurrently inside a single terminal context:

```bash
npm run dev
```

The React frontend boots on `http://localhost:5173` and the Express server starts listening for requests on port `8081`.

## Sub-Application READMEs

- [Frontend Client Documentation](./frontend/README.md)
- [Backend Service Documentation](./backend/README.md)

==========================================================

## Roadmap

- **Phase 1: Barcode/QR Mobile Companion App:** A future React Native mobile app, allowing field workers to scan physical materials for
  instant inventory updates without manual data-entry, thereby reducing errors.
- **Phase 2: Deepened Testing Coverage:** Expand the custom Jest testing suite to better mock backend logic and routing.
