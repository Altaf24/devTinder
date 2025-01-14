const express = require('express');
const connectDB =  require('./config/database');
const  app = express();
const cookieParser = require('cookie-parser');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('DEV@Tinder$798')); // Use same secret as JWT
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/requests');

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);


connectDB().then(()=>{
    console.log('DB connected');
    app.listen(56789,()=>{
        console.log('server is running on port 56789....');
    })
}).catch((err)=>{
    console.log(err);
})



