
const User = require("../models/User");
const Code = require("../models/Code");
const bcrypt = require("bcrypt");
const {generalAccessToken, generalRefreshToken, verifyToken, verifyRefreshToken, sendMail, passport} = require('../middlewares/auth');
const { Vonage } = require('@vonage/server-sdk')
const vonage = new Vonage({
    apiKey: process.env.API_KEY_SMS,
    apiSecret: process.env.API_SECRET_SMS
});

const login = async (req, res, next) => {
    try {
        // Lấy dữ liệu từ app
        const { username, password } = req.body;

        // Kiểm tra xem người dùng này có trong hệ thống hay không
        const user = await User.findOne({ username });

        /** Nêu có thì so sánh mật khẩu */
        if (user && (await bcrypt.compare(password, user.password))) {
            // Encode token
            const token = generalAccessToken({data: {username: user.username, role: user.role}});
            const refresh_token = generalRefreshToken({data: {username: user.username, role: user.role}});
            // save user token
            user.access_token = token;
            user.refresh_token = refresh_token;
            await user.save();
            // Trả thông tin về cho client (phía app)
            return res.status(201).json({
                success: true,
                message: "Đăng nhập thành công",
                access_token: token,
                refresh_token: refresh_token,
                role: user.role
            });
        }
        /*** Nếu ko có người dùng hoặc sai tài khoản
         * thì trả thông báo cho app
         */
        return res.status(200).json({
            success: false,
            message: "Tên người dùng hoặc mật khẩu không đúng"
        });
    } catch (err) {
        next(err)
    }
}

const register = async (req, res, next) => {
    try {
        const { username, phonenumber, email, fullName, password } = req.body;
        // Kiểm tra email này đã được đăng ký chưa
        const isUsername = await User.findOne({ username });
        const isEmail = await User.findOne({ email });
        const isPhone = await User.findOne({ phonenumber })
        if (isUsername || isEmail || isPhone) return res.status(200).json({
            success: false,
            message: "Tên người dùng, email hoặc số điện thoại đã tồn tại trong hệ thống"
        });
        /** Mã hóa mật khẩu */
        encryptedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({username, email, password: encryptedPassword, phonenumber: phonenumber, fullName: fullName});
        await newUser.save();

        /** Encode a token */
        const token = generalAccessToken({data: {username: newUser.username, role: newUser.role}});
        const refresh_token = generalRefreshToken({data: {username: newUser.username, role: newUser.role}});
        /** Lưu token vào cơ sở dữ liệu */
        newUser.access_token = token;
        newUser.refresh_token = refresh_token;
        await newUser.save();
        /** Phản hồi lại cho Client */
        return res.status(201).json({
            success: true,
            message: "Đăng ký tài khoản thành công",
            access_token: token,
            refresh_token: refresh_token,
            role: newUser.role
        })
    } catch (error) {
        next(error)
    }
}

const loginAdmin = (req, res, next) => {

}




module.exports = {
    register,
    login
}