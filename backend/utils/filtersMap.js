// Simple starting point for future filtering implementation. Before complex ANDs, ORs, and INs.

const leadershipFilters = {
  JobsiteID: {
    where: "emp1.JobsiteID = :JobsiteID",
  },
  Title: {
    where: "emp1.title = :Title",
  },
};

const employeeFilters = {
  JobsiteID: {
    where: "emp1.JobsiteID = :JobsiteID",
  },
  Title: {
    where: "emp1.title = :Title",
  },
  SupervisorID: {
    where: "emp1.supervisorid = :SupervisorID",
  },
};

const jobsiteFilters = {
  JobsiteID: {
    where: "jobsites.JobsiteID = :JobsiteID",
  },
};

const storageAreaFilters = {
  JobsiteID: {
    where: "SA.JobsiteID = :JobsiteID",
  },
  IsContainer: {
    where: "SA.Is_Container = :IsContainer",
  },
};

const storedInFilters = {
  JobsiteID: {
    where: "SA.JobsiteID = :JobsiteID",
    joins: ["JOIN storage_areas SA ON SI.StorageAreaID = SA.StorageAreaID"],
  },
  StorageAreaID: {
    where: "SI.StorageAreaID = :StorageAreaID",
  },
  MaterialType: {
    where: "M.MaterialType = :MaterialType",
    joins: ["JOIN materials M ON SI.MaterialID = M.MaterialID"],
  },
  MaterialName: {
    where: "M.Name LIKE :MaterialName",
    joins: ["JOIN materials M ON SI.MaterialID = M.MaterialID"],
  },
};

module.exports = {
  leadershipFilters,
  employeeFilters,
  jobsiteFilters,
  storageAreaFilters,
  storedInFilters,
};
