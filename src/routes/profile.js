const express = require('express');
const {userAuth} = require('../middlewares/auth');
const { validateSignUpData } = require('../utils/validation');
const { validateEditProfileData } = require('../utils/validation');
const profileRouter = express.Router();



profileRouter.get("/profile/view",userAuth, async (req, res) => {
    try {
       const user = req.user;
       
       res.send(user);
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid Edit REquest");
        }
        
        const loggedInUser = req.user;
     
        
        // Update user fields
        Object.keys(req.body).forEach((update) => {
            loggedInUser[update] = req.body[update];
        });
        
        // Save the updated user
        await loggedInUser.save();
        
        res.json({
            message: "Profile updated successfully",
            user: loggedInUser
        });
        
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});


module.exports = profileRouter;