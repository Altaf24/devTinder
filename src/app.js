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


connectDB().then(()=>{
    console.log('DB connected');
    app.listen(3000,()=>{
        console.log('server is running on port 3000....');
    })
}).catch((err)=>{
    console.log(err);
})



