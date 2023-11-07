const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CabSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category"
    },
    delete_flag: {
        type: Boolean,
        default: false,
    },
    status: {
        type: Boolean,
        default: true,
    }
},{
    timestamps: true
})

const Cab = mongoose.model("Cab", CabSchema);
module.exports = Cab