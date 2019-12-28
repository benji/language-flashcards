import React, { useState, useRef, Component } from "react";
import ReactDOM from "react-dom";
import flash_store from "./FlashStore";
import _OneStore from "onestore-client-node";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";

function OneStoreLogin(props) {
  function login() {
    flash_store.onestore.startAuthenticationProcedure();
  }

  return (
    <>
      <p>
        This app uses <a href="https://www.onestore.io">onestore.io</a> to store
        the flashcards you will create.
      </p>
      <p>If you already created an account:</p>
      <ul>
        <li>
          <a onClick={login}>
            <Button size="sm">Login</Button>
          </a>
          , and then
        </li>
        <li>select the namespace that contains your flashcards</li>
      </ul>
      <p>If you don't have an account:</p>
      <ul>
        <li>
          <a onClick={login}>
            <Button size="sm">Create an account</Button>
          </a>, and then
        </li>
        <li>
          create a new namespace for your flashcards, for example
          "Farsi-English"
        </li>
      </ul>
    </>
  );
}

export default OneStoreLogin;
