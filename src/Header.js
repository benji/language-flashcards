import React, { useState, useMemo, useContext } from "react";
import { Link,withRouter } from "react-router-dom";
import flash_store from "./FlashStore";
import AppContext from "./AppContext";
import { faSignOutAlt, faSlidersH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function logout() {
  flash_store.onestore.deauthenticate();
}

const styles = {
  padding: "8px 5px",
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
        <Link to="/configure" style={linkStyle}>
          <FontAwesomeIcon icon={faSlidersH} className="l-icon-action" />
        </Link>
      ) : (
        <></>
      )}
      {props.isAuthenticated ? (
        <a onClick={logout} className="headerLink" style={linkStyle}>
          <FontAwesomeIcon
            icon={faSignOutAlt}
            className="l-icon-action"
            size="md"
          />
        </a>
      ) : (
        <></>
      )}
    </div>
  );
}

export default withRouter(Header);
