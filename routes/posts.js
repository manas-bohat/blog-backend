const router = require("express").Router();
const User = require("../models/User"); 
const Post = require("../models/Post"); 
const fs = require('fs');

const PF = "http://localhost:5000/images/";

// CREATE POST
router.post("/", async (req, res) => {

    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch(err) {
        res.status(500).json(err);
    }
});

// UPDATE POST
router.put("/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(post.username === req.body.username){
            try{
                const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
                    $set : req.body
                }, { new : true }
            );
            res.status(200).json(updatedPost);
            } catch(err) {
                res.status(500).json(err);
            }
        } else {
            res.status(401).json("You can update only your post");
        }
    }catch(err){
        res.status(500).json(err);
    }
});

// DELETE POST
router.delete("/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(post.username === req.body.username){
            try{
                await post.delete();
                res.status(200).json("Your post has been deleted");
            } catch(err) {
                res.status(500).json(err);
            }
        } else {
            res.status(401).json("You can delete only your post");
        }
    }catch(err){
        res.status(500).json(err);
    }
});

// GET POST
router.get("/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    }catch(err){
        res.status(404).json("Post not found");
    }
})

// GET ALL POSTS
router.get("/", async (req, res) => {
    const username = req.query.user;    // if query has a user in like /?user="John"
    const catName = req.query.cat;      // if query has a category name like /?cat="music"
    try{
        let posts;  // array of posts
        if(username) {
            posts = await Post.find({username});
        } else if(catName) {
            posts = await Post.find({ categories : {
                $in:[catName]
            }})
        } else {
            posts = await Post.find();
        }
        res.status(200).json(posts);

    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router



