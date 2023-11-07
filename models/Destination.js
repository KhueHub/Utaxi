const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DestinationSchema = new Schema({
    placeName: {
        type: String
    },
    latitude: {
        type: String,
        required: true
    },
    longitude: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
},{
    timestamps: true
})

const Destination = mongoose.model("Destination", DestinationSchema);
module.exports = Destination;