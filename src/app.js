const express = require('express');
const connectDB =  require('./config/database');
const  app = express();
const User = require('./models/user');

app.use(express.json());


app.post('/signup',async(req,res)=>{
    // console.log(req.body);
    // const userObj = {
    //     firstName: "Virat",
    //     lastName: "Kohli",
    //     email: "virat@gmail.com",
    //     password: "virat@123",
    //     gender: "male",
    //     age: 35,
    // }
    // Creating a new instnce of User model
    const user = new User(req.body);

    try{
        await user.save();
        res.send('User created successfully');
    }catch(err){
        res.status(500).send("Error creating user");
    }

    
})

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
    app.listen(3000,()=>{
        console.log('server is running on port 3000....');
    })
}).catch((err)=>{
    console.log(err);
})



