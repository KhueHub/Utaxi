// config env
require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const dbConfig = require("./configs/db.config");
// connect database
mongoose.set('strictQuery', false);
mongoose.connect(dbConfig.MONGO_URL)
    .then(() => console.log("Connect database successfully"))
    .catch((err) => console.log(`Connect database failed with error ${err}`));

const app = express();
const destinationRoute = require('./routes/destination');
const userRoute = require('./routes/user');
const bodyParser = require("body-parser");

// Middlewares
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(express.json());

app.get("/", async (req, res, next) => {
    return res.status(200).json({
        message: "Server is ok"
    })
})

app.use('/api/destinations', destinationRoute);
app.use('/api/users', userRoute);

// Catch error and handle
app.use((req, res, next) => {
    const err = new Error("Not found");
    err.status = 404;
    next(err);
})
// error handle function
app.use((err, req, res, next) => {
    const error = app.get("env") === "development" ? err : {};
    const status = err.status || 500;
    // response to client
    if(err.name == "TokenExpiredError"){
        return res.status(status).json({
            success: false,
            message: "Tài khoản này hết phiên làm việc"
        })
    }
    return res.status(status).json({
        error:{
            message: err.message
        }
    })
})

// start the server
const port = app.get("port") || process.env.PORT;
app.listen(port, ()=> console.log(`Server is running at ${port}`))