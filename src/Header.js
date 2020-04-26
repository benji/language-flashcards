import React from "react";
import { Link, withRouter } from "react-router-dom";
import flash_store from "./services/FlashcardStoreDAO";
import { faSignOutAlt, faSlidersH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import store from "./services/FlashcardStore";
import Utils from "./Utils";

const logout = props => () => {
  flash_store.onestore.deauthenticate();
  store.set(store.AUTHENTICATED, false);
  Utils.goto(props, "/");
};

const styles = {
  padding: "15px 10px 0 0",
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
      {props.isAuthenticated ? (
        <>
          <Link to="/configure" style={linkStyle}>
            <FontAwesomeIcon icon={faSlidersH} className="l-icon-action" />
          </Link>
          <a onClick={logout(props)} className="headerLink" style={linkStyle}>
            <FontAwesomeIcon
              icon={faSignOutAlt}
              className="l-icon-action"
              size="1x"
            />
          </a>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default withRouter(Header);
