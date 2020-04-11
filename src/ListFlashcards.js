import React, { useState, useCallback, useEffect } from "react";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import Form from "react-bootstrap/Form";
import { withRouter } from "react-router";
import AppContext from "./AppContext";
import FlashcardListItem from "./FlashcardListItem";
import "./ListFlashcards.scss";
import { DndProvider } from "react-dnd";

import HTML5Backend from "react-dnd-html5-backend";
import TouchBackend from "react-dnd-touch-backend";
import MultiBackend, { TouchTransition } from "react-dnd-multi-backend";

import update from "immutability-helper";
import flash_store from "./FlashStore";

function ListFlashcards(props) {
  const [flashcards, setFlashcards] = useState([]);
  const [newFlashcardName, setNewFlashcardName] = useState("");
  const [draggedId, setDraggedId] = useState(null);

  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

  let orderConfig;

  useEffect(() => {
    loadFlashcards();
  }, []); //only once

  function loadFlashcards() {
    AppContext.getCachedFlashcardsArray()
      .then(arr => {
        orderFlashcard([...arr]); // copy
      })
      .catch(AppContext.handleError);
  }

  function orderFlashcard(_flashcards) {
    console.log("fcs", _flashcards);
    flash_store
      .getFlashcardsOrdering()
      .then(_orderConfig => {
        orderConfig = _orderConfig ? _orderConfig.userdata : [];
        console.log("loaded order", orderConfig);

        if (orderConfig == null) {
          orderConfig = [];
        }

        const getOrder = fid => orderConfig.findIndex(x => x.id === fid);
        _flashcards = _flashcards.sort((a, b) => {
          return getOrder(a.id) - getOrder(b.id);
        });

        setFlashcards(_flashcards);

        if (orderingChanged()) {
          saveOrdering();
        }
      })
      .catch(AppContext.handleError);
  }

  function orderingChanged() {
    for (var i in flashcards) {
      if (!orderConfig[i] || orderConfig[i].id !== flashcards[i].id) {
        return true;
      }
    }
  }

  function saveOrdering() {
    orderConfig = flashcards.map(f => {
      return { id: f.id, name: f.userdata.name };
    });

    console.log("SAve order", orderConfig);
    flash_store
      .saveFlashcardsOrdering(orderConfig)
      .then()
      .catch(AppContext.handleError);
  }

  function addFlashcard(e) {
    e.preventDefault();

    AppContext.findFlashCardByName(newFlashcardName)
      .then(f => {
        if (f) {
          alert('Flashcard "' + newFlashcardName + '" already exist');
        } else {
          const userdata = { name: newFlashcardName };
          flash_store
            .addFlashcard(userdata)
            .then(id => {
              var flashcard = { id: id, userdata: userdata };
              AppContext.addFlashcard(flashcard);
              setFlashcards([flashcard, ...flashcards]);
              setNewFlashcardName("");
              saveOrdering();
            })
            .catch(AppContext.handleError);
        }
      })
      .catch(AppContext.handleError);

    return false;
  }

  function handleChange(e) {
    setNewFlashcardName(e.target.value);
  }

  function confirmDeleteAll() {
    console.log("show");
    setShowDeleteAllConfirm(true);
  }
  function closeDeleteAllConfirm() {
    console.log("hide");
    setShowDeleteAllConfirm(false);
  }

  function deleteAll() {
    console.log("DELETE ALL!");
    closeDeleteAllConfirm();
    flash_store
      .deleteAll()
      .then(() => {
        AppContext.deleteAll();
        setFlashcards([]);
        setNewFlashcardName("");
        saveOrdering();
      })
      .catch(AppContext.handleError);
  }

  const moveFlashcard = useCallback(
    (dragIndex, hoverIndex) => {
      const dragFlashcard = flashcards[dragIndex];
      setFlashcards(
        update(flashcards, {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragFlashcard]]
        })
      );
    },
    [flashcards]
  );

  const HTML5toTouch = {
    backends: [
      {
        backend: HTML5Backend
      },
      {
        backend: TouchBackend,
        preview: true,
        transition: TouchTransition,
        options: {
          delayTouchStart: 100
        }
      }
    ]
  };

  return (
    <React.Fragment>
      <h3>Flashcards</h3>

      <div className="fcRow ListFlashcards">
        {" "}
        <DndProvider backend={MultiBackend} options={HTML5toTouch}>
          <ul className="flashcards">
            {flashcards.map((f, index) => {
              return (
                <FlashcardListItem
                  key={f.id}
                  index={index}
                  flashcardId={f.id}
                  flashcardName={f.userdata.name}
                  moveFlashcard={moveFlashcard}
                  onDropFlashcard={saveOrdering}
                  setDraggedId={setDraggedId}
                  draggedId={draggedId}
                />
              );
            })}
          </ul>
        </DndProvider>
        <div className="fcRow">
          <form onSubmit={addFlashcard}>
            <Form.Label>New Flashcard</Form.Label>
            <FormControl
              value={newFlashcardName}
              onChange={handleChange}
              placeholder="Flashcard name"
              aria-label="Flashcard name"
              aria-describedby="basic-addon2"
            />
            <Button type="submit" style={{ float: "right" }}>
              Add
            </Button>
          </form>
        </div>
      </div>

      <div className="deleteAllRow">
        {!showDeleteAllConfirm && (
          <Button type="button" variant="danger" onClick={confirmDeleteAll}>
            Delete All!
          </Button>
        )}
        {showDeleteAllConfirm && (
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={closeDeleteAllConfirm}
            >
              Cancel
            </Button>
            <Button type="button" variant="danger" onClick={deleteAll}>
              Yes, Delete All!
            </Button>
          </>
        )}
      </div>
    </React.Fragment>
  );
}

export default withRouter(ListFlashcards);
