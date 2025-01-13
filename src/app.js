const express = require('express');
const connectDB =  require('./config/database');
const  app = express();
const User = require('./models/user');
const {validateSignUpData} = require('./utils/validation');
const bcrypt = require('bcrypt');


app.use(express.json());


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
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).send("Invalid credentials");
        }
        res.send("Login successful");
    }catch(err){
        res.status(500).send("Error logging in");
    }
});

// Feed API - Get all users from DB

app.get('/feed',async(req,res)=>{
    try{
        const users = await User.find();
        res.send(users);
    }catch(err){
        res.status(500).send("Error fetching users");
    }
});

app.delete("/user",async(req,res)=>{
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    }catch(err){
        res.status(500).send("Error deleting user");
    }


})

// update user
app.patch('/user',async(req,res)=>{
    const userId = req.body.userId;
    const data = req.body;

    

    try{
        const ALLOWED_UPDATES = ["firstName","lastName","userId","skills","gender","age","photoUrl","about"];
        const isUpdateAllowed = Object.keys(data).every((key)=>{
        return ALLOWED_UPDATES.includes(key);
    });
    if(!isUpdateAllowed){
        throw new Error("Invalid update request");
    }
    if(data?.skills.length > 10){
        throw new Error("Skills array cannot be more than 10");

    }


    await User.findByIdAndUpdate({_id:userId},data,{returnDocument:"after",runValidators:true,});
    res.send("User updated successfully");
    }catch(err){
        res.status(500).send("Error updating user");
    }
})

connectDB().then(()=>{
    console.log('DB connected');
    app.listen(56789,()=>{
        console.log('server is running on port 56789....');
    })
}).catch((err)=>{
    console.log(err);
})



