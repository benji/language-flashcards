import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import flash_store from "./FlashStore";
import _OneStore from "onestore-client-node";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { withRouter } from "react-router";
import AppContext from "./AppContext";
import PageTitle from "./PageTitle";
import Utils from "./Utils";
import LanguagesService from "./LanguagesService";

import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

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
        AppContext.flashcardEntries[flashcardName].push(entry);
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
      Utils.goto(props, "/flashcards/" + flashcardName + "/play");
    };
  }

  function deleteEntry(id) {
    return () => {
      flash_store
        .deleteFlashcardEntry(flashcardName, id)
        .then(r => {
          var newEntries = flashcardEntries.filter(function(entry) {
            return entry.id !== id;
          });
          AppContext.flashcardEntries[flashcardName] = newEntries;
          setflashcardEntries(newEntries);
        })
        .catch(AppContext.handleError);
    };
  }

  return (
    <React.Fragment>
      <PageTitle title={"Flashcard" + flashcardName} backLink={"/flashcards"} />

      <div class="fcRow row1">
        <Button
          className="quizz_button quizz_button_left"
          onClick={startQuizz(false)}
        >
          <FontAwesomeIcon icon={faPlay} />
          <br />
          {LanguagesService.to()}{" "}
          <FontAwesomeIcon icon={faArrowRight} size="sm" />{" "}
          {LanguagesService.from()}
        </Button>

        <Button
          className="quizz_button quizz_button_right"
          onClick={startQuizz(true)}
        >
          <FontAwesomeIcon icon={faPlay} />
          <br />
          {LanguagesService.from()}{" "}
          <FontAwesomeIcon icon={faArrowRight} size="sm" />{" "}
          {LanguagesService.to()}
        </Button>
      </div>

      <div class="fcRow row2">
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
      </div>

      <div class="fcRow row3">
        <label>Entries</label>
        <div className="ListflashcardEntries">
          {flashcardEntries.length == 0 ? (
            <>No entries yet</>
          ) : (
            <Table>
              <Thead>
                <Tr>
                  <Th>{LanguagesService.from()}</Th>
                  <Th>{LanguagesService.to()}</Th>
                  <Th>Pronouciation</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {flashcardEntries.map(e => {
                  return (
                    <Tr key={e.id}>
                      <Td>{e.from}</Td>
                      <Td>{e.to}</Td>
                      <Td>{e.p}</Td>
                      <Td className="deleteIcon">
                        <FontAwesomeIcon
                          icon={faTrashAlt}
                          className="l-icon-action"
                          onClick={deleteEntry(e.id)}
                        />
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

export default withRouter(Flashcard);
