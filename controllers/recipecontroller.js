const router = require('express').Router()
const validateSession = require('../middleware/validate-session');
const Recipe = require('../db').import('../models/recipe');

router.get('/practice', validateSession, (req, res) => {
    res.send('Hey!! This is a practice route!');
})
module.exports = router;