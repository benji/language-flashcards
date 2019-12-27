import React, { useState, useRef } from "react";
import {Link} from 'react-router-dom';
import "./App.css";
import flash_store from "./FlashStore";
import _OneStore from "onestore-client-node";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import OneStoreWidget from "./OneStoreWidget";

function ListLanguages() {
  const [languages, setLanguages] = useState([]);
  const languageNameRef = useRef();

  function onAuthenticationChanged() {
    flash_store.listLanguages().then(r => {
      console.log("fetched languages:");
      console.log(r);
      setLanguages(
        r.data.map(r => {
          return {
            name: r.userdata.name,
            id: r.id
          };
        })
      );
    });
  }

  function addLanguage(e) {
    e.preventDefault();
    const name = languageNameRef.current.value;

    if (languages.indexOf(name) < 0) {
      flash_store.addLanguage(name).then(id => {
        setLanguages(ls => [...ls, { name: name, id: id }]);
        languageNameRef.current.value = null;
      });
    } else {
      alert('Language "' + name + '" already exist');
    }
    return false;
  }

  return (
    <div className="ListLanguages">
      <OneStoreWidget onAuthenticationChanged={onAuthenticationChanged} />

      Languages:
      <ul>
        {languages.map(l => {
          //return <li key={l.id}>{l.name}</li>;
          return <li key={l.id}><Link to={`/language/${l.name}/flashcards`}>{l.name}</Link></li>
        })}
      </ul>

      <form onSubmit={addLanguage}>
        New Language:
        <div className="d-flex flex-column">
          <InputGroup className="mb-3">
            <FormControl
              ref={languageNameRef}
              placeholder="Language name"
              aria-label="Language name"
              aria-describedby="basic-addon2"
            />
            <InputGroup.Append>
              <Button variant="outline-secondary" type="submit">
                Add
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </div>
      </form>
    </div>
  );
}

export default ListLanguages;
