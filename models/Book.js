const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    ref_code: {
        type: String,
        required: true
    },
    client: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    cab: {
        type: Schema.Types.ObjectId,
        ref: "Cab"
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

const Book = mongoose.model("Book", BookSchema);
module.exports = Book