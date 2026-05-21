const postTestData = [
  {
    body: {
      StorageAreaID: "5",
      MaterialID: "6",
      Amount: "9912",
    },
  },
  {
    body: {
      StorageAreaID: "6",
      MaterialID: "5",
      Amount: "9912",
    },
  },
];

const putTestData = [
  {
    body: {
      StorageAreaID: "5",
      MaterialID: "6",
      Amount: "9912",
    },
    table: "stored_in",
    useEmpty: {},
  },
];

const deleteTestData = [
  {
    body: {
      StorageAreaID: "5 ,   6",
      MaterialID: "6,        5",
      Amount: "",
    },
  },
];

const failTestData = [
  {
    body: {
      StorageAreaID: "2",
      MaterialID: "3",
    },
    expectedStatus: 404,
  },
];

module.exports = [postTestData, putTestData, deleteTestData, failTestData];
