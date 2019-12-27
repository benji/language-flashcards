import _OneStore from "onestore-client-node";
const util = require("util");

const store_languages = "Languages";

const self = {};
var onestore;

self.load = function(onAuthenticationChanged) {
  console.log("Loading OneStore client...");
  onestore = new _OneStore.Client({
    jsonify: true,
    widgetElementId: "onestore-widget-container",
    widgetAuthMethod: "popup.auto",
    onAuthenticationChanged: onAuthenticationChanged
  });
};

self.listP = function() {
  return util.promisify(onestore.list.bind(onestore));
};
self.createP = function() {
  return util.promisify(onestore.create.bind(onestore));
};

self.listLanguages = function() {
  return self.listP()(store_languages, {});
};

self.addLanguage = function(languageName) {
  self.validateNames([languageName]);
  return self.createP()(store_languages, { name: languageName });
};

self.getFlashcardsStore = function(languageName) {
  self.validateNames([languageName]);
  return "Flashcards_" + languageName;
};

self.listFlashcards = function(languageName) {
  self.validateNames([languageName]);
  return self.listP()(self.getFlashcardsStore(languageName), {});
};

self.addFlashcard = function(languageName, flashcardName) {
  self.validateNames([languageName, flashcardName]);
  return self.createP()(self.getFlashcardsStore(languageName), {
    name: flashcardName
  });
};

self.getFlashcardsEntriesStore = function(languageName, flashcardName) {
  self.validateNames([languageName, flashcardName]);
  return "Flashcards#" + languageName + "#" + flashcardName;
};

self.listflashcardEntries = function(languageName, flashcardName) {
  self.validateNames([languageName, flashcardName]);
  return self.listP()(
    self.getFlashcardsEntriesStore(languageName, flashcardName),
    {}
  );
};

self.addFlashcardEntry = function(
  languageName,
  flashcardName,
  newEntryFrom,
  newEntryTo,
  newEntryPronounciation
) {
  self.validateNames([
    languageName,
    flashcardName,
    newEntryFrom,
    newEntryTo,
    newEntryPronounciation
  ]);
  return self.createP()(
    self.getFlashcardsEntriesStore(languageName, flashcardName),
    {
      from: newEntryFrom,
      to: newEntryTo,
      p: newEntryPronounciation
    }
  );
};
self.validateNames = function(values) {
  for (var i in values) {
    var value = values[i];
    if (!value) throw "Disallowed undefined value";
    if (!/^[a-zA-Z0-9\-_ ]+$/.test(value))
      throw "Invalid value [" + value + "]";
  }
};

export default self;
