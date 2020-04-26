import React from "react";
import flash_store from "./services/FlashcardStoreDAO";
import _OneStore from "onestore-client-node";
import Button from "react-bootstrap/Button";
import store from "./services/FlashcardStore";
import Spinner from "./common/Spinner";

function OneStoreLogin(props) {
  store.useState(store.AUTHENTICATED, store.AUTHENTICATING, store.READY);

  function login() {
    store.set(store.AUTHENTICATING, true);
    flash_store.onestore.startAuthenticationProcedure();
  }

  if (store.get(store.AUTHENTICATING) && !store.get(store.READY)) {
    return <Spinner loading="true" />;
  } else {
    return (
      <div style={{ marginTop: "1em" }}>
        <p>
          This app uses
          <img
            class="onestore-icon"
            src="https://www.onestore.io/static/favicon-32x32.png"
          />
          <a class="onestore-link" href="https://www.onestore.io">
            onestore.io
          </a>{" "}
          to store data.
        </p>
        <p class="choices">If you already have an account:</p>
        <ul>
          <li>
            <a onClick={login}>
              <Button size="sm">Login</Button>
            </a>
            , and then
          </li>
          <li>select the namespace that contains your flashcards</li>
        </ul>
        <p class="choices">If you don't have an account:</p>
        <ul>
          <li>
            <a onClick={login}>
              <Button size="sm">Create an account</Button>
            </a>
            , and then
          </li>
          <li>
            create a new namespace for your flashcards, for example
            "Farsi-English"
          </li>
        </ul>
      </div>
    );
  }
}

export default OneStoreLogin;
