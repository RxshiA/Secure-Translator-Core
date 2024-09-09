const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const JWT_SECRET = "asdcasdcqwe211SDCCASCASD"

// Register
router.post("/", async (req, res) => {
    try {
        let { first_name, last_name, email, password } = req.body;

        // validate
        if (!first_name || !email || !password || !last_name)
            return res.status(400).json({ msg: "Not all fields have been entered." });
        if (password.length < 5)
            return res
                .status(400)
                .json({ msg: "The password needs to be at least 5 characters long." });

        const existingUser = await User.findOne({ email: email });
        if (existingUser)
            return res
                .status(400)
                .json({ msg: "An account with this email already exists." });

        if (!first_name) first_name = email;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            first_name,
            last_name,
            email,
            password: passwordHash,
        });
        const savedUser = await newUser.save();
        res.json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//UserProfile
router.post("/profile", async (req, res) => {
    const { token } = req.body;
    try {
        const user = jwt.verify(token, JWT_SECRET, (err,res)=>{
            if(err)
                return "token expired";
            else
                return res;
        });
        console.log(user);
        if(user === "token expired")
            return res.send({status:"error", data:"token expired"});
        const user_email = user.email;
        User.findOne({ email: user_email }).then((data) => {
            res.send({status:"ok", data:data});
        }).catch((err) => {
            res.send({status:"error", data:err});
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Login
router.post("/login", async (req, res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email:email});
        if(!user)
            return res.status(400).json({msg:"No account with this email has been registered."});
        if(await bcrypt.compare(password, user.password)){
            const token = jwt.sign({email:user.email}, JWT_SECRET, {
                expiresIn: "2days"
            });
            if(res.status(201))
                return res.json({status: "ok", data: token});
            else    
                return res.json({error:"Invalid credentials"});
        }
        res.json({error:"Invalid credentials"});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;