import { useContext } from "react";
import { DashboardContext } from "../../pages/Dashboard";

function FormButtons({
  setChosenTable,
  chosenTable,
  httpBody,
  setHTTPBody,
  httpMethod,
  useEmpty,
  validate,
}) {
  const { setMethodOption } = useContext(DashboardContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate && !validate()) {
      return;
    }

    useEmpty
      ? httpMethod(httpBody, chosenTable, useEmpty)
      : httpMethod(httpBody, chosenTable);

    setHTTPBody({});
  };

  const closeForm = () => {
    setMethodOption("");
    setChosenTable("");
    setHTTPBody({});
  };

  return (
    <>
      <button type="button" onClick={closeForm}>
        Back
      </button>

      <button type="submit" onClick={handleSubmit}>
        Submit
      </button>
    </>
  );
}

export default FormButtons;
