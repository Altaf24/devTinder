const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
     
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:['ignored','interested','accepted','rejected'],
            message:'{VALUE} is incorrect status type'
        }, 
    },
},{
    timestamps:true,
});

// 
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre('save', async function(next) {
    const connectionRequest = this;
    // Check if the fromUserId and toUserId are the same
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error('fromUserId and toUserId cannot be the same');
    }



    // if (connectionRequest.isModified('status')) {
    //     if (connectionRequest.status === 'accepted') {
    //         const fromUser = await User.findById(connectionRequest.fromUserId);
    //         const toUser = await User.findById(connectionRequest.toUserId);
    //         if (fromUser && toUser) {
    //             fromUser.connections.push(connectionRequest.toUserId);
    //             toUser.connections.push(connectionRequest.fromUserId);
    //             await fromUser.save();
    //             await toUser.save();
    //         }
    //     }
    // }
    next();
});


const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel;