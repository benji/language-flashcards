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
import { useDrag, useDrop } from "react-dnd";

import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ListFlashcards.scss";

const FLASHCARD_TYPE = "FLASHCARD";

function FlashcardListItem(props) {
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: FLASHCARD_TYPE,

    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = props.index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      props.moveFlashcard(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    }
  });

  const [{ isDragging }, drag] = useDrag({
    item: { type: FLASHCARD_TYPE, id: props.flashcardId, index: props.index },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });

  const style = isDragging ? { backgroundColor: "transparent" } : {};

  drag(drop(ref));

  return (
    <li
      style={style}
      ref={ref}
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
