const User = require("../model/User");

let currentUser;

const controller = {
    home: function(req, res, next) {
        const user = User.getAll().find(user => user.id === id);
        currentUser = user;
        // response
    },
    updateProfileDetails: function (req, res, next) {
        if (req.body) {
            const { email, address, phone, securityQtn, securityAns } = req.body;
            if (email || address || phone || securityQtn || securityAns) {
                currentUser.email = email;
                currentUser.address = address;
                currentUser.phone = phone;
                currentUser.securityQtn = securityQtn;
                currentUser.securityAns = securityAns;
                
                // response

                return;
            }
        }
        res.status(400).json({ message: "Invalid request. Provide User data to update detail."});
    }
};

module.exports = controller;