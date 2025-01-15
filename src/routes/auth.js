const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const {validateSignUpData} = require('../utils/validation');
const jwt = require('jsonwebtoken');
const authRouter = express.Router();

authRouter.post('/signup',async(req,res)=>{
   
    // const userObj = {
    //     firstName: "Virat",
    //     lastName: "Kohli",
    //     email: "virat@gmail.com",
    //     password: "virat@123",
    //     gender: "male",
    //     age: 35,
    // }
    // Creating a new instnce of User model
    validateSignUpData(req);
    const {firstName,lastName,email,password} = req.body;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password,10);
    console.log(passwordHash)
    

    const user = new User({
        firstName,
        lastName,
        email,
        password: passwordHash,
    });
    
    
    try{
        await user.save();
        res.send('User created successfully');
    }catch(err){
        res.status(400).send("Error:" + err.message);
    }

    
})

authRouter.post('/login', async(req,res)=>{
    const {email,password} = req.body;
    try{
        console.log("Login attempt for email:", email);
        const user = await User.findOne({email});
        if(!user){
            console.log("User not found");
            return res.status(400).send("Invalid credentials");
        }
        console.log("Found user:", user.email);
        const isMatch = await bcrypt.compare(password,user.password);
        console.log("Password match:", isMatch);
        if(!isMatch){
            return res.status(400).send("Invalid credentials");
        }
        const token = await user.getJWT();
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        return res.json({ message: "Login successful" });
    }catch(err){
        console.log("Login error:", err);
        res.status(500).send("Error logging in");
    }
});

authRouter.post('/logout', (req, res) => {
    res.cookie('token', null, { 
        expires: new Date(Date.now()) ,
    });
    res.send('Logout successful');

    // res.clearCookie('token');
    // res.json({ message: 'Logout successful' });
});

module.exports = authRouter;