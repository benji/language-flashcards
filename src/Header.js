import React, { useState, useMemo ,useContext} from "react";
import { Link } from "react-router-dom";
import flash_store from "./FlashStore";
import AppContext from "./AppContext";

const styles = {
  textAlign: "center",
  marginBottom: "1em"
};

const logoutStyles = {
  float: "right"
};
const configStyles = {};

function logout() {
  flash_store.onestore.deauthenticate();
}

function Header(props) {
  return (
    <div style={styles}>
      {props.isAuthenticated ? (
        <div style={logoutStyles}>
          <a onClick={logout}>Logout</a>
        </div>
      ) : (
        <></>
      )}
      {props.configuration ? (
        <div style={configStyles}>
          <Link to={`/configure`}>
            {AppContext.configuration.from}->{AppContext.configuration.to}
          </Link>
        </div>
      ) : (
        <>Learn a new Language!</>
      )}
    </div>
  );
}

export default Header;
