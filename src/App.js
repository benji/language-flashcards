import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import flash_store from "./FlashStore";
import _OneStore from "onestore-client-node";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import ListLanguages from "./ListLanguages";
import ListFlashcards from "./ListFlashcards";
import Flashcard from "./Flashcard";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Route exact path="/" render={props => <ListLanguages />} />
        <Route
          exact
          path="/language/:language_name/flashcards" 
          component={ListFlashcards}
        />
        <Route
          exact
          path="/language/:language_name/flashcards/:flashcard_name" 
          component={Flashcard}
        />
      </BrowserRouter>
    </div>
  );
}

export default App;
