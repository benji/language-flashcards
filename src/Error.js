import React from "react";
import PageTitle from "./PageTitle";

export default function Error(props) {
  console.log("Error()");

  function errorMessage() {
    const e = props.error;
    if (!e) return "(No error message)";
    if (e instanceof String) return e;
    return JSON.stringify(e);
  }

  return (
    <>
      <div style={{ margin: "5em auto", color: "#ca0e0e" }}>
        Oh sh*t, something bad happened :o(
        <br />
        {errorMessage()}
      </div>
    </>
  );
}
