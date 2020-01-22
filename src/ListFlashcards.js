import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import flash_store from "./FlashStore";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import FormControl from "react-bootstrap/FormControl";
import Form from "react-bootstrap/Form";
import { withRouter } from "react-router";
import AppContext from "./AppContext";
import FlashcardListItem from "./FlashcardListItem";
import Utils from "./Utils";
import "./ListFlashcards.scss";

function ListFlashcards(props) {
  const [flashcards, setFlashcards] = useState([]);
  const [newFlashcardName, setNewFlashcardName] = useState("");

  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

  useEffect(() => {
    AppContext.getCachedFlashcardsArray()
      .then(arr => {
        setFlashcards([...arr]) // copy
      })
      .catch(AppContext.handleError);
  }, []); //only once

  function addFlashcard(e) {
    e.preventDefault();

    AppContext.findFlashCardByName(newFlashcardName)
      .then((f) => {
        if (f) {
          alert('Flashcard "' + newFlashcardName + '" already exist');
        } else {
          const userdata = { name: newFlashcardName };
          flash_store
            .addFlashcard(userdata)
            .then(id => {
              var flashcard = { id: id, userdata: userdata }
              AppContext.addFlashcard(flashcard)
              setFlashcards([...flashcards, flashcard]);
              setNewFlashcardName("");
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
    console.log('show')
    setShowDeleteAllConfirm(true)
  }
  function closeDeleteAllConfirm() {
    console.log('hide')
    setShowDeleteAllConfirm(false)
  }

  function deleteAll() {
    console.log("DELETE ALL!")
    closeDeleteAllConfirm()
    flash_store
      .deleteAll()
      .then(() => {
        AppContext.deleteAll()
        setFlashcards([]);
        setNewFlashcardName("");
      })
      .catch(AppContext.handleError);
  }

  return (
    <React.Fragment>
      <h3>Flashcards</h3>

      <div className="fcRow ListFlashcards">
        <ul className="flashcards">
          {flashcards.map(f => {
            return (
              <FlashcardListItem key={f.id} flashcardId={f.id} flashcardName={f.userdata.name} />
            );
          })}
        </ul>

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
            <Button type="button" variant="secondary" onClick={closeDeleteAllConfirm}>
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
