//
const {
  setUpdateOptions,
  setDeleteOptions,
} = require("../../utils/serviceHelpers");

// 1. Mock out Sequelize Operator Symbols so Jest can track them independently of a live DB
const Op = {
  or: Symbol("or"),
  and: Symbol("and"),
  in: Symbol("in"),
  gt: Symbol("gt"),
};

describe("Database Query Utility Functions", () => {
  describe("setUpdateOptions() Logic Tests", () => {
    it("should compile conditions correctly for single primary key tables", () => {
      const primaryKeys = ["EmpID"];

      // Simulating how your processKeyValues wrapper packs arrays
      const primaryKeyValuesArr = [{ EmpID: [21, 22] }];

      const result = setUpdateOptions(primaryKeys, primaryKeyValuesArr, Op);

      expect(result).toEqual({
        EmpID: { [Op.or]: [21, 22] },
      });
    });

    it("should prevent cross-contamination by creating structured rows for composite keys", () => {
      const primaryKeys = ["StorageAreaID", "MaterialID"];

      // Simulating processKeyValues array indices pairs for stored_in
      const primaryKeyValuesArr = [
        { StorageAreaID: [5, 6] },
        { MaterialID: [20, 21] },
      ];

      const result = setUpdateOptions(primaryKeys, primaryKeyValuesArr, Op);

      // Verifies that index 0 matches together and index 1 matches together
      expect(result).toEqual({
        [Op.or]: [
          { StorageAreaID: 5, MaterialID: 20 },
          { StorageAreaID: 6, MaterialID: 21 },
        ],
      });
    });
  });

  describe("setDeleteOptions() Protection Tests", () => {
    it("should apply safety bounds strictly greater than base threshold for single primary keys", () => {
      const keyValuesArr = [{ EmpID: [12, 13, 14, 15] }];

      const result = setDeleteOptions(keyValuesArr, "EmpID", Op);

      expect(result).toEqual({
        [Op.and]: [
          { EmpID: { [Op.in]: [12, 13, 14, 15] } },
          { EmpID: { [Op.gt]: 13 } }, // Protects starter accounts <= 13
        ],
      });
    });

    it("should append primary data guards even when deleting by a non-primary filter column", () => {
      const keyValuesArr = [{ Title: ["Supervisor", "Journeyman"] }];

      const result = setDeleteOptions(keyValuesArr, "EmpID", Op);

      expect(result).toEqual({
        [Op.and]: [
          { Title: { [Op.in]: ["Supervisor", "Journeyman"] } },
          { EmpID: { [Op.gt]: 13 } },
        ],
      });
    });

    it("should protect multiple composite columns independently when deleting", () => {
      // Simulating the output array structure from processKeyValues
      const keyValuesArr = [
        { StorageAreaID: ["3", "4", "5"] },
        { MaterialID: ["3", "4", "5"] },
      ];

      const result = setDeleteOptions(
        keyValuesArr,
        ["StorageAreaID", "MaterialID"],
        Op,
      );

      // Verifies that index 0 pairs together, index 1 pairs together, etc.
      expect(result).toEqual({
        [Op.and]: [
          {
            [Op.or]: [
              { StorageAreaID: "3", MaterialID: "3" },
              { StorageAreaID: "4", MaterialID: "4" },
              { StorageAreaID: "5", MaterialID: "5" },
            ],
          },
          { StorageAreaID: { [Op.gt]: 4 } },
          { MaterialID: { [Op.gt]: 4 } },
        ],
      });
    });
  });
});
