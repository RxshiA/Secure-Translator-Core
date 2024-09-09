const express = require("express")
const router = express.Router()
const Game = require("../models/gameModel")
const pdfTemplate = require('../models/gameReport')
const pdf = require('html-pdf')
const path = require('path')

router.post("/", async (req, res) => {
    const { email, points } = req.body;

    const newGame = new Game({
        email,
        points
    })

    newGame.save().then(() => {
        res.json("Game Added")
    }).catch((err) => {
        console.log(err);
    })
});

router.get("/", async (req, res) => {
    try {
        const games = await Game.find();
        res.json(games);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/:email", async (req, res) => {
    const email = req.params.email;
    try {
        const data = await Game.find({ email: email });
        if (!data) {
          return res.status(404).json({ message: "Email not found" });
        }
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/:email", async (req, res) => {
    const email = req.params.email;
    const { points } = req.body;

    // Find the game document by email and update its points
    Game.findOneAndUpdate(
        { email: email },
        { points: points },
        { new: true } // To return the updated document
    )
    .then((updatedGame) => {
        if (!updatedGame) {
            // If the email doesn't exist, return an error
            return res.status(404).json({ message: "Email not found" });
        }
        res.json(updatedGame); // Return the updated game document
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

router.post('/createpdf', async (req, res) => {
    pdf.create(pdfTemplate(req.body), {}).toFile('leaderboard.pdf', (err) => {
        if (err) {
            return Promise.reject();
        }
        res.send('PDF generated')
    });
});

router.get('/fetchpdf', async (req, res) => {
    res.sendFile(path.join(__dirname, '../leaderboard.pdf'))
});

module.exports = router;