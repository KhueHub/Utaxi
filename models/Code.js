const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CodeSchema = new Schema({
    email: {
        type: String,
    },
    code: {
        type: String,
    }
},{
    timestamps: true
})

const Code = mongoose.model("Code", CodeSchema);
module.exports = Code