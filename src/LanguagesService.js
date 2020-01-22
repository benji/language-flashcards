import AppContext from "./AppContext";
const AllLanguages = require("./languages.json");

const self = {
  AllLanguages: AllLanguages
};

self.from = function() {
  return self._getById(AppContext.configuration.from).name;
};
self.to = function() {
  return self._getById(AppContext.configuration.to).name;
};

self._getById = function(id) {
  if (!(id in AllLanguages)) throw new Error("Couldn't find language with ID=" + id);
  return AllLanguages[id];
};

export default self;
