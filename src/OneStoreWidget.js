import React, { useState, useRef, Component } from "react";
import ReactDOM from "react-dom";
import "./App.css";
import flash_store from "./FlashStore";
import _OneStore from "onestore-client-node";

export class OneStoreWidget extends Component {
  // expected onAuthenticationChanged
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="OneStoreWidget">
        <div id="onestore-widget-container"></div>
      </div>
    );
  }

  componentDidMount() {
    flash_store.load(this.props.onAuthenticationChanged);
  }
}

export default OneStoreWidget;
