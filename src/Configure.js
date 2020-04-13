import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import flash_store from "./FlashStore";
import _OneStore from "onestore-client-node";
import SelectLanguage from "./SelectLanguage";
import AppContext from "./AppContext";
import Utils from "./Utils";
import store from "./services/FlashcardStore";

const saveButtonStyles = {
  float: "right"
};

const formStyles = {
  marginTop: "1em"
};

function Configure(props) {
  console.log("--Configure--");

  store.useState(store.APP_CONFIG);

  const c = store.get(store.APP_CONFIG);
  const [fromLanguage, setFromLanguage] = useState(c ? c.from : "");
  const [toLanguage, setToLanguage] = useState(c ? c.to : "");

  function saveConfiguration(e) {
    e.preventDefault();
    if (!fromLanguage || fromLanguage === "")
      return alert("Please select the language you wish to learn!");
    if (!toLanguage || toLanguage === "")
      return alert(
        "Please select the language you will use in the translations!"
      );

    const configuration = { from: fromLanguage, to: toLanguage };
    flash_store
      .saveConfiguration(configuration)
      .then(id => {
        configuration.id = id;
        store.set(store.APP_CONFIG, configuration);
        setFromLanguage("");
        setToLanguage("");
        Utils.goto(props, "/flashcards");
      })
      .catch(AppContext.handleError);
  }

  return (
    <div className="Configure">
      <h3>Settings</h3>

      <Form onSubmit={saveConfiguration} style={formStyles}>
        <Form.Label>Target Language:</Form.Label>
        <SelectLanguage
          title="New language"
          value={fromLanguage}
          setValue={setFromLanguage}
        />
        <Form.Label>Translation Language:</Form.Label>
        <SelectLanguage
          title="Language use for translation"
          value={toLanguage}
          setValue={setToLanguage}
        />
        <Button variant="primary" type="submit" style={saveButtonStyles}>
          Save
        </Button>
      </Form>
    </div>
  );
}

export default Configure;
