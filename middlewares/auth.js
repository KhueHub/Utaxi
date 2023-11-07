const JWT = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");
const nodemailer = require("nodemailer");
const GooglePlusTokenStrategy = require("passport-google-plus-token");
const passport = require('passport');
const JWTStrategy = require("passport-jwt").Strategy;
const {ExtractJwt} = require("passport-jwt");

// generate access token
const generalAccessToken = ({data}) => {
    const access_token  = JWT.sign({
        // project'owner
        iss: process.env.OWNER,
        // identify user
        sub: data
    }, process.env.JWT_SECRET, {expiresIn: 86400})

    return access_token
}

// generate refresh token
const generalRefreshToken = ({data}) => {
    const refresh_token  = JWT.sign({
        // project'owner
        iss: process.env.OWNER,
        // identify user
        sub: data,
    }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: 7776000})
    
    return refresh_token
}

// verify token
const verifyToken = async (token) => {
    return new Promise((resolve, reject) => {
        JWT.verify(token, process.env.JWT_SECRET, (err, payload) => {
            if(err){
               reject(err);
            }
            resolve(payload);
        })
    })
}

// verify refresh token
const verifyRefreshToken = async (refreshToken) => {
    return new Promise((resolve, reject) => {
        JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
            if(err){
               reject(err);
            }
            resolve(payload);
        })
    })
}



passport.use(new GooglePlusTokenStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
}, async (req, accessToken, refreshToken, profile, next) => {
    try {
        console.log('accessToken ', accessToken)
        console.log('refreshToken ', refreshToken)
        console.log('profile ', profile)
        // check user
        const user = await User.findOne({
            authGoogleID: profile.id,
            authType: 'google',
        })
        if(user){
            return res.status(200).json({
                success: true,
                message: "Đăng nhập thành công"
            })
        }
        

        // new account
        const newUser = new User({
            authType: 'google',
            email: profile.emails[0].value,
            authGoogleID: profile.id,
        })
        await newUser.save();
        return res.status(200).json({
            success: true,
            message: "Đăng nhập thành công"
        })
    } catch (error) {

    }
}));


const sendMail = async({email, code}) => {
    var transporter =  nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        requireTLS: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS_EMAIL
        }
    });
    var mainOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'XÁC THỰC ĐĂNG KÝ TÀI KHOẢN UTAXI',
        text: `Mã để chứng thực của bạn là : ${code}`
    }
    transporter.sendMail(mainOptions, function(err, info){
        if (err) {
            console.log(err);
        }
    });
}

module.exports = {
    sendMail,
    passport,
    generalAccessToken,
    generalRefreshToken,
    verifyToken,
    verifyRefreshToken,
}