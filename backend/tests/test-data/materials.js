const postTestData = [
  {
    body: {
      MaterialID: "5",
      Name: "Sealing Glue",
      MaterialType: "Glue",
      Length: "2",
      Width: "2",
      Height: "2",
      SupplierName: "testDataXYZ",
      TotalAvailable: "10",
      LostAmounts: "0",
    },
  },
  {
    body: {
      MaterialID: "6",
      Name: "Widget A",
      MaterialType: "Widget",
      Length: "6",
      Width: "6",
      Height: "6",
      SupplierName: "testDataXYZ",
      TotalAvailable: "100",
      LostAmounts: "",
    },
  },
];

const putTestData = [
  {
    body: {
      MaterialID: "5",
      Name: "",
      MaterialType: "",
      Length: "",
      Width: "",
      Height: "",
      SupplierName: "testDataXYZ",
      TotalAvailable: "",
      LostAmounts: "",
    },
    table: "materials",
    useEmpty: {},
  },
];

const deleteTestData = [
  {
    body: {
      MaterialID: "",
      Name: "",
      MaterialType: "",
      Length: "",
      Width: "",
      Height: "",
      SupplierName: "testDataXYZ",
      TotalAvailable: "",
      LostAmounts: "",
    },
  },
];

const failTestData = [
  { body: { MaterialID: "3", Name: "Corrupted Entry" }, expectedStatus: 404 },
];

module.exports = [postTestData, putTestData, deleteTestData, failTestData];
