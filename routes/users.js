const router = require("express").Router();
const User = require("../models/User"); 
const Post = require("../models/Post"); 
const bcrypt = require('bcrypt');

// UPDATE
router.put("/:id", async (req, res) => {

    if(req.body.userId === req.params.id) {
        
        if(req.body.username.length === 0)
            res.status(400).json("Enter username");

        if(req.body.email.length === 0)
            res.status(400).json("Enter email");

        if(req.body.password.length >= 4){
                
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        else{
            res.status(400).json("Password must have atleast 4 characters");
        }

        try {
            const result = await User.findById(req.params.id);
            const updatePostName = result.username;

            try {
                const res = await Post.updateMany({username: updatePostName}, {$set :{username: req.body.username}});
                console.log(res);
            } catch(err) {
                console.log("Couldn't delete any posts");
            }

            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, {  new: true  });

            res.status(200).json(updatedUser);

        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(401).json("You can update only your account");
    }
});

// DELETE
router.delete("/:id", async (req, res) => {

    console.log(req.body.userId);
    console.log(req.params.id);

    if(req.body.userId === req.params.id) {
        try {

            const user = await User.findById(req.params.id);

            try {
                await Post.deleteMany({username : user.username});  // delete all posts of user before deleting their account
                await User.findByIdAndDelete(req.params.id);
                res.status(200).json("User has been deleted");

            } catch (err) {
                res.status(500).json(err);
        } } catch(err) {
            res.status(404).json("User not found");
        }
    } else {
        res.status(401).json("You can delete only your account");
    }
});

// GET USER
router.get("/:id", async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router



