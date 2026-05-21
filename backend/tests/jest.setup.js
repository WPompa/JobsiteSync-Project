const app = require("../../server");

let testTransaction;

beforeEach(async () => {
  const sequelize = app.get("sequelize");
  if (sequelize) {
    // Start an isolated sandbox transaction block before every test spec runs
    testTransaction = await sequelize.transaction();
    // Inject it into app context or global variables if your endpoints track them
  }
});

afterEach(async () => {
  if (testTransaction) {
    // Automatically wipe away the test creations/deletions so tables stay clean!
    await testTransaction.rollback();
  }
});

afterAll(async () => {
  const sequelize = app.get("sequelize");
  if (sequelize) {
    await sequelize.close(); // Safely exit the node testing thread processes
  }
});
