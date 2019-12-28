import React, { useState, useRef, useEffect } from "react";
import { withRouter } from "react-router";
import AppContext from "./AppContext";
import Utils from "./Utils";

import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./PlayFashcard.scss";

var flashcardEntries;
var index = 0;

function PlayFlashcard(props) {
  const flashcardName = props.match.params.flashcard_name;

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [pronouciation, setPronouciation] = useState("");

  useEffect(() => {
    AppContext.loadFlashcardEntries(flashcardName)
      .then(loadQuizz)
      .catch(AppContext.handleError);
  }, []); // only once

  function loadQuizz(entries) {
    console.log("Loaded " + entries.length + " entries.");
    flashcardEntries = Utils.shuffleArray(entries);
    nextEntry();
  }

  function nextEntry() {
    const actualIndex = index % flashcardEntries.length;
    console.log(
      "click " + index + " " + flashcardEntries.length + " " + actualIndex
    );
    console.log("Next entry " + actualIndex);
    const entry = flashcardEntries[actualIndex];
    setQuestion(AppContext.fromto ? entry.from : entry.to);
    setAnswer(AppContext.fromto ? entry.to : entry.from);
    setPronouciation(entry.p);
    index++;
  }

  function back() {
    props.history.push("/flashcards/" + flashcardName);
  }

  return (
    <React.Fragment>
      <h3>
        <FontAwesomeIcon
          icon={faPlay}
          rotation={180}
          onClick={back}
          className="l-nav-link"
          style={{ fontSize: ".8em", marginRight: ".5em" }}
        />{" "}
        Flashcard {flashcardName}
      </h3>
      <div className="quizz_container_1" onClick={nextEntry}>
        <div className="quizz_container_2">
          <div className="quizz_container_3">
            <div className="question">{question}</div>
            <div className="clearfix"></div>
            <div className="answer">{answer}</div>
            <div className="clearfix"></div>
            <div className="pronounciation">{pronouciation}</div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default withRouter(PlayFlashcard);
