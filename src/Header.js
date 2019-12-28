import React, { useState, useMemo, useContext } from "react";
import { Link } from "react-router-dom";
import flash_store from "./FlashStore";
import AppContext from "./AppContext";
import { faSignOutAlt, faSlidersH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function logout() {
  flash_store.onestore.deauthenticate();
}

const styles = {
  padding: "8px .5em",
  position: "absolute",
  right: 0
};

const linkStyle = {
  marginLeft: "1em",
  color: "#333"
};

function Header(props) {
  return (
    <div style={styles}>
      {props.configuration ? (
        <Link to={`/configure`} style={linkStyle}>
          <FontAwesomeIcon icon={faSlidersH} className="l-nav-link" />
        </Link>
      ) : (
        <>Learn a new Language!</>
      )}
      {props.isAuthenticated ? (
        <a onClick={logout} className="headerLink" style={linkStyle}>
          <FontAwesomeIcon icon={faSignOutAlt} className="l-nav-link" />
        </a>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Header;
