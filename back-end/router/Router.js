const express = require("express");
const homeController = require("../controller/HomeController");
const acctController = require("../controller/AccountController");
const userController = require("../controller/UserController");
const router = express.Router();

router.get('/', homeController.login);

router.get('/register', homeController.register);

router.post('/account', express.urlencoded({ extended: true }) ,
    acctController.createAccount);

router.post('/login/:username/:password', express.urlencoded({ extended: false }) ,
    userController.getAuthenticatedUser);

router.get('/users', userController.getAllUsers);

router.post('/transfer', express.urlencoded({ extended: true }), 
    acctController.transfer)

router.get('/currentuser', userController.getCurrentUser);

router.get('/currentaccount', acctController.getCurrentAccount);

router.get('/findaccount/:accountNumber', acctController.findAccount);


module.exports = router;