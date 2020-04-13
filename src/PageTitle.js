import React from "react";
import { withRouter } from "react-router";
import Utils from "./Utils";

import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function PageTitle(props) {
  function back() {
    Utils.goto(props, props.backLink);
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
