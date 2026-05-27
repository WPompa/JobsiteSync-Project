import { useState } from "react";
import { useOptimisticMutation } from "../../../hooks/useOptimisticMutation";
import {
  TopBottom,
  EditTop,
  ToggleEdit,
} from "../../minor-components/TopBottom";
import NoPersonalImg from "../../../assets/NoPersonalImg.png";
import styles from "./css/Employees.module.css";
import "./css/views.css";

const Employees = ({ rowData, rowIndex, tableMeta }) => {
  const [backupData, setBackupData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const {
    EmpID,
    Fname,
    Lname,
    Title,
    Supervisor,
    SupervisorID,
    JobsiteName,
    JobsiteID,
    img = NoPersonalImg,
  } = rowData;

  const { mutate } = useOptimisticMutation("employees", "EmpID");

  const handleSave = () => {
    const backup = backupData;

    mutate(
      {
        id: EmpID,
        payload: { Fname, Lname, Title },
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
    <div className={`views-common ${styles["employees-container"]}`}>
      <div className={`grid-item item-img-id ${styles["item-img-id"]}`}>
        <div className="data-img-container">
          <img className="data-img" src={img} alt={`Employee ${EmpID} image`} />
        </div>

        <p className="data-id">ID: {EmpID}</p>

        <ToggleEdit
          isEditing={isEditing}
          toggleEdit={toggleEdit}
          handleSave={handleSave}
        />
      </div>

      <div className={`grid-item ${styles["item-divider"]}`}>
        <div className="divider"></div>
      </div>

      <div className={`grid-item ${styles["item-name"]}`}>
        {isEditing ? (
          <div className="editable-input-group">
            <EditTop
              value={Fname}
              columnKey="Fname"
              placeholder="First Name"
              handleChange={handleInputChange}
            />
            <EditTop
              value={Lname}
              columnKey="Lname"
              placeholder="Last Name"
              handleChange={handleInputChange}
            />
          </div>
        ) : (
          <TopBottom
            top={Fname + " " + Lname}
            bottom={"NAME"}
            altClass={styles["name"]}
          />
        )}
      </div>

      <div className={`grid-item ${styles["item-title"]}`}>
        {isEditing ? (
          <EditTop
            value={Title}
            columnKey="Title"
            placeholder="Job Title"
            handleChange={handleInputChange}
          />
        ) : (
          <TopBottom top={Title} bottom={"TITLE"} altClass={styles["title"]} />
        )}
      </div>

      <div className={`grid-item ${styles["item-jobsite"]}`}>
        <TopBottom
          top={JobsiteName}
          bottom={"JOBSITE"}
          altClass={styles["jobsite"]}
          tooltip={JobsiteID}
          tooltipTitle={"ID"}
        />
      </div>

      <div className={`grid-item ${styles["item-supervisor"]}`}>
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

export default Employees;
