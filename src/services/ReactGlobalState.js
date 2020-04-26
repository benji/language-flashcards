import { useState, useEffect } from "react";

const self = {
  // dataKey -> data object
  data: {},
  // dataKey -> react setter callbacks
  reactSetterCallbacks: {},
  componentIdCounter: 0
};

self.nextComponentId = () => self.componentIdCounter++;

self.get = dataKey => {
  if (!(dataKey in self.data)) {
    console.log("WARNING: [" + dataKey + "] has no default value!");
  }
  //console.log("SimpleReactStore.get", dataKey, self.data[dataKey]);
  return self.data[dataKey];
};

// dataKey -> setter
self.set = (dataKey, value) => {
  console.log("SET " + dataKey + "=" + value);
  //console.log("SimpleReactStore.set", dataKey, value);
  self.data[dataKey] = value;

  if (dataKey in self.reactSetterCallbacks) {
    if (dataKey === "authenticated")
      console.log("Calling react setter callbacks " + dataKey + "=" + value);
    const callbacks = self.reactSetterCallbacks[dataKey];
    for (var callback of callbacks) callback(value);
  } else {
    console.error("not in react callback: " + dataKey);
  }
};

// dirty hack to avoid this:
// React Hook "useState" cannot be called inside a callback. React Hooks must be called in a React function component or a custom React Hook function  react-hooks/rules-of-hooks
const getReactSetterCallback = dataKey => () => {
  // default to current value
  // trash the react value
  const [_, _setData] = useState(() => self.get(dataKey));
  return _setData;
};

// dirty hack to avoid this:
// React Hook "useState" cannot be called inside a callback. React Hooks must be called in a React function component or a custom React Hook function  react-hooks/rules-of-hooks
self.removeCallbackOnUnmount = (dataKey, reactSetterCallback) => () => {
  // on componentWillUnmount, remove callback
  useEffect(() => {
    return () => self.removeReactSetterCallback(dataKey, reactSetterCallback);
  }, []);
};

self.removeReactSetterCallback = (dataKey, reactSetterCallback) => {
  console.log("removeReactSetterCallback " + dataKey);
  const index = self.reactSetterCallbacks[dataKey].indexOf(reactSetterCallback);
  if (index > -1) {
    self.reactSetterCallbacks[dataKey].splice(index, 1);
  }
};

self.useState = function() {
  for (var dataKey of arguments) {
    if (!(dataKey in self.reactSetterCallbacks)) {
      self.reactSetterCallbacks[dataKey] = [];
    }

    // save the react state setter
    console.log("Calling react useState", dataKey);
    const reactSetterCallback = getReactSetterCallback(dataKey)();
    self.reactSetterCallbacks[dataKey].push(reactSetterCallback);

    self.removeCallbackOnUnmount(dataKey, reactSetterCallback)();
  }
};

self.update = (dataKey, createNewObjectFn) => {
  self.set(dataKey, createNewObjectFn(self.get(dataKey)));
};

export default self;
