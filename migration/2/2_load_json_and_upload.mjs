import fs from "fs";
import path from "path";
import flash_store from "../../src/services/FlashcardStoreDAO.js";
import _OneStore from "onestore-client-node";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var onestore = new _OneStore.Client({
  jsonify: true,
  logger: {
    error: console.error,
    warn: console.log,
    info: console.log,
    debug: console.log
  }
});
flash_store.onestore = onestore;

function collect_ops() {
  var data = JSON.parse(fs.readFileSync("/tmp/data.json").toString());
  var ops = [];

  ops.push({
    type: "config",
    data: {
      from: "fa",
      to: "en"
    }
  });

  console.log(typeof data.flashcards);
  console.log(Object.keys(data));
  for (var flashcard of data.flashcards) {
    ops.push({
      type: "flashcard",
      data: {
        name: flashcard.name
      }
    });
    for (var item of flashcard.items) {
      ops.push({
        type: "item",
        flashcard: flashcard.name,
        data: item
      });
    }
  }

  return ops;
}

var dry_run = false;
var max_ops_per_token = 1400;
var done = false;

var ops = collect_ops();
console.log("total ops: " + ops.length);
var op_i = 0;

function next_batch() {
  if (done) {
    rl.close();
    console.log("DONE");
    return;
  }
  rl.question("onestore token: ", token => {
    console.log(`Using token token: ${token}`);
    //rl.close();

    onestore.onAuthenticationChanged = async function(auth) {
      if (!auth) {
        console.error("Auth failed.");
        process.exit(1);
      }
      await upload_next_batch();
    };
    onestore.useAccessToken(token);
  });
}

function build_op_promise(op) {
  if (op.type === "config") {
    return flash_store.saveConfiguration(op.data);
  } else if (op.type === "flashcard") {
    return flash_store.addFlashcard(op.data);
  } else if (op.type === "item") {
    return flash_store.addFlashcardEntry(op.flashcard, op.data);
  } else {
    throw new Error("Unknown op type " + op.type);
  }
}

async function upload_next_batch() {
  for (var i = 0; i < ops.length; i++) {
    var op = ops[op_i];
    console.log(op_i, JSON.stringify(op));
    await build_op_promise(op);
    op_i++;
    if (op_i % max_ops_per_token == 0) {
      done = false;
      setTimeout(next_batch, 100);
      return;
    }
  }
  if (!dry_run) {
  }
  done = true;
}

next_batch();
