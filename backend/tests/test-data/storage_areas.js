const postTestData = [
  {
    body: {
      StorageAreaID: "5",
      Length: "55",
      Width: "55",
      Height: "55",
      Location: "testDataXYZ",
      JobsiteID: "1",
      TotalStored: "5",
      Is_Container: "1",
    },
  },
  {
    body: {
      StorageAreaID: "6",
      Length: "66",
      Width: "66",
      Height: "66",
      Location: "testDataXYZ",
      JobsiteID: "2",
      TotalStored: "6",
      Is_Container: "0",
    },
  },
];

const putTestData = [
  {
    body: {
      StorageAreaID: "5",
      Length: "56",
      Width: "56",
      Height: "56",
      Location: "testDataXYZ",
      JobsiteID: "",
      TotalStored: "56",
      Is_Container: "0",
    },
    table: "storage_areas",
    useEmpty: {},
  },
];

const deleteTestData = [
  {
    body: {
      StorageAreaID: "",
      Length: "",
      Width: "",
      Height: "",
      Location: "testDataXYZ",
      JobsiteID: "",
      TotalStored: "",
      Is_Container: "",
    },
  },
];

const failTestData = [
  {
    body: { StorageAreaID: "1", Location: "Unauthorized Zone Modification" },
    expectedStatus: 404,
  },
];

module.exports = [postTestData, putTestData, deleteTestData, failTestData];
