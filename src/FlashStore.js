import util from "util";
import React, { useState, useContext } from "react";
import _OneStore from "onestore-client-node";
import AppContext from "./AppContext";
import App from "./App";

const store_configuration = "Configuration";
const store_flashcards = "Flashcards";

const self = {};

self.load = function(onAuthenticationChanged) {
  self.onestore = new _OneStore.Client({
    jsonify: true,
    //widgetElementId: "onestore-widget-container",
    widgetAuthMethod: "popup.auto",
    onAuthenticationChanged: onAuthenticationChanged
  });
};

self.isAuthenticated = function() {
  return self.onestore && self.onestore.isAuthenticated();
};

self.registerAuthenticationCallback = function(c) {
  if (self.authenticationCallbacks.indexOf(c) < 0)
    self.authenticationCallbacks.push(c);
};

self.getConfiguration = function() {
  try {
    return self
      ._listP()(store_configuration, {})
      .then(r => {
        if (!r.data || r.data.length == 0) {
          return undefined;
        } else if (r.data.length > 1) {
          console.log(r);
          throw "More than 1 configuration has been found!";
        } else {
          const e = r.data[0];
          return {
            id: e.id,
            from: e.userdata.from,
            to: e.userdata.to
          };
        } // otherwise return undefined
      });
  } catch (e) {
    return Promise.reject(new Error(e));
  }
};

self.saveConfiguration = function(configuration) {
  try {
    self._validateKeys(configuration);

    return self.getConfiguration().then(c => {
      if (c) {
        return self.__updateP()(store_configuration, c.id, configuration);
      } else {
        return self._createP()(store_configuration, configuration);
      }
    });
  } catch (e) {
    return Promise.reject(new Error(e));
  }
};

self.listFlashcards = function() {
  try {
    return self._listP()(store_flashcards, {});
  } catch (e) {
    return Promise.reject(new Error(e));
  }
};

self.addFlashcard = function(flashcard) {
  try {
    self._validateKeys(flashcard);
    return self._createP()(store_flashcards, flashcard);
  } catch (e) {
    return Promise.reject(new Error(e));
  }
};

self.addFlashcardEntry = function(flashcardName, entry) {
  try {
    self._validateNames([flashcardName]);
    self._validateKeys(entry);
    return self._createP()(
      self._getFlashcardsEntriesStore(flashcardName),
      entry
    );
  } catch (e) {
    return Promise.reject(new Error(e));
  }
};

self.loadAllFlashcardEntries = function(flashcardName) {
  try {
    self._validateNames([flashcardName]);
    const entries = [];
    return new Promise((resolve, reject) => {
      self._loadNextFlashcardEntries(
        flashcardName,
        entries,
        null,
        resolve,
        reject
      );
    });
  } catch (e) {
    return Promise.reject(new Error(e));
  }
};

self._loadNextFlashcardEntries = function(
  flashcardName,
  entries,
  start,
  resolve,
  reject
) {
  try {
    console.log("Loading next batch of entries starting at " + start);
    const opts = {};
    if (start) opts.start = start;
    self
      ._listP()(self._getFlashcardsEntriesStore(flashcardName), opts)
      .then(r => {
        for (var i in r.data) {
          var e = r.data[i];
          entries.push({ ...e.userdata, id: e.id });
        }
        if (r.links && r.links.next) {
          self._loadNextFlashcardEntries(
            flashcardName,
            entries,
            r.links.next,
            resolve,
            reject
          );
        } else {
          resolve(entries);
        }
      });
  } catch (e) {
    return reject(new Error(e));
  }
};

self.listflashcardEntries = function(flashcardName) {
  try {
    self._validateNames([flashcardName]);
    return self._listP()(self._getFlashcardsEntriesStore(flashcardName), {});
  } catch (e) {
    return Promise.reject(new Error(e));
  }
};

/* PRIVATE */
self._getFlashcardsEntriesStore = function(flashcardName) {
  return "Flashcards_" + flashcardName;
};

self._listP = function() {
  return util.promisify(self.onestore.list.bind(self.onestore));
};
self._createP = function() {
  console.trace("_createP");
  return util.promisify(self.onestore.create.bind(self.onestore));
};
self.__updateP = function() {
  return util.promisify(self.onestore.update.bind(self.onestore));
};

self._validateNames = function(values) {
  for (var i in values) {
    self._validateValue(values[i]);
  }
};
self._validateKeys = function(obj) {
  for (var k in obj) {
    self._validateValue(obj[k], k == "from" || k == "to");
  }
};
self._validateValue = function(value, onlyCheckNotEmpty) {
  var err;
  if (!value || value === "") {
    err = "Disallowed undefined value";
  } else if (!onlyCheckNotEmpty && !/^[a-zA-Z0-9\-_ ]+$/.test(value)) {
    err = "Invalid value [" + value + "]";
  }
  if (err) {
    console.error(value);
    throw err;
  }
};

export default self;
