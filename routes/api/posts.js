const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const validatePostLogin = require('../../validation/post');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

//@route    GET api/posts
//@desc     Get Posts
//@access   Public
router.get('/', (req, res) => {
    Post.find().sort({
            date: -1
        })
        .then(posts => res.json(posts))
        .catch(err => res.status(400).json(err));
});

//@route    GET api/posts/:id
//@desc     Get a Post
//@access   Public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(400).json(err));
});

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
        avatar: req.body.avatar,
        user: req.user.id
    });
    newPost.save().then(post => res.json(post))
});

//@route    DELETE api/posts(:id)
//@desc     Create a Post
//@access   Private
router.delete('/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    //Check the owner
                    if (post.user.toString() !== req.user.id) {
                        //Unauthorized
                        res.status(401).json({
                            noauthorize: 'User not authorize'
                        });
                    } else {
                        post.remove().then(() => {
                            res.json({
                                success: 'Post Deleted'
                            });
                        })
                    }
                })
                .catch(err => res.status(400).json(err));
        })
});

//@route    POST api/posts/:id/like
//@desc     Like a Post
//@access   Private
router.post('/:id/like', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                        return res.status(400).json({
                            alreadyliked: 'User already like post'
                        });
                    }
                    post.likes.unshift({
                        user: req.user.id
                    });

                    post.save().then(post => res.json(post));
                })
                .catch(err => res.status(400).json(err));
        })
});

//@route    POST api/posts/:id/unlike
//@desc     Unlike a Post
//@access   Private
router.post('/:id/unlike', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                        return res.status(400).json({
                            notliked: 'You have not yet liked this post'
                        });
                    }
                    //Get remove index
                    const removeIndex = post.likes
                        .map(item => item.user.toString())
                        .indexOf(req.user.id)

                    // Splice from the array
                    post.likes.splice(removeIndex, 1);

                    post.save().then(post => res.json(post));
                })
                .catch(err => res.status(400).json(err));
        })
});

//@route    POST api/posts/:id/comment
//@desc     Create a comment 
//@access   Private
router.post('/:id/comment', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    const {
        isValid,
        errors
    } = validatePostLogin(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    Post.findById(req.params.id)
        .then(post => {
            const newComment = {
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar,
                user: req.user.id
            }
            post.comments.unshift(newComment);
            post.save().then(post => res.json(post))
                .catch(err => res.status(400).json(err));
        })

});


//@route    DELETE api/posts/:id/comment/:comment_id
//@desc     Remove a comment 
//@access   Private
router.delete('/:id/comment/:comment_id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {

    Post.findById(req.params.id)
        .then(post => {

            //First check to see if the comment exists
            if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
                return res.status(404).json({
                    commentnotexists: 'Comment does not exists'
                });
            }
            const removeIndex = post.comments.map(item => item._id.toString())
                .indexOf(req.params.comment_id);

            post.comments.splice(removeIndex, 1);
            post.save().then(post => res.json(post));
        })

});

module.exports = router;