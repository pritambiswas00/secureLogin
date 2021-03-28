const express = require('express')

const router = express.Router();
const { ensureAuth } = require('../Authentication/logoutCheck')

///Home page
router.get('/', (req, res) => {
    res.render('homepage')
})

///Dash Board

router.get('/dashboard',ensureAuth, (req, res) => {
    res.render('dashboard', {
        name : req.user.name
    })
})


module.exports = router;