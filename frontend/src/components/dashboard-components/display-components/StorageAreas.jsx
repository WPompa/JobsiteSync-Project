import { useState } from "react";
import { useOptimisticMutation } from "../../../hooks/useOptimisticMutation";
import {
  TopBottom,
  EditTop,
  ToggleEdit,
} from "../../minor-components/TopBottom";
import NoStorageAreaImg from "../../../assets/NoStorageAreaImg.png";
import styles from "./css/StorageAreas.module.css";
import "./css/views.css";

const StorageAreas = ({ rowData, rowIndex, tableMeta }) => {
  const [backupData, setBackupData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const {
    StorageAreaID,
    Location,
    JobsiteName,
    JobsiteID,
    Length,
    Width,
    Height,
    TotalStored,
    Is_Container,
    img = NoStorageAreaImg,
  } = rowData;

  const { mutate } = useOptimisticMutation("storageareas", "StorageAreaID");

  const handleSave = () => {
    let containerValue = Is_Container.toString().toLowerCase();

    if (containerValue) {
      switch (containerValue) {
        case "true":
        case "false":
          containerValue = JSON.parse(containerValue);
          break;
        case "yes":
        case "no":
          containerValue = containerValue === "yes" ? true : false;
          break;
        default:
          containerValue = parseInt(containerValue);
      }
    }

    const backup = backupData;

    mutate(
      {
        id: StorageAreaID,
        payload: {
          Location,
          Length,
          Width,
          Height,
          TotalStored,
          Is_Container: containerValue,
        },
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
    <div className={` views-common ${styles["storageareas-container"]}`}>
      <div className={`grid-item item-img-id ${styles["item-img-id"]}`}>
        <div className="data-img-container">
          <img
            className="data-img"
            src={img}
            alt={`StorageArea ${StorageAreaID} image`}
          />
        </div>

        <p className="data-id">ID: {StorageAreaID}</p>

        <ToggleEdit
          isEditing={isEditing}
          toggleEdit={toggleEdit}
          handleSave={handleSave}
        />
      </div>

      <div className={`grid-item ${styles["item-divider"]}`}>
        <div className="divider"></div>
      </div>

      <div className={`grid-item ${styles["item-location-jobsite-container"]}`}>
        {isEditing ? (
          <div className="editable-input-group flex-row-group flex-col-mobile">
            <EditTop
              value={Location}
              columnKey="Location"
              placeholder="Location"
              handleChange={handleInputChange}
            />
            <EditTop
              value={Is_Container}
              columnKey="Is_Container"
              placeholder="Container? true or false"
              handleChange={handleInputChange}
            />
          </div>
        ) : (
          <>
            <TopBottom
              top={Location}
              bottom={"LOCATION"}
              altClass={"Location"}
            />
            <TopBottom
              top={JobsiteName}
              bottom={"JOBSITE"}
              altClass={"jobsite"}
              tooltip={JobsiteID}
              tooltipTitle={"ID"}
            />
            <TopBottom
              top={Is_Container ? "YES" : "NO"}
              bottom={"CONTAINER?"}
              altClass={"container"}
            />
          </>
        )}
      </div>

      <div className={`grid-item ${styles["item-l-w-h"]}`}>
        {isEditing ? (
          <div className="editable-input-group flex-row-group">
            <EditTop
              value={Length}
              columnKey="Length"
              placeholder="Length"
              handleChange={handleInputChange}
            />
            <EditTop
              value={Width}
              columnKey="Width"
              placeholder="Width"
              handleChange={handleInputChange}
            />
            <EditTop
              value={Height}
              columnKey="Height"
              placeholder="Height"
              handleChange={handleInputChange}
            />
          </div>
        ) : (
          <>
            <TopBottom top={Length} bottom={"LENGTH"} altClass={"length"} />
            <TopBottom top={Width} bottom={"WIDTH"} altClass={"width"} />
            <TopBottom top={Height} bottom={"HEIGHT"} altClass={"height"} />
          </>
        )}
      </div>

      <div className={`grid-item ${styles["item-divider"]}`}>
        <div className="divider"></div>
      </div>

      <div className={`grid-item ${styles["item-stored"]}`}>
        {isEditing ? (
          <EditTop
            value={TotalStored}
            columnKey="TotalStored"
            placeholder="Stored Units"
            handleChange={handleInputChange}
          />
        ) : (
          <TopBottom
            top={TotalStored}
            bottom={"Stored Units"}
            altClass={styles["total-stored"]}
          />
        )}
      </div>
    </div>
  );
};

export default StorageAreas;
