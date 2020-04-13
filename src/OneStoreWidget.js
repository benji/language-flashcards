import React, { Component } from "react";
import flash_store from "./FlashcardStoreDAO";

let topStyles = {
  textAlign: "right"
};

let containerStyles = {
  display: "inline-block"
};

export class OneStoreWidget extends Component {
  // expected onAuthenticationChanged
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="OneStoreWidget" style={topStyles}>
        <div id="onestore-widget-container" style={containerStyles}></div>
      </div>
    );
  }

  componentDidMount() {
    flash_store.load(this.props.onAuthenticationChanged);
  }
}

export default OneStoreWidget;
