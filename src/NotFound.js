import React from "react";

const styles = {
  marginTop: "2em",
  textAlign: "center"
};

export default function(props) {
  console.log("404");
  console.log(props);
  return <div style={styles}>404</div>;
}
