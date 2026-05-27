export const POST_FIELDS = {
  employees: [
    { name: "EmpID", label: "Emp ID", placeholder: "ex. 123" },
    { name: "Fname", label: "First name", placeholder: "john", required: true },
    { name: "Lname", label: "Last name", placeholder: "doe", required: true },
    { name: "Title", label: "Job Title", placeholder: "journeyman" },
    { name: "SupervisorID", label: "Supervisor ID", placeholder: "ex. 123" },
    { name: "JobsiteID", label: "Jobsite ID", placeholder: "ex. 123" },
  ],
  materials: [
    { name: "MaterialID", label: "Material ID", placeholder: "ex. 123" },
    { name: "Name", label: "Name", placeholder: "brand name 123", required: true },
    { name: "MaterialType", label: "Material Type", placeholder: "insulation, tape...", required: true },
    { name: "Length", label: "Box Length", placeholder: "length inches" },
    { name: "Width", label: "Box Width", placeholder: "width inches" },
    { name: "Height", label: "Box Height", placeholder: "height inches" },
    { name: "SupplierName", label: "Supplier Name", placeholder: "acme inc.", required: true },
    { name: "TotalAvailable", label: "Available", placeholder: "total available" },
    { name: "LostAmounts", label: "Lost", placeholder: "total lost" },
  ],
  storedin: [
    { name: "StorageAreaID", label: "Storage Area ID", placeholder: "ex. 123", required: true },
    { name: "MaterialID", label: "Material ID", placeholder: "ex. 123", required: true },
    { name: "Amount", label: "Amount", placeholder: "ex. 10", required: true },
  ],
  storageareas: [
    { name: "StorageAreaID", label: "Storage Area ID", placeholder: "ex. 123" },
    { name: "Length", label: "Inner Length", placeholder: "length feet" },
    { name: "Width", label: "Inner Width", placeholder: "width feet" },
    { name: "Height", label: "Inner Height", placeholder: "height feet" },
    { name: "Location", label: "Location", placeholder: "laydown 123", required: true },
    { name: "JobsiteID", label: "Jobsite ID", placeholder: "ex. 123" },
    { name: "TotalStored", label: "Total Stored", placeholder: "ex. 10" },
    { name: "Is_Container", label: "Is Container?", placeholder: "true or false" },
  ],
  jobsites: [
    { name: "JobsiteID", label: "Jobsite ID", placeholder: "ex. 123" },
    { name: "JobsiteName", label: "Jobsite Name", placeholder: "abc data center", required: true },
  ],
};

export const PUT_FIELDS = {
  employees: [
    { name: "EmpID", label: "Emp ID(s)", placeholder: "ex. 123, 456", required: true },
    { name: "Fname", label: "First Name", placeholder: "john" },
    { name: "Lname", label: "Last Name", placeholder: "doe" },
    { name: "Title", label: "Job Title", placeholder: "journeyman" },
    { name: "SupervisorID", label: "Supervisor ID", placeholder: "ex. 123" },
    { name: "JobsiteID", label: "Jobsite ID", placeholder: "ex. 123" },
  ],
  materials: [
    { name: "MaterialID", label: "Material ID(s)", placeholder: "ex. 101, 102", required: true },
    { name: "Name", label: "Name", placeholder: "updated material name" },
    { name: "MaterialType", label: "Material Type", placeholder: "insulation, tape..." },
    { name: "Length", label: "Box Length", placeholder: "inches", hasCheckbox: true },
    { name: "Width", label: "Box Width", placeholder: "inches", hasCheckbox: true },
    { name: "Height", label: "Box Height", placeholder: "inches", hasCheckbox: true },
    { name: "SupplierName", label: "Supplier Name", placeholder: "acme inc." },
    { name: "TotalAvailable", label: "Available", placeholder: "ex. 50" },
    { name: "LostAmounts", label: "Lost", placeholder: "ex. 5" },
  ],
  storedin: [
    { name: "StorageAreaID", label: "Storage Area ID", placeholder: "ex. 55", required: true },
    { name: "MaterialID", label: "Material ID", placeholder: "ex. 101", required: true },
    { name: "Amount", label: "Amount", placeholder: "ex. 20" },
  ],
  storageareas: [
    { name: "StorageAreaID", label: "Storage Area ID", placeholder: "ex. 55", required: true },
    { name: "Length", label: "Inner Length", placeholder: "feet", hasCheckbox: true },
    { name: "Width", label: "Inner Width", placeholder: "feet", hasCheckbox: true },
    { name: "Height", label: "Inner Height", placeholder: "feet", hasCheckbox: true },
    { name: "Location", label: "Location", placeholder: "laydown 123" },
    { name: "JobsiteID", label: "Jobsite ID", placeholder: "ex. 123" },
    { name: "TotalStored", label: "Total Stored", placeholder: "ex. 100" },
    { name: "Is_Container", label: "Is Container?", placeholder: "true or false" },
  ],
  jobsites: [
    { name: "JobsiteID", label: "Jobsite ID", placeholder: "ex. 123", required: true },
    { name: "JobsiteName", label: "Jobsite Name", placeholder: "abc data center" },
  ],
};

export const DELETE_FIELDS = {
  employees: [
    { name: "EmpID", label: "Emp ID", placeholder: "ex. 123, 456, ..." },
    { name: "Fname", label: "First name", placeholder: "john, jane, ..." },
    { name: "Lname", label: "Last name", placeholder: "doe, smith, ..." },
    { name: "Title", label: "Job Title", placeholder: "journeyman, ..." },
    { name: "SupervisorID", label: "Supervisor ID", placeholder: "ex. 123, ..." },
    { name: "JobsiteID", label: "Jobsite ID", placeholder: "ex. 123, ..." },
  ],
  materials: [
    { name: "MaterialID", label: "Material ID", placeholder: "ex. 101, 102, ..." },
    { name: "Name", label: "Name", placeholder: "brand name, ..." },
    { name: "MaterialType", label: "Material Type", placeholder: "insulation, tape, ..." },
    { name: "Length", label: "Box Length", placeholder: "inches, ..." },
    { name: "Width", label: "Box Width", placeholder: "inches, ..." },
    { name: "Height", label: "Box Height", placeholder: "inches, ..." },
    { name: "SupplierName", label: "Supplier Name", placeholder: "acme inc, ..." },
    { name: "TotalAvailable", label: "Available", placeholder: "count, ..." },
    { name: "LostAmounts", label: "Lost", placeholder: "count, ..." },
  ],
  storedin: [
    { name: "StorageAreaID", label: "Storage Area ID", placeholder: "ex. 55, 66, ..." },
    { name: "MaterialID", label: "Material ID", placeholder: "ex. 101, 102, ..." },
    { name: "Amount", label: "Amount", placeholder: "ex. 10, 20, ..." },
  ],
  storageareas: [
    { name: "StorageAreaID", label: "Storage Area ID", placeholder: "ex. 55, 66, ..." },
    { name: "Length", label: "Inner Length", placeholder: "feet, ..." },
    { name: "Width", label: "Inner Width", placeholder: "feet, ..." },
    { name: "Height", label: "Inner Height", placeholder: "feet, ..." },
    { name: "Location", label: "Location", placeholder: "laydown 123, ..." },
    { name: "JobsiteID", label: "Jobsite ID", placeholder: "ex. 123, ..." },
    { name: "TotalStored", label: "Total Stored", placeholder: "ex. 10, ..." },
    { name: "Is_Container", label: "Is Container?", placeholder: "true or false" },
  ],
  jobsites: [
    { name: "JobsiteID", label: "Jobsite ID", placeholder: "ex. 123, 456, ..." },
    { name: "JobsiteName", label: "Jobsite Name", placeholder: "abc data center, ..." },
  ],
};


