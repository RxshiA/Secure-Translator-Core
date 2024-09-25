/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const translate = require('translate-google');
const authMiddleware = require('../middleware/authMiddleware');
const translationController = require('../controllers/translationController')

router.post("/", authMiddleware, async (req, res) => {
    const { text, language } = req.body;

    const translation = await translate(text, {from: 'auto', to: language});
    res.status(200).json({translation: translation});
});

router.route('/', authMiddleware)
    .get(translationController.getAllTranslations)
    .post(translationController.createTrans)
    .patch(translationController.updateTranslation)

router.route('/:id', authMiddleware)
    .get(translationController.getATransaltion)
    .delete(translationController.deleteTranslation)
    .patch(translationController.updateTranslation)
    
module.exports = router;