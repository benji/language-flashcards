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
  position: "absolute",
  padding: "8px 0",
  right: "0",
};

const linkStyle = {
  marginRight: "1em"
};

function Header(props) {
  return (
    <div style={styles}>
      {props.configuration ? (
        <Link to={`/configure`} style={linkStyle}>
          <FontAwesomeIcon icon={faSlidersH} />
        </Link>
      ) : (
        <>Learn a new Language!</>
      )}
      {props.isAuthenticated ? (
        <a onClick={logout} className="headerLink" style={linkStyle}>
          <FontAwesomeIcon icon={faSignOutAlt} />
        </a>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Header;
