import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import flash_store from "./FlashStore";
import Button from "react-bootstrap/Button";
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

  useEffect(() => {
    flash_store
      .listFlashcards()
      .then(r => {
        console.log("fetched flashcards:");
        console.log(r);
        setFlashcards(
          r.data.map(r => {
            return { ...r.userdata, id: r.id };
          })
        );
      })
      .catch(AppContext.handleError);
  }, []); //only once

  function addFlashcard(e) {
    e.preventDefault();

    if (flashcards.indexOf(newFlashcardName) < 0) {
      const flashcard = { name: newFlashcardName };
      flash_store
        .addFlashcard(flashcard)
        .then(id => {
          flashcard.id = id;
          setFlashcards([...flashcards, flashcard]);
          setNewFlashcardName("");
        })
        .catch(AppContext.handleError);
    } else {
      alert('Flashcard "' + newFlashcardName + '" already exist');
    }
    return false;
  }

  function handleChange(e) {
    setNewFlashcardName(e.target.value);
  }

  return (
    <React.Fragment>
      <h3>Flashcards</h3>

      <div className="fcRow ListFlashcards">
        <ul className="flashcards">
          {flashcards.map(f => {
            return (
              <FlashcardListItem flashcardId={f.id} flashcardName={f.name} />
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
    </React.Fragment>
  );
}

export default withRouter(ListFlashcards);
