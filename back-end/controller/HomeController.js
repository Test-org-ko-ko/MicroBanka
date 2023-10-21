const path = require('path');

const controller = {
    login: function (req, res, next) {
        res.status(200).sendFile(path.join(__dirname, '../resource/view/home.html'));
    },
    register: function (req, res, next) {
        res.sendFile(path.join(__dirname, '../resource/view/register.html'));
    }
};

module.exports = controller;