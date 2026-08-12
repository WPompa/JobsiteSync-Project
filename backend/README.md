# JobsiteSync Backend API

## Service Overview

The backend application layer is a decoupled Express REST API that handles data orchestration and business logic for material logistics
tracking. The application uses standard security middleware (Helmet, CORS) and request rate-limiting to protect API endpoints. The
application pairs the Sequelize ORM for basic CRUD operations with custom raw SQL internal joins for faster operations and readable
response data the frontend can use. An 'Activity Log' is created when an operation deals with jobsites, materials, storage areas, and
combinations of the three via the 'stored_in' table.

## Tech Stack & Dependencies

- Runtime Environment: Node.js (CommonJS)
- API Framework: Express v5.1
- Security & Rate Limiting: Helmet, CORS, and Express-Rate-Limit
- Authentication: JSON Web Tokens
- Database Layer: Sequelize ORM with the native `mysql2` client driver
- Testing Suite: Basic Jest Unit Testing and Supertest integration

## Environment Variables

Create a file named `.env` in the root section of the `/backend` directory:

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

1. Connect to your local MySQL engine using your database management tool or SQL Client.
2. Open the file `DatabaseDesignDoc.pdf` in the root of the project.
3. Execute the schema definitions to create the normalized tables (`jobsites`, `storage_areas`, `materials`, `employees`,
   `activity_logs`, and the `stored_in` junction table).
4. **Optionally:** Run the index script to create a B-tree index:
   - You can use the suggested below or implement your own. The suggested section is intended for the starting queries in "rawQueries.js".
5. Execute the seed statements to load sample data into your database tables.

SUGGESTED

```sql
CREATE INDEX idx_employees_jobsite_title ON employees (JobsiteID, Title);
```

Information regarding the index(es):

```sql
-- Composite index: Speeds up finding employees with a specific role at a specific Jobsite.
CREATE INDEX idx_employees_jobsite_title ON employees (JobsiteID, Title);
```

## Local Setup

To run the server instance on your local machine:

```bash
cd backend
npm install
npm start
```

The server starts up and watches files for source changes via `nodemon`. It listens for requests on local port `8081`.

## API Documentation

The API processes all communication using standard JSON structures. Note that data payloads returned from the raw SQL execution layer
(`rawQueries.js`) format response fields using **PascalCase** (e.g., `MaterialID`, `MaterialName`). Endpoints that modify database records
require a valid JSON Web Token sent inside the HTTP `Authorization` header using the `Bearer` scheme.

### Monitored Routing Enclaves

- `POST /login` - Processes user credentials and provides client JWT tokens.
- `GET /api/v1/employees` - Returns employee data.
- `GET /api/v1/jobsites` - Returns active jobsites.
- `GET /api/v1/storageareas` - Returns storage spaces located at specific jobsites.
- `GET /api/v1/materials` - Returns an inventory list of current material along with tracked volume quantities.
- `GET /api/v1/storedin` - Returns a junction table of storage areas with the specific amounts of stored materials.
- `GET /api/v1/activitylogs` - Boradly tracks and audits asset movement records.

### Authentication

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

Retrieves a paginated collection of jobsite storage areas and their total material quantities.

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
        "JobsiteName": "ATL Downtown Office Tower",
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

All `GET` routes accept standard `page` and `limit` URL parameters which pipe directly into the `paginationHelper.js` utility.

The backend utilizes modular utility helpers (`filterBuilder.js` and `filtersMap.js`) to cleanly isolate query parsing logic, providing a
structured foundation for mapping dynamic filtering parameters directly to backend database lookups.

## Testing

The application uses Jest alongside Supertest to verify API endpoint responses, status codes, and JSON payload structures:

```bash
npm run test
```

## Deployment & Infrastructure

The backend API is deployed on **Vercel** as serverless functions with an automated continuous integration and continuous deployment (CI/
CD) pipeline.

### Automated CI/CD & Environment Management

- **GitHub Integration**: Pushes to the repository's `main` branch automatically trigger Vercel to rebuild and deploy the updated backend.
- **Serverless Routing**: The project utilizes a root configuration file to map incoming HTTP traffic directly to the Express routing layer
  within the serverless environment.
- **Environment Variables**: Production environment variables (`MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`) and session keys
  (`JWT_SECRET`) are configured securely inside the Vercel dashboard, keeping production infrastructure isolated from development
  environments.

### Database Connectivity

The serverless API requires network connectivity to an external, publicly accessible MySQL instance. The target database must be configured
to allow inbound traffic from Vercel's deployment servers and should be initialized with the core schema and performance index outlined in
this README.

======================================================
