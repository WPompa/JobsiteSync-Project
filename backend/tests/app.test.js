const testingDataArr = require("./test-data");
const app = require("../server");
const request = require("supertest");

const BASE_ROUTE = "/api/v1/";
const AUTH_HEADERS = { Authorization: "Bearer Gu3$t" };

/**
 * Universal, future-proof network request wrapper utility.
 * Handles nested `{ body: { ... } }` legacy payloads AND future flat payloads.
 * Automatically injects authorization and strips framework testing metadata.
 */
function makeRequest(method, path, rawPayload = null, headers = {}) {
  let req = request(app)[method](path);

  // 1. Apply headers: Use specific overrides if passed, otherwise default to global auth
  const finalHeaders = Object.keys(headers).length > 0 ? headers : AUTH_HEADERS;
  req = req.set(finalHeaders);

  if (rawPayload) {
    // 2. Isolate the core database property fields
    let actualDataFields = rawPayload.body ? rawPayload.body : rawPayload;

    // 3. Deep clone and strip all testing framework meta-properties!
    // This stops 'table', 'useEmpty', and 'method' from leaking into Sequelize updates
    if (
      actualDataFields &&
      typeof actualDataFields === "object" &&
      !Array.isArray(actualDataFields)
    ) {
      actualDataFields = { ...actualDataFields };
      delete actualDataFields.table;
      delete actualDataFields.useEmpty;
      delete actualDataFields.method;
    }

    // 4. FUTURE-PROOF ARCHITECTURE SWITCH:
    // Change this flag to 'false' when you remove the extra "body" layer from your controllers!
    const BACKEND_EXPECTS_EXTRA_BODY_WRAPPER = true;

    let finalPayload;
    if (BACKEND_EXPECTS_EXTRA_BODY_WRAPPER) {
      finalPayload = {
        body: actualDataFields,
        // Passes useEmpty down as a sibling object exactly where your controller expects it
        useEmpty: rawPayload.useEmpty || {},
      };
    } else {
      finalPayload = actualDataFields;
    }

    req = req.send(finalPayload);
  }

  return req;
}

describe("Global API Lifecycle Integration Suite", () => {
  const OptionOne = 0;
  const OptionTwo = 1;

  // =========================================================================
  // STAGE 1: PROVISION VALID ENTRIES
  // =========================================================================
  describe("Stage 1: Resource Provisioning", () => {
    testingDataArr.forEach(({ modelName, routeEndpoint, testDataArr }) => {
      const [postTestData] = testDataArr;

      it(`should successfully create two new records in ${routeEndpoint}`, async () => {
        await makeRequest(
          "post",
          `${BASE_ROUTE}${routeEndpoint}`,
          postTestData[OptionOne],
        ).expect(201);
        await makeRequest(
          "post",
          `${BASE_ROUTE}${routeEndpoint}`,
          postTestData[OptionTwo],
        ).expect(201);
        console.log(
          `🚀 [STAGE 1 SUCCESS] ---> ${modelName} test entries successfully provisioned in DB.`,
        );
      });
    });
  });

  // =========================================================================
  // STAGE 2: MODIFY VALID ENTRIES
  // =========================================================================
  describe("Stage 2: Resource Modifications", () => {
    testingDataArr.forEach(({ modelName, routeEndpoint, testDataArr }) => {
      const [, putTestData] = testDataArr;

      it(`should successfully execute modifications on ${routeEndpoint}`, async () => {
        if (!putTestData || !putTestData[OptionOne]) return;

        // Uses your specified custom route method overrides or defaults globally to a standard PUT
        const method = putTestData[OptionOne].method || "put";

        const response = await makeRequest(
          method,
          `${BASE_ROUTE}${routeEndpoint}`,
          putTestData[OptionOne],
        ).expect(200);
        expect(response.body).toHaveProperty("status", "Success!");
        console.log(
          `📝 [STAGE 2 SUCCESS] ---> ${modelName} fields updated and verified via ${method.toUpperCase()}.`,
        );
      });
    });
  });

  // =========================================================================
  // STAGE 3: TEARDOWN / CLEANUP
  // =========================================================================
  describe("Stage 3: Resource Tear-Down and Purge", () => {
    // Reverse the execution chain so that junction tables (storedin) are dropped
    // BEFORE parent entities (materials, storageareas) are removed.
    const reversedDataArr = [...testingDataArr].reverse();

    reversedDataArr.forEach(({ modelName, routeEndpoint, testDataArr }) => {
      const [, , deleteTestData] = testDataArr;

      it(`should cleanly handle row deletions within ${routeEndpoint}`, async () => {
        if (!deleteTestData || !deleteTestData[OptionOne]) return;

        await makeRequest(
          "delete",
          `${BASE_ROUTE}${routeEndpoint}`,
          deleteTestData[OptionOne],
        ).expect(200);
        console.log(
          `♻️  [STAGE 3 SUCCESS] ---> ${modelName} test data safely purged from database tables.`,
        );
      });
    });
  });

  // =========================================================================
  // STAGE 4: VERIFY SECURITY GUARDS
  // =========================================================================
  describe("Stage 4: Validation Guard Security Assertions", () => {
    testingDataArr.forEach(({ modelName, routeEndpoint, testDataArr }) => {
      const [, , , failTestData] = testDataArr;

      it(`should block unauthorized base data modification attempts on ${routeEndpoint}`, async () => {
        if (!failTestData || !failTestData[OptionOne]) return;

        const targetPayload = failTestData[OptionOne];
        const expectedFailureCode = targetPayload.expectedStatus || 404;

        // Dispatches a DELETE call to evaluate your Op.gt query filter defenses.
        // It should match 0 rows and return your custom 404 AppError successfully.
        await makeRequest(
          "delete",
          `${BASE_ROUTE}${routeEndpoint}`,
          targetPayload,
        ).expect(expectedFailureCode);

        console.log(
          `🛡️  [STAGE 4 SUCCESS] ---> ${modelName} baseline immutable block successfully intercepted!`,
        );
      });
    });
  });
});
