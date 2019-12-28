import AppContext from "./AppContext";
const AllLanguages = require("./languages.json");

const self = {
  AllLanguages: AllLanguages
};

self.from = function() {
  return AllLanguages[AppContext.configuration.from].name
}
self.to = function() {
  return AllLanguages[AppContext.configuration.to].name
}

export default self;
