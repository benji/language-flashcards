import React from "react";
import Form from "react-bootstrap/Form";

import LanguagesService from "./LanguagesService";

const AllLanguages = LanguagesService.AllLanguages;
const AllLanguagesKeys = Object.keys(LanguagesService.AllLanguages);

function SelectLanguage(props) {
  function handleChange(e) {
    props.setValue(e.target.value);
  }

  return (
    <Form.Group>
      <Form.Control as="select" value={props.value} onChange={handleChange}>
        <option value="">-- {props.title} --</option>
        {AllLanguagesKeys.map(k => {
          return (
            <option key={k} value={k}>
              {AllLanguages[k].name}
            </option>
          );
        })}
      </Form.Control>
    </Form.Group>
  );
}

export default SelectLanguage;
