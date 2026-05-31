//
import TableWrapper from "./display-components/TableWrapper";
import Employees from "./display-components/Employees";
import Jobsites from "./display-components/Jobsites";
import StorageAreas from "./display-components/StorageAreas";
import Materials from "./display-components/Materials";
import StoredIn from "./display-components/StoredIn";
import Leadership from "./display-components/Leadership";

const viewMap = {
  employees: Employees,
  leadership: Leadership,
  materials: Materials,
  jobsites: Jobsites,
  storageareas: StorageAreas,
  storedin: StoredIn,
};

const DisplayData = ({ tableToDisplay, data, dataUpdatedAt }) => {
  if (!tableToDisplay) {
    return (
      <div className="display-message">
        <p>No table selected</p>
      </div>
    );
  }

  const CurrentView = viewMap[tableToDisplay];

  if (CurrentView && data?.status === "success") {
    if (!data.result || data.result.length === 0) {
      return (
        <div className="display-message">
          <p>No records found for {tableToDisplay}.</p>
        </div>
      );
    }

    return (
      <TableWrapper
        key={`${tableToDisplay}-${dataUpdatedAt}`}
        tableToDisplay={tableToDisplay}
        dataToDisplay={data.result}
        CurrentView={CurrentView}
      />
    );
  }

  return (
    <div className="display-message">
      <p>Something Went Wrong!</p>
    </div>
  );
};

export default DisplayData;
