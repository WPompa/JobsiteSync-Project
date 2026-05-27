import { useState } from "react";
import { useOptimisticMutation } from "../../../hooks/useOptimisticMutation";
import {
  TopBottom,
  EditTop,
  ToggleEdit,
} from "../../minor-components/TopBottom";
import NoJobsiteImg from "../../../assets/NoJobsiteImg.png";
import styles from "./css/Jobsites.module.css";
import "./css/views.css";

const Jobsites = ({ rowData, rowIndex, tableMeta }) => {
  const [backupData, setBackupData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const {
    JobsiteID,
    Jobsite,
    Supervisor,
    SupervisorID,
    img = NoJobsiteImg,
  } = rowData;

  const { mutate } = useOptimisticMutation("jobsites", "JobsiteID");

  const handleSave = () => {
    const backup = backupData;

    mutate(
      {
        id: JobsiteID,
        payload: { Jobsite },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          setBackupData(null);
        },
        onError: (err) => {
          if (backup) {
            tableMeta.revertRowData(rowIndex, backup);
          }

          setIsEditing(false);
          setBackupData(null);
          alert(
            `Failed to save changes: ${err?.message || "Validation Error"}`,
          );
        },
      },
    );
  };

  const toggleEdit = () => {
    if (!isEditing) {
      setBackupData(JSON.parse(JSON.stringify(rowData)));
    } else {
      if (backupData) {
        tableMeta.revertRowData(rowIndex, backupData);
      }
    }

    setIsEditing((prev) => !prev);
  };

  const handleInputChange = (columnKey, value) => {
    tableMeta.updateRowField(rowIndex, columnKey, value);
  };

  return (
    <div className={`views-common ${styles["jobsites-container"]}`}>
      <div className={`grid-item item-img-id ${styles["item-img-id"]}`}>
        <div className="data-img-container">
          <img
            className="data-img"
            src={img}
            alt={`Jobsite ${JobsiteID} image`}
          />
        </div>

        <p className="data-id">ID: {JobsiteID}</p>

        <ToggleEdit
          isEditing={isEditing}
          toggleEdit={toggleEdit}
          handleSave={handleSave}
        />
      </div>

      <div className={`grid-item ${styles["item-divider"]}`}>
        <div className="divider"></div>
      </div>

      <div className={`grid-item ${styles["item-jobsite-super"]}`}>
        {isEditing ? (
          <EditTop
            value={Jobsite}
            columnKey="Jobsite"
            placeholder="Jobsite Name"
            handleChange={handleInputChange}
          />
        ) : (
          <TopBottom
            top={Jobsite}
            bottom={"JOBSITE"}
            altClass={styles["jobsite-name"]}
          />
        )}

        <TopBottom
          top={Supervisor}
          bottom={"SUPERVISOR"}
          altClass={styles["supervisor"]}
          tooltip={SupervisorID}
          tooltipTitle={"ID"}
        />
      </div>
    </div>
  );
};

export default Jobsites;
