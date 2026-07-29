const { filterBuilder } = require("./filterBuilder");
const filtersMap = require("./filtersMap");

const tables = {
  leadership: {
    count: (filters = {}) => {
      const { whereStr } = filterBuilder(filters, filtersMap.leadershipFilters);
      const filterAppend = whereStr
        ? `AND ${whereStr.replace("WHERE ", "")}`
        : "";

      return `SELECT COUNT(emp1.empid) AS Count 
              FROM employees AS emp1 
              WHERE (EXISTS (SELECT 1 FROM employees AS emp2 WHERE emp2.supervisorid = emp1.empid) OR LOWER(emp1.title) = 'owner')
              ${filterAppend};`;
    },
    query: (filters = {}) => {
      const { whereStr } = filterBuilder(filters, filtersMap.leadershipFilters);
      const filterAppend = whereStr
        ? `AND ${whereStr.replace("WHERE ", "")}`
        : "";

      return `SELECT DISTINCT emp1.empid AS EmpID, CONCAT(emp1.fname, ' ', emp1.lname) AS Name, emp1.title AS Title, emp1.JobsiteID AS JobsiteID, JobsiteName
        FROM employees AS emp1
        LEFT JOIN employees AS emp2
        ON emp2.supervisorid = emp1.empid
        LEFT JOIN jobsites
        ON emp1.JobsiteID = jobsites.JobsiteID
        WHERE (emp2.supervisorid IS NOT NULL OR LOWER(emp1.title) = 'owner')
        ${filterAppend} 
        ORDER BY emp1.empid ASC LIMIT :limit OFFSET :offset;`;
    },
  },

  employees: {
    count: (filters = {}) => {
      const { whereStr } = filterBuilder(filters, filtersMap.employeeFilters);

      return `SELECT COUNT(emp1.empid) AS Count FROM employees AS emp1 ${whereStr};`;
    },
    query: (filters = {}) => {
      const { whereStr } = filterBuilder(filters, filtersMap.employeeFilters);

      return `SELECT DISTINCT emp1.empid AS EmpID, emp1.fname AS Fname, emp1.lname AS Lname, emp1.title AS Title,
              CONCAT(emp2.fname, ' ', emp2.lname) AS Supervisor, emp2.empid AS SupervisorID, JobsiteName, emp1.JobsiteID AS JobsiteID
              FROM employees as emp1
              LEFT JOIN employees as emp2 
              ON emp1.supervisorid = emp2.empid
              LEFT JOIN jobsites 
              ON emp1.JobsiteID = jobsites.JobsiteID
              ${whereStr} 
              ORDER BY emp1.empid ASC 
              LIMIT :limit OFFSET :offset;`;
    },
  },

  jobsites: {
    count: (filters = {}) => {
      const { whereStr } = filterBuilder(filters, filtersMap.jobsiteFilters);

      return `SELECT COUNT(jobsites.JobsiteID) AS Count FROM jobsites ${whereStr};`;
    },
    query: (filters = {}) => {
      const { whereStr } = filterBuilder(filters, filtersMap.jobsiteFilters);

      return `SELECT jobsites.JobsiteID, jobsites.JobsiteName AS Jobsite, 
              CONCAT(e.fname, ' ', e.lname) AS Supervisor, e.empid AS SupervisorID
              FROM jobsites 
              LEFT JOIN employees e 
              ON jobsites.jobsiteid = e.jobsiteid 
              AND e.Title = 'Site Supervisor'
              ${whereStr} 
              LIMIT :limit OFFSET :offset;`;
    },
  },

  storage_areas: {
    count: (filters = {}) => {
      const { whereStr } = filterBuilder(
        filters,
        filtersMap.storageAreaFilters,
      );

      return `SELECT COUNT(SA.StorageAreaID) AS Count FROM storage_areas AS SA ${whereStr};`;
    },
    query: (filters = {}) => {
      const { whereStr } = filterBuilder(
        filters,
        filtersMap.storageAreaFilters,
      );

      return `SELECT SA.StorageAreaID, SA.Location, j.JobsiteName, SA.JobsiteID, SA.Length, SA.Width, SA.Height, SA.TotalStored, SA.Is_Container
              FROM storage_areas AS SA
              LEFT JOIN jobsites j 
              ON SA.JobsiteID = j.JobsiteID
              ${whereStr} 
              ORDER BY SA.JobsiteID ASC 
              LIMIT :limit OFFSET :offset;`;
    },
  },

  stored_in: {
    count: (filters = {}) => {
      const { joinsStr, whereStr } = filterBuilder(
        filters,
        filtersMap.storedInFilters,
      );

      return `SELECT COUNT(*) AS Count FROM stored_in SI ${joinsStr} ${whereStr};`;
    },
    query: (filters = {}) => {
      const { whereStr } = filterBuilder(filters, filtersMap.storedInFilters);

      return `SELECT SA.StorageAreaID, SA.Location, J.JobsiteID, J.JobsiteName, M.MaterialID, M.Name, M.MaterialType, SI.Amount
              FROM stored_in SI
              JOIN storage_areas SA 
              ON SI.StorageAreaID = SA.StorageAreaID
              JOIN materials M 
              ON SI.MaterialID = M.MaterialID
              JOIN jobsites J 
              ON SA.JobsiteID = J.JobsiteID
              ${whereStr} 
              ORDER BY SA.JobsiteID ASC 
              LIMIT :limit OFFSET :offset;`;
    },
  },
};

module.exports = tables;
