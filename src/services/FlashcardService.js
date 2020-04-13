import flash_store from "./FlashcardStoreDAO";
import store from "./FlashcardStore";

const self = {};

self.getFlashcardEntries = () => store.get(store.FLASHCARD_ENTRIES);
self.getFlashcardsArray = () => store.get(store.FLASHCARDS_ARRAY);

self.loadFlashcardEntries = function(flashcardName) {
  if (flashcardName in self.getFlashcardEntries()) {
    return Promise.resolve(self.getFlashcardEntries()[flashcardName]);
  }
  return flash_store.loadAllFlashcardEntries(flashcardName).then(r => {
    const entries = r.data;
    store.update(store.FLASHCARD_ENTRIES, flashcardEntries => {
      const newFlashcardEntries = {
        ...flashcardEntries
      };
      newFlashcardEntries[flashcardName] = entries;
      return newFlashcardEntries;
    });
    // self.getFlashcardEntries()[flashcardName] = entries;
    console.log("loaded entries", entries);
    return entries;
  });
};

self.getCachedFlashcardsArray = function() {
  return new Promise(function(resolve, reject) {
    if (self.getFlashcardsArray()) return resolve(self.getFlashcardsArray());
    flash_store
      .listFlashcards()
      .then(r => {
        var arr = r.data;
        const flashcardsArray = arr.sort(function(a, b) {
          return a.userdata.name - b.userdata.name;
        });

        store.set(store.FLASHCARDS_ARRAY, flashcardsArray);

        console.log("loaded flashcards array", flashcardsArray);
        resolve(flashcardsArray);
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
  self.getFlashcardEntries()[flashcard.userdata.name] = [];
  store.update(store.FLASHCARDS_ARRAY, arr => [...arr, flashcard]);
  //self.flashcardsArray.push(flashcard);
};

self.removeFlashcard = function(flashcard) {
  store.update(store.FLASHCARD_ENTRIES, flashcardEntries => {
    const newFlashcardEntries = {
      ...flashcardEntries
    };
    delete newFlashcardEntries[flashcard.userdata.name];
    return newFlashcardEntries;
  });
  // delete self.getFlashcardEntries()[flashcard.userdata.name];
  store.update(store.FLASHCARDS_ARRAY, arr =>
    arr.filter(function(f, idx) {
      return f.id !== flashcard.id;
    })
  );
  //self.flashcardsArray = self.flashcardsArray.filter(function(f, idx) {
  //  return f.id !== flashcard.id;
  //});
};

self.deleteAll = function() {
  store.set(store.FLASHCARD_ENTRIES, {});
  //self.flashcardEntries = {};
  store.set(store.FLASHCARDS_ARRAY, []);
  //self.flashcardsArray = [];
};

export default self;
