import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import flash_store from "./FlashStore";
import _OneStore from "onestore-client-node";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import OneStoreWidget from "./OneStoreWidget";
import { withRouter } from "react-router";

function ListFlashcards(props) {
  const languageName = props.match.params.language_name;
  const [flashcards, setFlashcards] = useState([]);
  const [newFlashcardName, setNewFlashcardName] = useState('');

  function onAuthenticationChanged() {
    flash_store.listFlashcards(languageName).then(r => {
      console.log("fetched flashcards:");
      console.log(r);
      setFlashcards(
        r.data.map(r => {
          return {
            name: r.userdata.name,
            id: r.id
          };
        })
      );
    });
  }

  function addFlashcard(e) {
    e.preventDefault();

    if (flashcards.indexOf(newFlashcardName) < 0) {
      flash_store.addFlashcard(languageName, newFlashcardName).then(id => {
        setFlashcards([...flashcards, { name: newFlashcardName, id: id }]);
        setNewFlashcardName('');
      });
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
      <OneStoreWidget onAuthenticationChanged={onAuthenticationChanged} />
      <h2>Language: {languageName}</h2>
      <div className="ListFlashcards">
        <ul>
          {flashcards.map(f => {
            return (
              <li key={f.id}>
                <Link to={`/language/${languageName}/flashcards/${f.name}`}>
                  {f.name}
                </Link>
              </li>
            );
          })}
        </ul>

        <form onSubmit={addFlashcard}>
          New Flashcard:
          <div className="d-flex flex-column">
            <InputGroup className="mb-3">
              <FormControl
                value={newFlashcardName}
                onChange={handleChange}
                placeholder="Flashcard name"
                aria-label="Flashcard name"
                aria-describedby="basic-addon2"
              />
              <InputGroup.Append>
                <Button variant="outline-secondary" type="submit">
                  Add
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
}

export default withRouter(ListFlashcards);
