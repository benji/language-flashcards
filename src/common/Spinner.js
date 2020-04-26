import React from "react";
import RingLoader from "react-spinners/RingLoader";

export default function Spinner(props) {
  const spinnerCss = {
    margin: "3em auto",
    display: "table"
  };

  return (
    <RingLoader
      size={150}
      color={"#ec82ae"}
      loading={props.loading}
      css={spinnerCss}
    />
  );
}
