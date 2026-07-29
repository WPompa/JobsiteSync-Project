import { TopBottom } from "../../minor-components/TopBottom";
import styles from "./css/ActivityLogs.module.css";
import "./css/views.css";

const ActivityLogs = ({ rowData, rowIndex, tableMeta }) => {
  const {
    LogID,
    ActionType,
    MaterialName,
    StorageLocation,
    JobsiteName,
    QuantityChanged,
    HandledBy,
    Timestamp,
  } = rowData;

  const formattedTimestamp = new Date(Timestamp).toLocaleString();

  return (
    <div className={`views-common ${styles["activityLogs-container"]}`}>
      <div className={`grid-item item-img-id ${styles["item-img-id"]}`}>
        <p className={`${styles["item-actiontype"]}`}>{ActionType}</p>

        <p className={`${styles["item-timestamp"]}`}>{formattedTimestamp}</p>

        <p className="data-id">ID: {LogID}</p>
      </div>

      <div className={`grid-item ${styles["item-divider"]}`}>
        <div className="divider"></div>
      </div>

      <div className={`grid-item ${styles["item-material-location-jobsite"]}`}>
        <>
          <TopBottom
            top={MaterialName}
            bottom={"Material"}
            altClass={styles["material"]}
          />
          <TopBottom
            top={StorageLocation}
            bottom={"Location"}
            altClass={styles["location"]}
          />
          <TopBottom
            top={JobsiteName}
            bottom={"Jobsite"}
            altClass={styles["jobsite"]}
          />
        </>
      </div>

      <div className={`grid-item ${styles["item-divider"]}`}>
        <div className="divider"></div>
      </div>

      <div className={`grid-item ${styles["item-timestamp-handledby"]}`}>
        <TopBottom
          top={QuantityChanged}
          bottom={"Quantity Changed"}
          altClass={styles["quantitychanged"]}
        />

        <TopBottom
          top={HandledBy}
          bottom={"Handled By"}
          altClass={styles["handledby"]}
        />
      </div>
    </div>
  );
};

export default ActivityLogs;
