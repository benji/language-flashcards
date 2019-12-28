import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";

import flash_store from "./FlashStore";
import _OneStore from "onestore-client-node";
import SelectLanguage from "./SelectLanguage";
import AppContext from "./AppContext";

function ListLanguages() {
  const [languages, setLanguages] = useState([]);
  const fromLanguageRef = useRef();
  const toLanguageRef = useRef();

  function addFlashcardSet(e) {
    e.preventDefault();
    var from = fromLanguageRef.current.value;
    var to = toLanguageRef.current.value;
    if (!from || from === "")
      return alert("Please select the language you wish to learn!");
    if (!to || to === "")
      return alert(
        "Please select the language you will use in the translations!"
      );

    const flashcardSet = { from: from, to: to };
    flash_store.addFlashcardSet(flashcardSet).then(id => {
      flashcardSet.id = id;
      setLanguages(ls => [...ls, flashcardSet]);
      fromLanguageRef.current.value = "";
      toLanguageRef.current.value = "";
    })
    .catch(AppContext.handleError);
  }

  return (
    <div className="ListLanguages">
      Flashcard Sets:
      <ul>
        {languages.map(l => {
          //return <li key={l.id}>{l.name}</li>;
          return (
            <li key={l.id}>
              <Link to={`/language/${l.id}/flashcards`}>{l.from} -> {l.to}</Link>
            </li>
          );
        })}
      </ul>
      <Form onSubmit={addFlashcardSet}>
        <fieldset>
          <legend>Add a new flashcard set</legend>
          <SelectLanguage title="New language" theref={fromLanguageRef} />
          <SelectLanguage
            title="Language use for translation"
            theref={toLanguageRef}
          />
          <Button variant="primary" type="submit">
            Add
          </Button>
        </fieldset>
      </Form>
    </div>
  );
}

export default ListLanguages;
