import React, { useState, useContext, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Button from "react-bootstrap/Button";

import flash_store from "./FlashStore";
import _OneStore from "onestore-client-node";
import Configure from "./Configure";
import ListFlashcards from "./ListFlashcards";
import Flashcard from "./Flashcard";
import OneStoreLogin from "./OneStoreLogin";
import Header from "./Header";
import AppContext from "./AppContext";
import Error from "./Error";
import NotFound from "./NotFound";
import PlayFlashcard from "./PlayFlashcard";

import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import "./AppCustom.scss";

function App() {
  console.log("App()");
  const [authenticated, setAuthenticated] = useState(false);
  const [configuration, setConfiguration] = useState();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState();

  AppContext.handleError = function(e) {
    console.error(e);
    setReady(true);
    setError(e);
  };

  useEffect(() => {
    flash_store.load(auth => {
      setAuthenticated(auth);
      if (auth) {
        flash_store
          .getConfiguration()
          .then(c => {
            AppContext.configuration = c;
            setConfiguration(c);
            setReady(true);
          })
          .catch(AppContext.handleError);
      } else {
        setReady(true);
      }
    });
  }, []); // run only once

  function renderMe() {
    if (error) return <Error error={error} />;
    if (!authenticated) return <OneStoreLogin />;
    if (!configuration) return <Configure />;
    return (
      <>
        <Switch>
          <Route exact path="/configure" component={Configure} />
          <Route exact path="/flashcards" component={ListFlashcards} />
          <Route
            exact
            path="/flashcards/:flashcard_name"
            component={Flashcard}
          />
          <Route
            exact
            path="/flashcards/:flashcard_name/play"
            component={PlayFlashcard}
          />
          <Route exact path="/" component={ListFlashcards} />
          <Route path="/" component={NotFound} />
        </Switch>
      </>
    );
  }

  return (
    <div className="App">
      {ready ? (
        <BrowserRouter>
          <Header
            isAuthenticated={authenticated}
            configuration={configuration}
          />
          <div className="content">{renderMe()}</div>
        </BrowserRouter>
      ) : (
        <>Loading...</>
      )}
    </div>
  );
}

export default App;
