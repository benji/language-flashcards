import ReactGlobalState from "./ReactGlobalState";

const self = {
  FLASHCARDS: "flashcards",
  DRAGGED_FLASHCARD_ID: "dragged-flashcard-id",
  APP_CONFIG: "app-config",
  IS_READY: "ready",
  ERROR: "error",
  FROMTO: "fromto",
  FLASHCARD_ENTRIES: "flashcard-entries",
  FLASHCARDS_ARRAY: "flashcards-array",
  AUTHENTICATED: "authenticated",
  AUTHENTICATING: "authenticating",

  ...ReactGlobalState
};

// default values
self.set(self.FLASHCARDS, []);
self.set(self.DRAGGED_FLASHCARD_ID, null);
self.set(self.APP_CONFIG, {});
self.set(self.IS_READY, false);
self.set(self.ERROR, null);
self.set(self.FLASHCARD_ENTRIES, {});
self.set(self.FLASHCARDS_ARRAY, null);
self.set(self.AUTHENTICATED, false);
self.set(self.AUTHENTICATING, false);

export default self;
