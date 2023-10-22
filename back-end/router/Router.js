const express = require("express");
const homeController = require("../controller/HomeController");
const acctController = require("../controller/AccountController");
const userController = require("../controller/UserController");
const router = express.Router();

router.get('/', homeController.login);

router.get('/register', homeController.register);

router.post('/account', express.urlencoded({ extended: true }) ,
    acctController.createAccount);

router.post('/login/:username/:password', express.urlencoded({ extended: true }) ,
    userController.getAuthenticatedUser);

router.get('/users', userController.getAllUsers)


module.exports = router;