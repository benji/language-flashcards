import React, { useState, useRef, useEffect } from "react";
import { withRouter } from "react-router";
import AppContext from "./AppContext";
import Utils from "./Utils";

import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function PageTitle(props) {
  function back() {
    console.log("back");
    props.history.push(props.backLink);
  }

  return (
    <h3>
      {props.backLink ? (
        <FontAwesomeIcon
          icon={faPlay}
          rotation={180}
          onClick={back}
          className="l-icon-action"
          style={{ marginRight: ".5em" }}
        />
      ) : (
        <></>
      )}
      {props.title}
    </h3>
  );
}

export default withRouter(PageTitle);
