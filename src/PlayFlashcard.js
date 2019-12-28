import React, { useState, useRef, useEffect } from "react";
import { withRouter } from "react-router";
import AppContext from "./AppContext";
import PageTitle from "./PageTitle";
import Utils from "./Utils";

import "./PlayFashcard.scss";

var flashcardEntries;
var index = 0;

function PlayFlashcard(props) {
  const flashcardName = props.match.params.flashcard_name;

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [pronouciation, setPronouciation] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    AppContext.loadFlashcardEntries(flashcardName)
      .then(loadQuizz)
      .catch(AppContext.handleError);
  }, []); // only once

  function loadQuizz(entries) {
    console.log("Loaded " + entries.length + " entries.");
    flashcardEntries = Utils.shuffleArray(entries);
    renderCurrentEntry();
  }

  function next() {
    if (showAnswer) index++;
    setShowAnswer(!showAnswer);
    renderCurrentEntry();
  }

  function renderCurrentEntry() {
    console.log("rendering current entry ", index, showAnswer);
    const entry = flashcardEntries[index % flashcardEntries.length];
    setQuestion(AppContext.fromto ? entry.from : entry.to);
    setAnswer(AppContext.fromto ? entry.to : entry.from);
    setPronouciation(entry.p);
  }

  function answerStyle() {
    return { opacity: showAnswer ? "1" : "0" };
  }

  return (
    <React.Fragment>
      <PageTitle
        title={"Flashcard" + flashcardName}
        backLink={"/flashcards/" + flashcardName}
      />
      <div className="quizz_container_1" onClick={next}>
        <div className="quizz_container_2">
          <div className="quizz_container_3">
            <div className="question">{question}</div>
            <div className="clearfix"></div>
            <div className="answer" style={answerStyle()}>
              {answer}
            </div>
            <div className="clearfix"></div>
            <div className="pronounciation" style={answerStyle()}>
              {pronouciation}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default withRouter(PlayFlashcard);
