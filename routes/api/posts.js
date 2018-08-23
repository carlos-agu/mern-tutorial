const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');



router.get('/test', (req, res) => {
    res.json({
        msg: 'Posts Works'
    });
});

//@route POST api/posts
//@desc     Create a Post
//@access

module.exports = router;