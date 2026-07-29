# JobsiteSync

## Project Overview

JobsiteSync is a B2B construction material logistics management system built to solve material volume and tracking challenges
across active jobsites. The application tracks inventory levels down to specific designated zones, yard bins, and localized storage units.
It balances structural database normalization with performance by combining a normalized multi-table database schema with a dedicated raw
query performance layer. The application features a semi-realistic SaaS marketing landing page wrapper that transitions into a functional,
data-dense administrative control dashboard. For demo purposes there is access via a dedicated "Guest Bypass" authentication route.

## Monorepo Strategy

This project is structured as a single-repository multi-app layout. It orchestrates its internal applications without a formal workspace
manager like npm workspaces or pnpm. Instead, a centralized orchestration layer in the root package configuration uses custom prefix
execution scripts and the concurrently engine to boot, install, and execute the isolated frontend and backend environments from a single
terminal stream.

## Architecture Diagram

```bash
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
│  │   Express HTTP App Engine (Port 8081 / Node.js)  │  │
│  │   - App Security (Helmet & CORS)                 │  │
│  │   - Traffic Control (Express-Rate-Limit)         │  │
│  │   - Auth State (JsonWebToken Processing)         │  │
│  │   - Query Controller (Sequelize ORM & Raw SQL)   │  │
│  └───────────────────────────┬──────────────────────┘  │
└────────────────────────────────────────────────────────┘
                               │
                               │ mysql2 Driver Link
                               ▼
┌────────────────────────────────────────────────────────┐
│                   Database Cluster                     │
│  ┌──────────────────────────────────────────────────┐  │
│  │                 MySQL Engine                     │  │
│  │   - Normal Tables (5 tables)                     │  │
│  │   - Junction Inventory Entities (1 table)        │  │
│  │   - Custom Speed Optimized B-Tree Indexes        │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

## Directory Structure

```bash
jobsitesync-project/
├── backend/ # Express REST API application workspace
│   ├── config/ # Database connectivity configurations
│   ├── controllers/ # Request routers and parameter mapping
│   ├── middleware/ # Security, authentication, and error wrappers
│   ├── models/ # Sequelize entity schemas and instance configurations
│   ├── routes/ # Express endpoint URI structures
│   ├── services/ # Core business rules and query orchestration
│   ├── tests/ # Basic Jest integration suites and sample seed files
│   └── utils/ # Query helpers, filter parsers, and raw query code
├── frontend/ # Vite client framework workspace
│   ├── public/ # Static robot text guidelines and root graphics
│   └── src/ # Clien React context
│       ├── assets/ # Default media assets and SVG elements
│       ├── components/ # Grid dashboard elements and input setups
│       ├── contexts/ # Global state monitors and toast elements
│       ├── hooks/ # URL param controllers and optimistic updates
│       ├── pages/ # Marketing wrappers and dashboard routing layouts
│       ├── services/ # Fetch backend connectivity layer
│       └── utils/ # Event handling patterns and data validations
├── DatabaseDesignDoc.pdf # Unified database layout and starter creation scripts
├── package.json # Monorepo task orchestration configuration
└── README.md # Project root manual
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
the file and copy the table structures along with raw insertion scripts directly into your preferred SQL console to build your local
tracking tables. The queries for the performance indexes are in the backend `README.md` file.

### 4. Configure Configurations

Review and supply local environment configurations for both applications by creating `.env` files within both the `/frontend`
and `/backend` application directories, following the specific sub-README instructions.

### 5. Launch the Development Services

Start both systems concurrently inside a single terminal terminal context:

```bash
npm run dev
```

The React development UI boots on `http://localhost:5173` and the Express routing engine starts listening for requests on port `8081`.

## Sub-Application READMEs

- [Frontend Client Documentation](./frontend/README.md)
- [Backend Service Documentation](./backend/README.md)

==========================================================

## Roadmap

- **Phase 1: ACID Database Transactions:** Wrap multi-site inventory balancing utilities within strict Sequelize transaction boundaries to
  guarantee atomic database updates (e.g., ensuring material reductions in Area A and additions in Area B execute as a single, unbreakable
  block).
- **Phase 2: Barcode Mobile Companion API:** Expose stateless JSON payload endpoints specifically optimized for a future React Native
  mobile application, allowing "field workers" to scan physical materials for instant inventory updates without manual data-entry, thereby reducing errors.
- **Phase 3: Deepened Testing Coverage:** Expand the custom Jest testing suite to fully mock network isolation parameters and automate deep
  end-to-end endpoint verification across all active user roles.
