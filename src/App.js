import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import flash_store from "./services/FlashcardStoreDAO";
import _OneStore from "onestore-client-node";
import Configure from "./Configure";
import ListFlashcards from "./ListFlashcards";
import Flashcard from "./Flashcard";
import OneStoreLogin from "./OneStoreLogin";
import Header from "./Header";
import Error from "./Error";
import NotFound from "./NotFound";
import PlayFlashcard from "./PlayFlashcard";
import store from "./services/FlashcardStore";
import Utils from "./Utils";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import "./AppCustom.scss";

function App() {
  console.log("--App--");

  store.useState(
    store.APP_CONFIG,
    store.IS_READY,
    store.ERROR,
    store.AUTHENTICATED
  );

  useEffect(() => {
    flash_store.load(auth => {
      store.set(store.AUTHENTICATED, auth);
      if (auth) {
        flash_store
          .getConfiguration()
          .then(c => {
            console.log("configuration received:");
            console.log(c);
            store.set(store.APP_CONFIG, c ? c.userdata : null);
            store.set(store.IS_READY, true);
          })
          .catch(Utils.handleError);
      } else {
        store.set(store.IS_READY, true);
      }
      store.set(store.AUTHENTICATING, false);
    });
  }, []); // run only once

  function renderMe() {
    if (store.get(store.ERROR)) return <Error error={store.get(store.ERROR)} />;
    if (!store.get(store.AUTHENTICATED)) return <OneStoreLogin />;
    if (!store.get(store.APP_CONFIG)) return <Configure />;
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
      {store.get(store.IS_READY) ? (
        <BrowserRouter basename={`${process.env.PUBLIC_URL}`}>
          <Header isAuthenticated={store.get(store.AUTHENTICATED)} />
          <div className="content-fullpage">{renderMe()}</div>
        </BrowserRouter>
      ) : (
        <>Loading...</>
      )}
    </div>
  );
}

export default App;
