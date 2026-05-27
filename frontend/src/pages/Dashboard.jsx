import React, { useState, useRef, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DisplayData from "../components/dashboard-components/DisplayData";
import PostForms from "../components/dashboard-components/PostForms";
import PutForms from "../components/dashboard-components/PutForms";
import DeleteForms from "../components/dashboard-components/DeleteForms";
import CurrentPage from "../components/minor-components/CurrentPage";
import CurrentLimit from "../components/minor-components/CurrentLimit";
import ErrorModal from "../components/minor-components/ErrorModal";
import Loading from "../components/dashboard-components/Loading";
import { api } from "../services/API-Service";
import { useDashboardParams } from "../hooks/useDashboardParams";
import "./css/dashboard.css";
export const DashboardContext = React.createContext();

const DBTableNames = {
  Employees: "employees",
  Materials: "materials",
  "Stored In": "storedin",
  "Storage Areas": "storageareas",
  Jobsites: "jobsites",
  Leadership: "leadership",
};

const Dashboard = () => {
  let backgroundDivRef = useRef(false);
  const [methodOption, setMethodOption] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", body: "" });
  const queryClient = useQueryClient();
  const activeTable = table === "leadership" ? "other" : table;
  const queryString = searchParams.toString();
  const { page, limit, table, updateParams, searchParams } =
    useDashboardParams();

  /////////////////////////////////////////////

  const handleUIError = (error) => {
    setShowModal(true);
    setModalContent({
      title: error.status || "Missing Error Status",
      body: error.message || "Missing Error Message.",
    });
  };

  const {
    data: responseData,
    isLoading,
    error,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ["dashboardData", activeTable, queryString],
    queryFn: () => api.get(`${activeTable}?${queryString}`),
    enabled: !!table,
    refetchOnWindowFocus: false,
    //refetchInterval,
    //refetchIntervalInBackground,
  });

  if (error) {
    handleUIError(error);
  }

  const data = responseData || [];
  const metadata = responseData?.pagination;

  /////////////////////////////////////////////

  const changeDisplayedTable = (e) => {
    let newTable = e.target.value;

    if (newTable) {
      backgroundDivRef.current = true;
      updateParams({ table: newTable, page: 1 });
    } else {
      backgroundDivRef.current = false;
      updateParams({ table: "" });
    }
  };

  const changePageValue = (value) => {
    const totalCount = metadata?.totalCount || 0;
    const maxPages = Math.ceil(totalCount / limit);
    const nextPage = page + value;

    if (nextPage < 1 || nextPage > maxPages) return;

    updateParams({ page: nextPage });
  };

  const reloadDataContainer = () => {
    queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
    console.log("reload");
  };

  //////////////////////////////////////////////////////////////////////////////////////////

  const methodHelper = async (body, table, httpMethod, useEmpty = false) => {
    try {
      const response = await httpMethod(
        table,
        useEmpty ? { body, table, useEmpty } : { body },
      );

      reloadDataContainer();
      console.log(response);
    } catch (error) {
      handleUIError(error);
    }
  };

  const postMethod = async (postBody, table) => {
    methodHelper(postBody, table, api.post);
  };

  const deleteMethod = async (deleteBody, table) => {
    methodHelper(deleteBody, table, api.delete);
  };

  const putMethod = async (putBody, table, useEmpty) => {
    methodHelper(putBody, table, api.put, useEmpty);
  };

  //////////////////////////////////////////////////////////////////////////////////////////

  return (
    <DashboardContext.Provider
      value={{
        setMethodOption,
        postMethod,
        putMethod,
        deleteMethod,
      }}
    >
      <div className="dashboard-container">
        {showModal && (
          <ErrorModal
            setShowModal={setShowModal}
            title={modalContent.title}
            body={modalContent.body}
          />
        )}
        <div className="select-container dashboard-item">
          <div className="select-table">
            <label htmlFor="tables">Select a Table: </label>
            <select
              name="tables"
              id="tables"
              value={table}
              onChange={changeDisplayedTable}
            >
              <option value="">None</option>
              {Object.keys(DBTableNames).map((tableName) => (
                <option key={tableName} value={DBTableNames[tableName]}>
                  {tableName}
                </option>
              ))}
            </select>
          </div>

          <div className="pagination-items">
            <CurrentPage
              value={page}
              metadata={metadata}
              limit={limit}
              function={updateParams}
            />

            <CurrentLimit value={limit} function={updateParams} />
          </div>
        </div>

        <div className="dashboard-item dashboard-data-container">
          <div
            className={` ${backgroundDivRef.current ? "background-div" : "display-overlay"}`}
          >
            {isLoading ? (
              <Loading />
            ) : (
              <DisplayData
                tableToDisplay={table}
                data={data}
                dataUpdatedAt={dataUpdatedAt}
              />
            )}
          </div>
        </div>

        <div className="dashboard-item dashboard-input-container">
          {metadata && (
            <div className="pagination-info">
              Showing {(page - 1) * limit + 1} -{" "}
              {Math.min(page * limit, metadata?.totalCount)} of{" "}
              {metadata?.totalCount}
            </div>
          )}
          <div className="dashboard-input-controls">
            <button
              type="button"
              className="page-btn"
              disabled={page <= 1}
              onClick={() => {
                changePageValue(-1);
              }}
            >
              &lt;
            </button>

            {methodOption === "" ? (
              <DisplayQueryButtons
                setMethodOption={setMethodOption}
                reloadDataContainer={reloadDataContainer}
              />
            ) : (
              <div className="dashboard-form-container">
                {methodOption === "post" && <PostForms />}
                {methodOption === "put" && <PutForms />}
                {methodOption === "delete" && <DeleteForms />}
              </div>
            )}

            <button
              type="button"
              className="page-btn"
              disabled={page >= Math.ceil(metadata?.totalCount / limit)}
              onClick={() => {
                changePageValue(1);
              }}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </DashboardContext.Provider>
  );
};

const DisplayQueryButtons = ({ setMethodOption, reloadDataContainer }) => {
  return (
    <div className="dashboard-btn-container">
      <button
        type="button"
        className="dashboard-btn add-btn"
        onClick={() => setMethodOption("post")}
      >
        Add
      </button>

      <button
        type="button"
        className="dashboard-btn change-btn"
        onClick={() => setMethodOption("put")}
      >
        Change
      </button>

      <button
        type="button"
        className="dashboard-btn delete-btn"
        onClick={() => setMethodOption("delete")}
      >
        Delete
      </button>

      <button
        type="button"
        className="dashboard-btn"
        id="reload-btn"
        onClick={() => reloadDataContainer()}
      >
        Reload
      </button>
    </div>
  );
};

export default Dashboard;
