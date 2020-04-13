import flash_store from "./FlashStore";
import store from "./services/FlashcardStore";

const self = {
  flashcardEntries: {},
  flashcardsArray: undefined
};

self.handleError = function(e) {
  console.error(e);
  store.set(store.IS_READY, true);
  store.set(store.ERROR, e);
};

self.loadFlashcardEntries = function(flashcardName) {
  if (flashcardName in self.flashcardEntries) {
    return Promise.resolve(self.flashcardEntries[flashcardName]);
  }
  return flash_store.loadAllFlashcardEntries(flashcardName).then(r => {
    const entries = r.data;
    self.flashcardEntries[flashcardName] = entries;
    return entries;
  });
};

self.getCachedFlashcardsArray = function() {
  return new Promise(function(resolve, reject) {
    if (self.flashcardsArray) return resolve(self.flashcardsArray);
    flash_store
      .listFlashcards()
      .then(r => {
        var arr = r.data;

        self.flashcardsArray = arr.sort(function(a, b) {
          return a.userdata.name - b.userdata.name;
        });

        resolve(self.flashcardsArray);
      })
      .catch(reject);
  });
};

self.findFlashCardByName = function(name) {
  return new Promise(function(resolve, reject) {
    return self
      .getCachedFlashcardsArray()
      .then(flashcards => {
        for (var i = 0; i < flashcards.length; i++) {
          if (flashcards[i].userdata.name === name)
            return resolve(flashcards[i]);
        }
        resolve();
      })
      .catch(reject);
  });
};

self.addFlashcard = function(flashcard) {
  self.flashcardEntries[flashcard.userdata.name] = [];
  self.flashcardsArray.push(flashcard);
};

self.removeFlashcard = function(flashcard) {
  delete self.flashcardEntries[flashcard.userdata.name];
  self.flashcardsArray = self.flashcardsArray.filter(function(f, idx) {
    return f.id !== flashcard.id;
  });
};

self.deleteAll = function() {
  self.flashcardEntries = {};
  self.flashcardsArray = [];
};

export default self;
