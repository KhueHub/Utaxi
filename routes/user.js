const router = require("express-promise-router")();
const UserController = require("../controllers/user");
const passport = require('../middlewares/auth');

router.route('/login')
    .post(UserController.login)

router.route('/register')
    .post(UserController.register)

module.exports = router;