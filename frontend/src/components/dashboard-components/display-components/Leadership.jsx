import styles from "./css/Leadership.module.css";
import "./css/views.css";
import NoPersonalImg from "../../../assets/NoPersonalImg.png";
import TopBottom from "../../minor-components/TopBottom";

const Leadership = ({ rowData, rowIndex, tableMeta }) => {
  const {
    EmpID,
    Name,
    Title,
    JobsiteID,
    JobsiteName,
    img = NoPersonalImg,
  } = rowData;
  return (
    <div className={`views-common ${styles["leadership-container"]}`}>
      <div className={`grid-item item-img-id ${styles["item-img-id"]}`}>
        <div className="data-img-container">
          <img className="data-img" src={img} alt={`Employee ${EmpID} image`} />
        </div>

        <p className="data-id">ID: {EmpID}</p>
      </div>

      <div className={`grid-item ${styles["item-divider"]}`}>
        <div className="divider"></div>
      </div>

      <div className={`grid-item ${styles["item-name"]}`}>
        <TopBottom top={Name} bottom={"NAME"} altClass={styles["name"]} />
      </div>

      <div className={`grid-item ${styles["item-title"]}`}>
        <TopBottom top={Title} bottom={"TITLE"} altClass={styles["title"]} />
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
    </div>
  );
};

export default Leadership;
