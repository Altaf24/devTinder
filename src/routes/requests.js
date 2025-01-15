const express = require('express');
const {userAuth} = require('../middlewares/auth');
const requestRouter  = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");


requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["interested","ignored"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({message: "Invalid status"});
        }

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({message: "User not found"});
        }

        

        
        
        const existingConnectionRequest =  await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId},
                { fromUserId: toUserId, toUserId: fromUserId},
            ],
           
        }); 
        


        if (existingConnectionRequest) {
            return res.status(400).json({message: "Connection request already exists"});
        }
        

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        const data = await connectionRequest.save();

        // Send only one response
        res.json({
            message: req.user.firstName + " " + req.user.lastName +"   "+ status + "  " + toUser.firstName + " " + toUser.lastName,
            data,
        });

    } catch (err) {
        res.status(401).send("ERROR: " + err.message);
    }
});
  

module.exports = requestRouter;