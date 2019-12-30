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
          throw "More than 1 configuration has been found!";
        } else {
          const e = r.data[0];
          return {
            id: e.id,
            from: e.userdata.from,
            to: e.userdata.to
          };
        } // otherwise return undefined
      })
      .catch(self._catchHttpError);
  } catch (e) {
    return Promise.reject(new Error(e));
  }
};

self.saveConfiguration = function(configuration) {
  try {
    self._validateKeys(configuration);

    return self.getConfiguration().then(c => {
      if (c) {
        return self._updateP()(store_configuration, c.id, configuration);
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
    return self._listP()(store_flashcards, { limit: 1000 });
  } catch (e) {
    return Promise.reject(new Error(e));
  }
};

self.addFlashcard = function(flashcard) {
  try {
    self._validateNames([flashcard]);
    return self._createP()(store_flashcards, flashcard);
  } catch (e) {
    return Promise.reject(new Error(e));
  }
};

self.deleteFlashcard = function(flashcard) {
  try {
    self._validateNames([flashcard]);
    return self._removeP()(store_flashcards, flashcard);
  } catch (e) {
    return Promise.reject(new Error(e));
  }
};

self.addFlashcardEntry = function(flashcardName, entry) {
  try {
    self._validateNames([flashcardName]);
    return self._createP()(
      self._getFlashcardsEntriesStore(flashcardName),
      entry
    );
  } catch (e) {
    return Promise.reject(new Error(e));
  }
};

self.deleteFlashcardEntry = function(flashcardName, id) {
  try {
    self._validateNames([flashcardName, id]);

    // TODO need a delete store from onestore.io

    //return self._removeP()(self._getFlashcardsEntriesStore(flashcardName), id);
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
self._updateP = function() {
  return util.promisify(self.onestore.update.bind(self.onestore));
};
self._removeP = function() {
  return util.promisify(self.onestore.remove.bind(self.onestore));
};

self._catchHttpError = function(e) {
  if (e.status == 429) throw "onestore.io API limit exceeded!";
  return e;
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
