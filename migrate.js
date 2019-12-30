if (process.argv.length != 3) {
  console.log("args: <token>");
  return;
}

var dry_run = true
var token = process.argv[2];
console.log("Using token: " + token);

var fs = require("fs");
var path = require("path");
var assert = require("assert");
var word_quizz = require("../farsi-quizz-translit/src/quizz_words");
var OneStore = require("onestore-client-node");

var onestore = new OneStore.Client({
  jsonify: true,
  onAuthenticationChanged: function(auth) {
    if (auth) {
      migrateAll();
    }
  }
});
onestore.useAccessToken(token);

function upload_to_onestore(name, items) {
  console.log("creating flashcard " + name + ".");
  if (!dry_run) onestore.create("Flashcards", { name: name });

  for (var i in items) {
    var e = items[i];
    var f = {
      from: e.farsi,
      to: e.eng,
      p: e.p ? e.p : ""
    };
    console.log("saving", f);
    if (!dry_run) onestore.create("Flashcards_" + name, f);
  }
}

function migrate(fname) {
  var f = path.join(__dirname, "..", "farsi-quizz-translit", "dicts", fname);
  var data = fs.readFileSync(f).toString();
  var items = word_quizz.loadData(data);
  console.log(items.length);

  upload_to_onestore(fname.replace(".txt", ""), items);
}

function migrateAll() {
  fs.readdirSync(
    path.join(__dirname, "..", "farsi-quizz-translit", "dicts")
  ).forEach(dfile => {
    if (dfile.indexOf("verbs") < 0) migrate(dfile);
  });
}
