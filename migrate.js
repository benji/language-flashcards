if (process.argv.length != 3) {
  console.log("args: <token>");
  return;
}

var dry_run = false
var token = process.argv[2];
console.log("Using token: " + token);

var fs = require("fs");
var path = require("path");
var assert = require("assert");
var word_quizz = require("../farsi-quizz-translit/src/quizz_words");
var OneStore = require("onestore-client-node");

var onestore = new OneStore.Client({
  jsonify: true,
  onAuthenticationChanged: function (auth) {
    if (auth) {
      migrateAll();
    }
  },
  logger: {
    error: console.error,
    warn: console.log,
    info: console.log,
    debug: console.log
  }
});
onestore.useAccessToken(token);

function upload_to_onestore(name, items) {
  console.log("creating flashcard " + name + ".");
  if (!dry_run) onestore.create("Flashcards", { name: name }, function (e, r) {
    if (e) console.error("Failed to create flashcard " + name)
    else console.log("created flashcard " + name)
  });

  for (var i in items) {
    var e = items[i];
    var f = {
      from: e.farsi,
      to: e.eng,
      p: e.p ? e.p : ""
    };
    console.log("Creating entry " + JSON.stringify(f) + " in flashcard " + name)
    console.log("saving", f);
    if (!dry_run) onestore.create("Flashcards_" + name, f, function (e, r) {
      if (e) console.error("failed to create entry " + JSON.stringify(f) + " in flashcard " + name)
      else console.log("created entry in flashcard " + name)
    });
  }
}

function migrate(fname) {
  var f = path.join(__dirname, "..", "farsi-quizz-translit", "dicts", fname);
  var data = fs.readFileSync(f).toString();
  var items = word_quizz.loadData(data);
  console.log(items.length);

  upload_to_onestore(fname.replace(".txt", ""), items);
}

const uuid0 = '00000000-0000-0000-0000-000000000000'

function migrateAll() {
  onestore.update('Configuration', uuid0, {
    from: 'fa', to:'en'
  })
  fs.readdirSync(
    path.join(__dirname, "..", "farsi-quizz-translit", "dicts")
  ).forEach(dfile => {
    if (dfile.indexOf("verbs") < 0) migrate(dfile);
  });
}
