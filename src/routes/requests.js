const express = require('express');
const {userAuth} = require('../middlewares/auth');
const requestRouter  = express.Router();


requestRouter.post("/sendConnectionRequest",userAuth, async (req, res) => {
    console.log("sendConnectionRequest");
    res.send("sendConnectionRequest");
    // try {
    //    const user = req.user;

    //    res.send(user);
    // } catch (error) {
    //     return res.status(401).json({ message: 'Invalid token' });
    // }
});

module.exports = requestRouter;