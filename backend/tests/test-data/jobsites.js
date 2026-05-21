const postTestData = [
  { body: { JobsiteID: "4", JobsiteName: "testDataXYZ" } },
  { body: { JobsiteID: "5", JobsiteName: "testDataXYZ" } },
];

const putTestData = [
  {
    body: { JobsiteID: "5", JobsiteName: "testDataXYZ" },
    table: "jobsites",
    useEmpty: {},
  },
];

const deleteTestData = [
  { body: { JobsiteID: "", JobsiteName: "testDataXYZ" } },
];

const failTestData = [
  {
    body: { JobsiteID: "2", JobsiteName: "Illegal Overwrite" },
    expectedStatus: 404,
  },
];

module.exports = [postTestData, putTestData, deleteTestData, failTestData];
