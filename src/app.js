const express = require('express');
const connectDB =  require('./config/database');
const  app = express();
const User = require('./models/user');
const {validateSignUpData} = require('./utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {userAuth} = require('./middlewares/auth');



app.use(express.json());
app.use(cookieParser());



app.post('/signup',async(req,res)=>{
   
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

app.post('/login',async(req,res)=>{
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).send("Invalid credentials");
        }
        console.log(user.password);
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).send("Invalid credentials");
        }
        
        const token = await user.getJWT();
        res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
        });
        
        return res.json({ message: "Login successful" });
    }catch(err){
        res.status(500).send("Error logging in");
    }
});

app.get("/profile",userAuth, async (req, res) => {
    try {
       const user = req.user;
       
       res.send(user);
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
});
// Feed API - Get all users from DB

app.post("/sendConnectionRequest",userAuth, async (req, res) => {
    console.log("sendConnectionRequest");
    res.send("sendConnectionRequest");
    // try {
    //    const user = req.user;

    //    res.send(user);
    // } catch (error) {
    //     return res.status(401).json({ message: 'Invalid token' });
    // }
});

connectDB().then(()=>{
    console.log('DB connected');
    app.listen(56789,()=>{
        console.log('server is running on port 56789....');
    })
}).catch((err)=>{
    console.log(err);
})



