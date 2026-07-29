import { useState } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";

const getID = (rowData, tableToDisplay) => {
  switch (tableToDisplay) {
    case "employees":
      return `employees-${rowData.EmpID}`;
    case "leadership":
      return `leadership-${rowData.EmpID}`;
    case "materials":
      return `materials-${rowData.MaterialID}`;
    case "jobsites":
      return `jobsites-${rowData.JobsiteID}`;
    case "storageareas":
      return `storageareas-${rowData.StorageAreaID}`;
    case "storedin":
      return `${rowData.StorageAreaID}-${rowData.JobsiteID}-${rowData.MaterialID}`;
    case "activitylogs":
      return `${rowData.LogID}`;
    default:
      throw new Error("No Obtainable Row ID!");
  }
};

const TableWrapper = ({ tableToDisplay, dataToDisplay, CurrentView }) => {
  const [rows, setRows] = useState(dataToDisplay);

  const table = useReactTable({
    data: rows,
    columns: [],
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateRowField: (rowIndex, columnKey, value) => {
        setRows((prev) =>
          prev.map((row, index) =>
            index === rowIndex ? { ...row, [columnKey]: value } : row,
          ),
        );
      },
      revertRowData: (rowIndex, originalRowData) => {
        setRows((prev) =>
          prev.map((row, index) =>
            index === rowIndex ? originalRowData : row,
          ),
        );
      },
    },
  });

  return (
    <>
      {table.getRowModel().rows.map((row, index) => (
        <CurrentView
          key={getID(row.original, tableToDisplay)}
          rowData={row.original}
          rowIndex={index}
          tableMeta={table.options.meta}
        />
      ))}
    </>
  );
};

export default TableWrapper;
