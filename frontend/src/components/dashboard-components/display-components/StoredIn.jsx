import { useState } from "react";
import { useOptimisticMutation } from "../../../hooks/useOptimisticMutation";
import {
  TopBottom,
  EditTop,
  ToggleEdit,
} from "../../minor-components/TopBottom";
import NoStorageAreaImg from "../../../assets/NoStorageAreaImg.png";
import NoMaterialImg from "../../../assets/NoMaterialImg.png";
import styles from "./css/StoredIn.module.css";
import "./css/views.css";

const StoredIn = ({ rowData, rowIndex, tableMeta }) => {
  const [backupData, setBackupData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const {
    StorageAreaID,
    Location,
    JobsiteID,
    JobsiteName,
    MaterialID,
    Name,
    MaterialType,
    Amount,
    imgSArea = NoStorageAreaImg,
    imgMat = NoMaterialImg,
  } = rowData;

  const { mutate } = useOptimisticMutation("storedin", [
    "StorageAreaID",
    "MaterialID",
  ]);

  const handleSave = () => {
    const backup = backupData;

    mutate(
      {
        id: { StorageAreaID, MaterialID },
        payload: { Amount },
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
    <div className={`views-common ${styles["storedin-container"]}`}>
      <div className={`grid-item item-img-id ${styles["item-imgSArea"]}`}>
        <div className="data-img-container">
          <img
            className="data-img"
            src={imgSArea}
            alt={`StorageArea ${StorageAreaID} image`}
          />
        </div>

        <p className="data-id">
          <span className="tooltip">
            ID: {StorageAreaID}-{MaterialID}
            <span className="tooltip-text">StorageAreaID-MaterialID</span>
          </span>
        </p>
      </div>

      <div className={`grid-item ${styles["item-location-jobsite"]}`}>
        <TopBottom
          top={Location}
          bottom={"LOCATION"}
          altClass={styles["location"]}
          tooltip={StorageAreaID}
          tooltipTitle={"ID"}
        />

        <TopBottom
          top={JobsiteName}
          bottom={"JOBSITE"}
          altClass={styles["jobsite"]}
          tooltip={JobsiteID}
          tooltipTitle={"ID"}
        />
      </div>

      <div className={`grid-item ${styles["item-divider"]}`}>
        <div className="divider"></div>
      </div>

      <div className={`grid-item item-img-id ${styles["item-imgMat"]}`}>
        <div className="data-img-container">
          <img
            className="data-img"
            src={imgMat}
            alt={`Material ${MaterialID} image`}
          />
        </div>
      </div>

      <div className={`grid-item ${styles["item-name-type"]}`}>
        <TopBottom
          top={Name}
          bottom={"BRAND"}
          altClass={styles["name"]}
          tooltip={MaterialID}
          tooltipTitle={"ID"}
        />

        <TopBottom
          top={MaterialType}
          bottom={"TYPE"}
          altClass={styles["type"]}
        />
      </div>

      <div className={`grid-item ${styles["item-divider"]}`}>
        <div className="divider"></div>
      </div>
      <div className={`grid-item ${styles["item-amount"]}`}>
        {isEditing ? (
          <EditTop
            value={Amount}
            columnKey="Amount"
            placeholder="Amount"
            handleChange={handleInputChange}
          />
        ) : (
          <TopBottom
            top={Amount}
            bottom={"STOCK"}
            altClass={styles["amount"]}
          />
        )}

        <ToggleEdit
          isEditing={isEditing}
          toggleEdit={toggleEdit}
          handleSave={handleSave}
        />
      </div>
    </div>
  );
};

export default StoredIn;
