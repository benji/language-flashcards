import React from "react";

export default function Error(props) {
  console.log("Error()");
  console.log(props);

  function errorMessage() {
    if (props.error) return props.error.toString();
    return "(No error message)";
  }

  return (
    <>
      Oh sh*t, I'm broken :(
      <br />
      {errorMessage()}
    </>
  );
}
