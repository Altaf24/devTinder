const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async(req,res,next) => {
   
   try{ 
    const {token} = req.cookies;
    if(!token) {
        return res.status(401).send("Unauthorized");
    }

    const decodedObj = await jwt.verify(token, "DEV@Tinder$798");
    const userId = decodedObj.id;


    const user = await User.findById(userId);
    if(!user) {
        return res.status(404).send("User not found");
    }

    req.user = user;
    next();
}catch(err){
    res.status(401).send("Unauthorized");
}
   
};

module.exports = {userAuth};