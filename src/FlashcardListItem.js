import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import flash_store from "./FlashStore";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { withRouter } from "react-router";
import AppContext from "./AppContext";
import Utils from "./Utils";

import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ListFlashcards.scss";

function FlashcardListItem(props) {
  return (
    <li
      key={props.flashcardId}
      onClick={Utils.gotoFn(props, `/flashcards/${props.flashcardName}`)}
    >
      <span className="fcItemName">{props.flashcardName}</span>
      <span className="fcItemIcon">
        <FontAwesomeIcon icon={faPlay} size="sm" className="faIcon" />
      </span>
    </li>
  );
}

export default withRouter(FlashcardListItem);
