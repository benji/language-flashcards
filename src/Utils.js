import store from "./services/FlashcardStore";

const self = {};

self.shuffleArray = function(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

self.goto = function(props, path) {
  // console.trace("GOTO " + path);
  if (props.history) {
    props.history.push(path);
  }
};
self.gotoFn = function(props, path) {
  return function() {
    self.goto(props, path);
  };
};

self.handleError = function(e) {
  console.error(e);
  store.set(store.IS_READY, true);
  store.set(store.ERROR, e);
};

export default self;
