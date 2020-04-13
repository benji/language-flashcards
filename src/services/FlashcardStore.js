import SimpleReactStore from "./SimpleReactStore";
import { faBalanceScaleLeft } from "@fortawesome/free-solid-svg-icons";

const self = {
  FLASHCARDS: "flashcards",
  DRAGGED_FLASHCARD_ID: "dragged-flashcard-id",
  APP_CONFIG: "app-config",
  IS_READY: "ready",
  ERROR: "error",
  FROMTO: "fromto",

  ...SimpleReactStore
};

// default values
self.set(self.FLASHCARDS, []);
self.set(self.DRAGGED_FLASHCARD_ID, null);
self.set(self.APP_CONFIG, {});
self.set(self.IS_READY, false);
self.set(self.ERROR, null);

export default self;
