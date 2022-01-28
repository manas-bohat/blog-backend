const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');

// REGISTER
router.post("/register", async (req, res) => {
    try {

        const pass = req.body.password;
        const username = req.body.username;
        const email = req.body.email;
        if(pass.length < 4)
            res.status(400).json("Password must be atleast 4 characters long");

        if(username.length == 0)
            res.status(400).json("Enter username");
        
        if(email.length == 0)
            res.status(400).json("Enter email");

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const user = await User.findOne({username: req.body.username});
        if(user) {
            res.status(400).json("Username already exists, try another one");
        }

        const user2 = await User.findOne({email: req.body.email});
        if(user2) {
            res.status(400).json("Email is already registered");
        }

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password : hashedPass
        });

        userPut = await newUser.save();  // users will be the collection
        // in which this user will get added (MongoDB plural thingy)
        res.status(200).json(userPut);
    } catch (err) {
        res.status(500).json(err);
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        if(!user) {
            res.status(400).json("Wrong credentials, try again");
        }

        const validated = await bcrypt.compare(req.body.password, user.password);
        if(!validated) { // passwords don't match
            res.status(400).json("Wrong credentials, try again");
        }
        
        // take everything in variable others except password.
        const { password, ...others } = user._doc;
        res.status(200).json(others);

    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router



