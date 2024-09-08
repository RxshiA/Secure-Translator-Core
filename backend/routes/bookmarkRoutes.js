const express = require("express");
const router = express.Router();
let Bookmark = require("../models/bookmarks");

//adding a bookmark
router.route("/add").post((req, res) => {
  const word = req.body.word;
  const definitions = req.body.definitions;

  const newBookmark = new Bookmark({
    word,
    definitions,
  });

  newBookmark
    .save()
    .then(() => {
      res.json("Bookmark successfully added");
    })
    .catch((err) => {
      res.json("Unsuccessfull adding");
      console.log(err.message);
    });
});

//deleting a bookmark
router.route("/delete/:word").post((req, res) => {
  let word = req.params.word;
  let filter = { word: word };

  Bookmark.deleteOne(filter)
    .then(() => {
      res.json("bookmark successfully deleted");
    })
    .catch((err) => {
      res.json("Unsuccessfull delete");
      console.log(err.message);
    });
});

//retrieving all the bookmarks
router.route("/").get((req, res) => {
  Bookmark.find()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json("Cannot retrieve");
      console.log(err.message);
    });
});

//search with the bookmarks
router.route("/search/:word").get((req, res) => {
  let word = req.params.word;

  Bookmark.findOne({ word: word })
    .then((rst) => {
      res.json(rst);
    })
    .catch((err) => {
      res.json("word doesn't exist in bookmark list");
      console.log(err.message);
    });
});

module.exports = router;
