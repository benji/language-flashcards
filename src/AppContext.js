import React, { useState, useContext } from "react";
import flash_store from "./FlashStore";

const self = {
  flashcardEntries: {}
};

self.loadFlashcardEntries = function(flashcardName) {
  if (flashcardName in self.flashcardEntries) {
    return Promise.resolve(self.flashcardEntries[flashcardName]);
  }
  return flash_store.loadAllFlashcardEntries(flashcardName).then(entries => {
    self.flashcardEntries[flashcardName] = entries;
    return entries;
  });
};

export default self;
