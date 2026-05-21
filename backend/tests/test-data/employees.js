const postTestData = [
  {
    body: {
      EmpID: "21",
      Fname: "Test",
      Lname: "Dummy",
      Title: "testDataXYZ",
      SupervisorID: "1",
      JobsiteID: "1",
    },
  },
  {
    body: {
      EmpID: "22",
      Fname: "testing",
      Lname: "Dummy",
      Title: "testDataXYZ",
      SupervisorID: "1",
      JobsiteID: "1",
    },
  },
];

const putTestData = [
  {
    body: {
      EmpID: "21",
      Fname: "testing",
      Lname: "Dummies",
      Title: "testDataXYZ",
      SupervisorID: "2",
      JobsiteID: "2",
    },
    table: "employees",
    useEmpty: {},
  },
];

const deleteTestData = [
  {
    body: {
      EmpID: "",
      Fname: "",
      Lname: "",
      Title: "testDataXYZ",
      SupervisorID: "",
      JobsiteID: "",
    },
  },
];

const failTestData = [
  {
    body: { EmpID: "4", Fname: "Hacker", Lname: "Attack", Title: "Malicious" },
    expectedStatus: 404,
  },
];

module.exports = [postTestData, putTestData, deleteTestData, failTestData];
