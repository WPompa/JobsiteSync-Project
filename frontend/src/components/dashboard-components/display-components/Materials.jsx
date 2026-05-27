import { useState } from "react";
import { useOptimisticMutation } from "../../../hooks/useOptimisticMutation";
import {
  TopBottom,
  EditTop,
  ToggleEdit,
} from "../../minor-components/TopBottom";
import NoMaterialImg from "../../../assets/NoMaterialImg.png";
import styles from "./css/Materials.module.css";
import "./css/views.css";

const Materials = ({ rowData, rowIndex, tableMeta }) => {
  const [backupData, setBackupData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const {
    MaterialID,
    Name,
    MaterialType,
    Length,
    Width,
    Height,
    SupplierName,
    TotalAvailable,
    LostAmounts,
    img = NoMaterialImg,
  } = rowData;

  const { mutate } = useOptimisticMutation("materials", "MaterialID");

  const handleSave = () => {
    const backup = backupData;

    mutate(
      {
        id: MaterialID,
        payload: {
          Name,
          MaterialType,
          Length,
          Width,
          Height,
          SupplierName,
          TotalAvailable,
          LostAmounts,
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
    <div className={` views-common ${styles["materials-container"]}`}>
      <div className={`grid-item item-img-id ${styles["item-img-id"]}`}>
        <div className="data-img-container">
          <img
            className="data-img"
            src={img}
            alt={`Material ${MaterialID} image`}
          />
        </div>

        <p className="data-id">ID: {MaterialID}</p>

        <ToggleEdit
          isEditing={isEditing}
          toggleEdit={toggleEdit}
          handleSave={handleSave}
        />
      </div>

      <div className={`grid-item ${styles["item-divider"]}`}>
        <div className="divider"></div>
      </div>

      <div className={`grid-item ${styles["item-name-supp"]}`}>
        {isEditing ? (
          <div className="editable-input-group flex-row-group flex-col-mobile">
            <EditTop
              value={Name}
              columnKey="Name"
              placeholder="Brand Name"
              handleChange={handleInputChange}
            />
            <EditTop
              value={SupplierName}
              columnKey="SupplierName"
              placeholder="Supplier"
              handleChange={handleInputChange}
            />
          </div>
        ) : (
          <>
            <TopBottom top={Name} bottom={"BRAND"} altClass={"name"} />
            <TopBottom
              top={SupplierName}
              bottom={"SUPPLIER"}
              altClass={"supplierName"}
            />
          </>
        )}
      </div>

      <div className={`grid-item ${styles["item-type-l-w-h"]}`}>
        {isEditing ? (
          <div className="editable-input-group flex-row-group">
            <EditTop
              value={MaterialType}
              columnKey="MaterialType"
              placeholder="Material Type"
              handleChange={handleInputChange}
            />
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
            <TopBottom
              top={MaterialType}
              bottom={"MATERIAL TYPE"}
              altClass={"materialType"}
            />
            <TopBottom top={Length} bottom={"LENGTH"} altClass={"length"} />
            <TopBottom top={Width} bottom={"WIDTH"} altClass={"width"} />
            <TopBottom top={Height} bottom={"HEIGHT"} altClass={"height"} />
          </>
        )}
      </div>

      <div className={`grid-item ${styles["item-divider"]}`}>
        <div className="divider"></div>
      </div>

      <div className={`grid-item ${styles["item-avail-lost"]}`}>
        {isEditing ? (
          <div className="editable-input-group">
            <EditTop
              value={TotalAvailable}
              columnKey="TotalAvailable"
              placeholder="Available"
              handleChange={handleInputChange}
            />
            <EditTop
              value={LostAmounts}
              columnKey="LostAmounts"
              placeholder="Trashed"
              handleChange={handleInputChange}
            />
          </div>
        ) : (
          <>
            <TopBottom
              top={TotalAvailable}
              bottom={"AVAILABLE"}
              altClass={styles["totalAvailable"]}
            />
            <TopBottom
              top={LostAmounts}
              bottom={"TRASHED"}
              altClass={styles["LostAmounts"]}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Materials;
