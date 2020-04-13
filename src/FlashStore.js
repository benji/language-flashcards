import util from "util";
import _OneStore from "onestore-client-node";

const store_configuration = "Configuration";
const store_flashcards = "Flashcards";

const self = {};

self.load = function(onAuthenticationChanged) {
  self.onestore = new _OneStore.Client({
    jsonify: true,
    //widgetElementId: "onestore-widget-container",
    authMethod: "popup.auto",
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

const uuid_configuration_settings = "00000000-0000-0000-0000-000000000000";
const uuid_configuration_flashcards_order =
  "00000000-0000-0000-0000-000000000001";

self.getConfigurationItem = _uuid => () => {
  try {
    return self
      ._getP()(store_configuration, _uuid)
      .catch(self._catchHttpError);
  } catch (e) {
    return Promise.reject(new Error(e));
  }
};

self.saveConfigurationItem = _uuid => configuration => {
  try {
    return self._updateP()(store_configuration, _uuid, configuration);
  } catch (e) {
    return Promise.reject(new Error(e));
  }
};

self.getConfiguration = self.getConfigurationItem(uuid_configuration_settings);
self.saveConfiguration = self.saveConfigurationItem(
  uuid_configuration_settings
);

self.getFlashcardsOrdering = self.getConfigurationItem(
  uuid_configuration_flashcards_order
);
self.saveFlashcardsOrdering = self.saveConfigurationItem(
  uuid_configuration_flashcards_order
);

self.listFlashcards = function() {
  try {
    return self._listP()(store_flashcards, { limit: 1000 });
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

self.deleteFlashcard = function(flashcard) {
  return new Promise(function(resolve, reject) {
    try {
      self._validateNames([flashcard.userdata.name]);

      self.loadAllFlashcardEntries(flashcard.userdata.name).then(r => {
        const entries = r.data;
        console.log(
          "Got " +
            entries.length +
            " entries for flashcard " +
            flashcard.userdata.name
        );
        var promises = [];
        for (var i = 0; i < entries.length; i++) {
          const e = entries[i];
          console.log(
            "Schedule flashcard " +
              flashcard.userdata.name +
              " entry " +
              e.id +
              " for deletion"
          );
          promises.push(
            self.deleteFlashcardEntry(flashcard.userdata.name, e.id)
          );
        }
        Promise.all(promises)
          .then(() => {
            console.log(
              "Flashcard " + flashcard.userdata.name + " will now be removed..."
            );
            self
              ._removeP()(store_flashcards, flashcard.id)
              .then(resolve)
              .catch(reject);
          })
          .catch(reject);
      });
    } catch (e) {
      reject(e);
    }
  });
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

    return self._removeP()(self._getFlashcardsEntriesStore(flashcardName), id);
  } catch (e) {
    return Promise.reject(new Error(e));
  }
};

self.loadAllFlashcardEntries = function(flashcardName) {
  try {
    self._validateNames([flashcardName]);
    var opts = { limit: 1000, maxRequests: 20 };
    return self._listP()(self._getFlashcardsEntriesStore(flashcardName), opts);
  } catch (e) {
    return Promise.reject(new Error(e));
  }
};

self.deleteAll = function() {
  return new Promise(function(resolve, reject) {
    self
      .listFlashcards()
      .then(r => {
        const flashcards = r.data;
        console.log("Got " + flashcards.length + " flashcards.");
        var promises = [];
        for (var i = 0; i < flashcards.length; i++) {
          const flashcard = flashcards[i];
          console.log(
            "Schedule flashcard " + JSON.stringify(flashcard) + " for deletion"
          );
          promises.push(self.deleteFlashcard(flashcard));
        }
        Promise.all(promises)
          .then(resolve)
          .catch(reject);
      })
      .catch(reject);
  });
};

/* PRIVATE */
self._getFlashcardsEntriesStore = function(flashcardName) {
  return "Flashcards_" + flashcardName;
};

self._getP = function() {
  return util.promisify(self.onestore.get.bind(self.onestore));
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
    self._validateValue(
      values[i],
      false,
      "Validating names in " + JSON.stringify(values) + ". "
    );
  }
};
self._validateKeys = function(obj) {
  for (var k in obj) {
    self._validateValue(
      obj[k],
      k == "from" || k == "to",
      "Validating key " + k + " in " + JSON.stringify(obj) + ". "
    );
  }
};
self._validateValue = function(value, onlyCheckNotEmpty, desc) {
  var err;
  if (!desc) desc = "";
  if (!value || value === "") {
    err = desc + "Disallowed undefined value";
  } else if (!onlyCheckNotEmpty && !/^[a-zA-Z0-9\-_ ]+$/.test(value)) {
    err = desc + "Invalid value [" + value + "]";
  }
  if (err) {
    console.error(err);
    throw err;
  }
};

export default self;
