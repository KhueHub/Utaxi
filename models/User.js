const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    fullName : {
        type: String,
    },
    email : {
        type: String,
        unique: true,
        lowercase: true
    },
    phonenumber: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    address: {
        type: String,
    },
    gender: {
        type: String,
        default: ""
    },
    avatar: {
        type: String,
        default: "",
    },
    role: {
        type: String,
        enum: ['admin', 'client', 'driver'],
        default: 'client'
    },
    access_token: {
        type: String
    },
    refresh_token: {
        type: String
    }
},{
    timestamps: true
})

const User = mongoose.model("User", UserSchema);
module.exports = User