const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
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

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category