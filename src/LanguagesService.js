import AppContext from "./AppContext";
import store from "./services/FlashcardStore";

const AllLanguages = require("./languages.json");

const self = {
  AllLanguages: AllLanguages
};

self.from = function() {
  return self._getById(store.get(store.APP_CONFIG).from).name;
};
self.to = function() {
  return self._getById(store.get(store.APP_CONFIG).to).name;
};

self._getById = function(id) {
  if (!(id in AllLanguages))
    throw new Error("Couldn't find language with ID=" + id);
  return AllLanguages[id];
};

export default self;
