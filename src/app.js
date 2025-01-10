const express = require('express');

const  app = express();


app.get("/users",(req,res)=>{
    res.send({firstName:"sachin",lastName:"kumar"});
})
app.post("/users",(req,res)=>{
    console.log("Save data to the database");
    res.send("Data Succeessfully saved to the database");
})


app.use("/test",(req,res)=>{
    res.send('hello world hello');
})

app.listen(3000,()=>{
    console.log('server is running on port 3000....');
})