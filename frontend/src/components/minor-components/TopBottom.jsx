import "./css/top-bottom.css";

export const TopBottom = ({
  top,
  bottom,
  altClass,
  tooltip = "",
  ...props
}) => {
  return (
    <div className={`topbottom-container ${altClass}`}>
      <p className="top">
        {tooltip ? (
          <span className="tooltip">
            {top}
            <span className="tooltip-text">
              {`${props.tooltipTitle}: ` + tooltip}
            </span>
          </span>
        ) : (
          top
        )}
      </p>
      <p className="bottom">{bottom}</p>
    </div>
  );
};

export const EditTop = ({
  value,
  columnKey,
  placeholder = "",
  handleChange,
}) => {
  return (
    <input
      className="edit-top"
      value={value || ""}
      onChange={(e) => {
        handleChange(columnKey, e.target.value);
      }}
      placeholder={value || placeholder}
    />
  );
};

export const ToggleEdit = ({ isEditing, toggleEdit, handleSave }) => {
  return (
    <div className="edit-toggle">
      {isEditing ? (
        <>
          <button onClick={handleSave} className="save card-btn">
            Save
          </button>
          <button onClick={toggleEdit} className="cancel card-btn">
            Cancel
          </button>
        </>
      ) : (
        <button onClick={toggleEdit} className="edit card-btn">
          Edit
        </button>
      )}
    </div>
  );
};

export default TopBottom;
