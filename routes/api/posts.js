const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const validatePostLogin = require('../../validation/post');

const Post = require('../../models/Post');
//@route    POST api/posts
//@desc     Create a Post
//@access   Private
router.post('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    const {
        isValid,
        errors
    } = validatePostLogin(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.name,
        user: req.user.id
    });
    newPost.save().then(post => res.json(post))
});

module.exports = router;