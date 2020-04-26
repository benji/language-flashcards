var fs = require("fs");
var path = require("path");
var word_quizz = require("../../../farsi-quizz-translit/src/quizz_words");

function load_flashcard(name, items) {
  console.log("loading flashcard " + name + ".");
  const flashcard = {
    name: name,
    items: []
  };
  data.flashcards.push(flashcard);

  for (var i in items) {
    var e = items[i];
    var f = {
      from: e.farsi,
      to: e.eng,
      p: e.p ? e.p : ""
    };
    console.log(
      "Creating entry " + JSON.stringify(f) + " in flashcard " + name
    );
    flashcard.items.push(f);
  }
}

function migrate(fname) {
  var f = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "farsi-quizz-translit",
    "dicts",
    fname
  );
  var data = fs.readFileSync(f).toString();
  var items = word_quizz.loadData(data);
  console.log("Found " + fname + " with #items: " + items.length);

  load_flashcard(fname.replace(".txt", ""), items);
}

const data = {
  configuration: {
    from: "fa",
    to: "en"
  },
  flashcards: []
};

fs.readdirSync(
  path.join(__dirname, "..", "..", "..", "farsi-quizz-translit", "dicts")
).forEach(dfile => {
  if (dfile.indexOf("verbs") < 0) migrate(dfile);
});

console.log("--");
var totalEntries = 0;
for (var f of data.flashcards) {
  console.log("Flashcard " + f.name + ": " + f.items.length);
  totalEntries += f.items.length;
}
console.log("entries: " + totalEntries);

fs.writeFileSync("/tmp/data.json", JSON.stringify(data));
