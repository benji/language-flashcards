import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import flash_store from "./FlashStore";
import _OneStore from "onestore-client-node";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import OneStoreWidget from "./OneStoreWidget";
import { withRouter } from "react-router";

function Flashcard(props) {
  const languageName = props.match.params.language_name;
  const flashCardName = props.match.params.flashcard_name;

  const [flashcardEntries, setflashcardEntries] = useState([]);
  const [newEntryFrom, setNewEntryFrom] = useState("");
  const [newEntryTo, setNewEntryTo] = useState("");
  const [newEntryPronounciation, setNewEntryPronounciation] = useState("");

  function onAuthenticationChanged() {
    flash_store.listflashcardEntries(languageName, flashCardName).then(r => {
      console.log("fetched entries:");
      console.log(r);
      setflashcardEntries(
        r.data.map(r => {
          return {
            from: r.userdata.from,
            to: r.userdata.to,
            p: r.userdata.p,
            id: r.id
          };
        })
      );
    });
  }

  function addFlashcardEntry(e) {
    e.preventDefault();

    flash_store
      .addFlashcardEntry(
        languageName,
        flashCardName,
        newEntryFrom,
        newEntryTo,
        newEntryPronounciation
      )
      .then(id => {
        setflashcardEntries([
          ...flashcardEntries,
          {
            from: newEntryFrom,
            to: newEntryTo,
            p: newEntryPronounciation,
            id: id
          }
        ]);
        setNewEntryFrom("");
        setNewEntryTo("");
        setNewEntryPronounciation("");
      });
    return false;
  }

  function handleFromChange(e) {
    setNewEntryFrom(e.target.value);
  }
  function handleToChange(e) {
    setNewEntryTo(e.target.value);
  }
  function handlePronounciationChange(e) {
    setNewEntryPronounciation(e.target.value);
  }

  return (
    <React.Fragment>
      <OneStoreWidget onAuthenticationChanged={onAuthenticationChanged} />
      <h2>Language: {languageName}</h2>
      <h2>Flashcard: {flashCardName}</h2>

      <button>PLAY: TO {languageName}</button>
      <button>PLAY: FROM {languageName}</button>

      <Form onSubmit={addFlashcardEntry}>
        <Form.Control
          type="text"
          placeholder="From"
          value={newEntryFrom}
          onChange={handleFromChange}
        />
        <Form.Control
          type="text"
          placeholder="To"
          value={newEntryTo}
          onChange={handleToChange}
        />
        <Form.Control
          type="text"
          placeholder="Pronounciation"
          value={newEntryPronounciation}
          onChange={handlePronounciationChange}
        />
        <Button variant="outline-secondary" type="submit">
          Add
        </Button>
      </Form>

      <div className="ListflashcardEntries">
        <table>
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Pronouciation</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {flashcardEntries.map(e => {
              return (
                <tr key={e.id}>
                  <td>{e.from}</td>
                  <td>{e.to}</td>
                  <td>{e.p}</td>
                  <td>X</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
}

export default withRouter(Flashcard);
