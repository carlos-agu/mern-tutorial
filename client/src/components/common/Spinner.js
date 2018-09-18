import React from "react";
import SpinnerImg from "./spinner.gif";
const Spinner = () => {
  return (
    <div>
      <img
        src={SpinnerImg}
        style={{ width: "200px", margin: "auto", display: "block" }}
        alt="Loading..."
      />
    </div>
  );
};

export default Spinner;
