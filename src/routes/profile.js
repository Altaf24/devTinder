const express = require('express');
const {userAuth} = require('../middlewares/auth');
const profileRouter = express.Router();



profileRouter.get("/profile",userAuth, async (req, res) => {
    try {
       const user = req.user;
       
       res.send(user);
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
});

module.exports = profileRouter;