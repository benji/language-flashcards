import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import flash_store from "./FlashStore";
import _OneStore from "onestore-client-node";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import { withRouter } from "react-router";
import AppContext from "./AppContext";
import LanguagesService from "./LanguagesService";
import {
  faPlay,
  faTrashAlt,
  faArrowRight
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Flashcard.scss";

function Flashcard(props) {
  const flashcardName = props.match.params.flashcard_name;

  const [flashcardEntries, setflashcardEntries] = useState([]);
  const [newEntryFrom, setNewEntryFrom] = useState("");
  const [newEntryTo, setNewEntryTo] = useState("");
  const [newEntryPronounciation, setNewEntryPronounciation] = useState("");

  useEffect(() => {
    AppContext.loadFlashcardEntries(flashcardName)
      .then(setflashcardEntries)
      .catch(AppContext.handleError);
  }, []); // only once

  function addFlashcardEntry(e) {
    e.preventDefault();

    const entry = {
      from: newEntryFrom,
      to: newEntryTo,
      p: newEntryPronounciation
    };
    flash_store
      .addFlashcardEntry(flashcardName, entry)
      .then(id => {
        entry.id = id;
        setflashcardEntries([...flashcardEntries, entry]);
        AppContext.flashcardEntries[flashcardName].push(entry)
        setNewEntryFrom("");
        setNewEntryTo("");
        setNewEntryPronounciation("");
      })
      .catch(AppContext.handleError);
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

  function startQuizz(fromto) {
    return () => {
      if (flashcardEntries.length == 0) {
        return alert("You must define a few entries before starting!");
      }
      AppContext.fromto = fromto;
      props.history.push("/flashcards/" + flashcardName + "/play");
    };
  }

  return (
    <React.Fragment>
      <h3>Flashcard {flashcardName}</h3>

      <Row>
        <Col>
          <Button className="quizz_button" onClick={startQuizz(true)}>
            <FontAwesomeIcon icon={faPlay} />
            <br />
            {LanguagesService.from()}{" "}
            <FontAwesomeIcon icon={faArrowRight} size="sm" />{" "}
            {LanguagesService.to()}
          </Button>
        </Col>
        <Col>
          <Button className="quizz_button" onClick={startQuizz(false)}>
            <FontAwesomeIcon icon={faPlay} />
            <br />
            {LanguagesService.to()}{" "}
            <FontAwesomeIcon icon={faArrowRight} size="sm" />{" "}
            {LanguagesService.from()}
          </Button>
        </Col>
      </Row>

      <Form onSubmit={addFlashcardEntry} className="add-entry-form">
        <Form.Label>New Entry</Form.Label>
        <Form.Control
          type="text"
          placeholder={LanguagesService.from()}
          value={newEntryFrom}
          onChange={handleFromChange}
        />
        <Form.Control
          type="text"
          placeholder={LanguagesService.to()}
          value={newEntryTo}
          onChange={handleToChange}
        />
        <Form.Control
          type="text"
          placeholder="Pronounciation"
          value={newEntryPronounciation}
          onChange={handlePronounciationChange}
        />
        <Button type="submit">Add</Button>
      </Form>

      <div className="clearfix"></div>

      <div className="ListflashcardEntries">
        {flashcardEntries.length == 0 ? (
          <>No entries yet</>
        ) : (
          <table>
            <thead>
              <tr>
                <th>{LanguagesService.from()}</th>
                <th>{LanguagesService.to()}</th>
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
                    <td>
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </React.Fragment>
  );
}

export default withRouter(Flashcard);
