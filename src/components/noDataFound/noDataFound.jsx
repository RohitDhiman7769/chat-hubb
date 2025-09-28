import React from "react";

const NoDataFound = ({
  message = "No data found",
  subMessage = "",
  icon = "fa-solid fa-database", // default icon
}) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center p-4">
      {/* Icon */}
      <div
        className="mb-3"
        style={{
          fontSize: "3rem",
          color: "#6c757d",
        }}
      >
        <i className={icon}></i>
      </div>

      {/* Main message */}
      <h5 className="fw-bold text-secondary mb-2">{message}</h5>

      {/* Optional sub message */}
      {subMessage && <p className="text-muted small">{subMessage}</p>}
    </div>
  );
};

export default NoDataFound;
