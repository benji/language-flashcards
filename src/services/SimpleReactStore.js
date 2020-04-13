import { useState } from "react";

const self = {
  // dataKey -> data object
  data: {},
  // dataKey -> react setter callback
  reactSetterCallback: {}
};

self.get = dataKey => {
  if (!(dataKey in self.data)) {
    console.log("WARNING: [" + dataKey + "] has no default value!");
  }
  //console.log("SimpleReactStore.get", dataKey, self.data[dataKey]);
  return self.data[dataKey];
};

// dataKey -> setter
self.set = (dataKey, value) => {
  //console.log("SimpleReactStore.set", dataKey, value);
  self.data[dataKey] = value;

  if (dataKey in self.reactSetterCallback) {
    //console.log("Calling react setter callback", dataKey);
    self.reactSetterCallback[dataKey](value);
  }
};

// dirty hack to avoid this:
// React Hook "useState" cannot be called inside a callback. React Hooks must be called in a React function component or a custom React Hook function  react-hooks/rules-of-hooks
const getReactSetterCallback = dataKey => () => {
  const [_, _setData] = useState(self.get(dataKey));
  return _setData;
};

self.useState = function() {
  // reset all callback from previous component
  self.reactSetterCallback = {};

  for (var dataKey of arguments) {
    // default to current value
    // trash the react value
    // save the react state setter
    console.log("Calling react useState", dataKey);
    self.reactSetterCallback[dataKey] = getReactSetterCallback(dataKey)();
  }
};

export default self;
