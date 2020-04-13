import React, { useRef } from "react";
import { withRouter } from "react-router";
import Utils from "./Utils";
import { useDrag, useDrop } from "react-dnd";

import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ListFlashcards.scss";

import store from "./services/FlashcardStore";

const FLASHCARD_TYPE = "FLASHCARD";

function FlashcardListItem(props) {
  console.log("--FlashcardListItem--");
  const ref = useRef(null);

  //store.useState(store.DRAGGED_FLASHCARD_ID);

  const [, drop] = useDrop({
    accept: FLASHCARD_TYPE,

    drop(item, monitor) {
      props.onDropFlashcard();
      store.set(store.DRAGGED_FLASHCARD_ID, null);
    },

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

  let [{ isDragging }, drag] = useDrag({
    item: { type: FLASHCARD_TYPE, id: props.flashcardId, index: props.index },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });
  //setDragging(isDragging);

  drag(drop(ref));

  let onMouseDownTimeout = null;

  const onMouseDown = id => () => {
    onMouseDownTimeout = setTimeout(() => {
      console.log("onMouseDown -> setDraggedId to " + id);
      store.set(store.DRAGGED_FLASHCARD_ID, id);
    }, 100);
  };
  const onMouseUp = id => () => {
    console.log("onMouseUp -> setDraggedId to null");
    clearInterval(onMouseDownTimeout);
    store.set(store.DRAGGED_FLASHCARD_ID, null);
  };

  const classNames = [];
  if (store.get(store.DRAGGED_FLASHCARD_ID) == props.flashcardId) {
    classNames.push("flashcardDragged");
  }
  if (store.get(store.DRAGGED_FLASHCARD_ID) === null) {
    classNames.push("noOngoingDrag");
  }

  return (
    <li
      ref={ref}
      key={props.flashcardId}
      onClick={Utils.gotoFn(props, `/flashcards/${props.flashcardName}`)}
      className={classNames}
      onMouseDown={onMouseDown(props.flashcardId)}
      onMouseUp={onMouseUp(props.flashcardId)}
      onTouchStart={onMouseDown(props.flashcardId)}
      onTouchEnd={onMouseUp(props.flashcardId)}
    >
      <span className="fcItemName">{props.flashcardName}</span>
      <span className="fcItemIcon">
        <FontAwesomeIcon icon={faPlay} size="sm" className="faIcon" />
      </span>
    </li>
  );
}

export default withRouter(FlashcardListItem);
