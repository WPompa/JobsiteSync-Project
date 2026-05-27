//
function SelectTableOptions({ setChosenTable, setHTTPBody }) {
  return (
    <>
      <label htmlFor="table-options">Select a Table: </label>
      <select
        id="table-options"
        onChange={(e) => {
          setChosenTable(e.target.value);
          setHTTPBody({});
        }}
      >
        <option value="">None</option>
        <option value="employees">Employees</option>
        <option value="materials">Materials</option>
        <option value="storedin">Stored In</option>
        <option value="storageareas">Storage Areas</option>
        <option value="jobsites">Jobsites</option>
        {/* <option value="activity_log">Activity Log</option> */}
      </select>
    </>
  );
}

export default SelectTableOptions;
