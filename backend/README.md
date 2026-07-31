# JobsiteSync Backend API

## Service Overview

The backend application layer is a decoupled REST API engine that orchestrates business constraints for material logistical flows.
It handles cross-origin policies and implements network protection controls to defend endpoints from volumetric abuse. The system balances
standard object-relational mapping capabilities with low-level execution speed by executing manual multi-table internal joins for heavy
query routes. This ensures structured, paginated multi-record arrays are hydated with descriptive, human-readable titles before being
transmitted as JSON payloads.

## Tech Stack & Dependencies

- Application Environment: Node.js (CommonJS module system)
- Application Framework: Express v5.1 core release line
- Security Frameworks: Helmet security standardizer and CORS connection monitors
- Rate Limiting: Express-Rate-Limit core request protection
- Identity Handling: JSONWebToken (JWT) cryptographic validation signatures
- Database Modeling Layer: Sequelize ORM paired with the underlying mysql2 client driver
- Verification Tooling: Jest execution suite combined with Supertest automated HTTP assertions

## Environment Variables

Create a file named `.env` in the root configuration section of the `/backend` directory:

```env
MYSQL_HOST = <localhost>
MYSQL_USER = <root>
MYSQL_PASSWORD = <YourPasswordHere>
MYSQL_DATABASE = JobsiteSync
MYSQL_PORT = 8081
MYSQL_REMOTE_PORT = <Host_Port>
FRONTEND_URL = <"https://Your-URL-If-Hosting-Somewhere.com">
DEV_URL = "http://localhost:5173"
NODE_ENV = development
JWT_SECRET = <12345>
```

To run integration tests, create a matching configuration sheet named `.env.test` in the same directory, specifying a dedicated testing
database instance name.

## Database Initialization

This application benefits from database index optimization paths to run high-speed raw SQL count and pagination statements **IF** using the default queries in `rawQueries.js`.

1. Connect to your active local MySQL engine using your database management tool or CLI interface.
2. Open the file `DatabaseDesignDoc.pdf` in the root of the project.
3. Execute the schema definitions to establish the normalized tables (`jobsites`, `storage_areas`, `materials`, `employees`,
   `activity_logs`, and the `stored_in` junction table).
4. **Optionally** Run the index scripts to create the performance optimization paths on your database tables:
   - You can used the suggested below or implement your own. The suggested section is intended for the starting queries in "rawQueries.js".
5. Execute the insert query parameters from the Database Design Document to load the baseline testing data state into your database tables.

SUGGESTED

```sql
CREATE INDEX idx_employees_jobsite_title ON employees (JobsiteID, Title);
```

Information regarding the index(es):

```sql
-- Composite index: Optimizes finding employees with a specific role at a specific Jobsite.
CREATE INDEX idx_employees_jobsite_title ON employees (JobsiteID, Title);
```

## Local Setup

To run the server instance manually on your development device:

```bash
cd backend
npm install
npm start
```

The server starts up and watches files for source changes via `nodemon`. It binds and listens for requests on local port `8081`.

## API Documentation

The API processes all communication using standard JSON structures. Data responses returned from custom raw queries inside `rawQueries.js`
format data keys using **PascalCase keys** (e.g., `MaterialID`, `MaterialName`). Endpoints that alter database records require valid
JSON Web Token confirmation provided inside an HTTP Authorization header using the Bearer scheme.

### Monitored Routing Enclaves

- `POST /login` - Processes user credentials and provides client JWT tokens.
- `GET /api/v1/employees` - Returns employee data.
- `GET /api/v1/jobsites` - Returns active jobsites.
- `GET /api/v1/storageareas` - Returns storage spaces located at specific jobsites.
- `GET /api/v1/materials` - Returns an inventory list of current material along with tracked volume balances.
- `GET /api/v1/storedin` - Returns a junction table of storage areas with the specific amounts of actively stored material.
- `GET /api/v1/activitylogs` - Boradly tracks and audits asset movement records.

## API Documentation

The API operates exclusively over `application/json`. Data structures returned from specialized raw queries inside `rawQueries.js` format objects using **PascalCase keys** to mirror the optimized database index targets.

### Global Authentication Contract

Protected endpoints look for a valid JSON Web Token passed inside the standard HTTP `Authorization` request header:

- **Header Format**: `Authorization: Bearer <your_jwt_token>`
- **Failure State**: Missing or corrupted signatures trigger a `401 Unauthorized` body structure:
  ```json
  {
    "status": 401,
    "message": "Not Authorized"
  }
  ```

### Authentication Endpoint

#### `POST /login`

Validates guest or administrative access parameters.

- **Request Body**:
  ```json
  {
    "username": "guest_user",
    "password": "bypass_password"
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "status": "success",
    "result": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### Core Data Tracking Endpoints (Paginated)

#### `GET /api/storedin`

Retrieves a paginated collection of inventory storage areas and their total mapped resource metrics using index-optimized raw join queries.

- **Query Parameters**:
  - `page` (integer, default: 1)
  - `limit` (integer, default: 10)
- **Success Response (`200 OK`)**:
  ```json
  {
    "status": "success",
    "pagination": {
    "totalCount": 9,
    "totalPages": 1,
    "currentPage": 1,
    "perPage": 10,
    "hasNextPage": false,
    "hasPrevPage": false
    }
    "result": [
      {
        "StorageAreaID": 1,
        "Location": "South Yard Bin B",
        "JobsiteID": 3,
        "JobsiteName": "Downtown Office Tower",
        "Amount": 2450.0,
        "MaterialID": "1",
        "MaterialType": "Insulation",
        "Name": "2 inch Armorflex Roll"
      },
      {...},
    ]
  }
  ```

#### Pagination & Filters

All `GET` routes accept standard `page` and `limit` URL parameters which pipe directly into the `paginationHelper.js` utility matrix.

Filtering for specific rows/columns is partially in place for a future addition of such a feature via `filterBuilder.js` and `filtersMap.js`.

## Testing

The application uses Jest suites alongside Supertest mock clients to verify endpoint processing and payload structures:

```bash
npm run test
```

The testing suite fulfills basic checks and may receive more development in the future.

## Deployment & Infrastructure

The backend API is hosted on **Vercel** as a serverless infrastructure model, featuring automated continuous integration and continuous
deployment (CI/CD).

### Serverless Express Architecture

- **Automated CI/CD**: Pushes to the repository's `main` branch trigger Vercel to automatically rebuild the API and deploy updated
  serverless instances.
- **Serverless Routing**: Because the API runs as an isolated node service in a serverless environment, runtime processes utilize the root
  configuration rules to map incoming HTTP requests directly to the Express engine.
- **Environment Isolation**: Production database credentials (`MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`) and cryptographic signatures (`JWT_SECRET`)
  are configured securely in the Vercel dashboard, keeping production access entirely separate from local development environments.

### Database Connectivity

The serverless API instances require active network connectivity to an external, production-ready MySQL instance. The database cluster must
be configured to accept safe traffic originating from Vercel's deployment infrastructure, and the schema should ideally be optimized with
the B-Tree performance indexes detailed in the initialization steps.

======================================================
