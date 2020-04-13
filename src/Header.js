import React from "react";
import { Link, withRouter } from "react-router-dom";
import flash_store from "./services/FlashcardStoreDAO";
import { faSignOutAlt, faSlidersH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import store from "./services/FlashcardStore";

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
  console.log("--Header--");
  store.useState(store.APP_CONFIG);

  return (
    <div style={styles}>
      {store.get(store.APP_CONFIG) ? (
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
            size="1x"
          />
        </a>
      ) : (
        <></>
      )}
    </div>
  );
}

export default withRouter(Header);
