const mongoose = require('mongoose');

const connectDB = async() => {
    await mongoose.connect(
        "mongodb+srv://namastepiter:namaste_piter@namastenode.7o8za.mongodb.net/devTinder "
    );
};



module.exports = connectDB;