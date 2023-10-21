const express = require("express");
const homeController = require("../controller/HomeController");
const acctController = require("../controller/AccountController");
const router = express.Router();

router.get('/', homeController.login);

router.get('/register', homeController.register);

router.post('/account', express.urlencoded({ extended: true }) ,
    acctController.createAccount);



module.exports = router;