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
                //currentUser.securityQtn = securityQtn;
                //currentUser.securityAns = securityAns;
                let existingUser = User.getAll().find(data=>data.id === currentUser.id);
                existingUser.email = currentUser.email;
                existingUser.address = currentUser.address;
                existingUser.phone = currentUser.phone;
                res.status(200).json(currentUser);
                return;
            }
        }
        res.status(400).json({ message: "Invalid request. Provide User data to update detail."});
    },
    getAllUsers: function (req, res, next) {
        res.status(200).json(User.getAll());
    },
    getAuthenticatedUser: function (req, res, next) {
        console.log(req.params);
        if (req.params) {
            const { username,password} = req.params;
            console.log(username,password);
            let authenticatedUser = User.getAll().find(data => data.name.toLowerCase() === username.toLowerCase() && data.password === password);
            if(authenticatedUser){
                currentUser = authenticatedUser;
                res.status(200).json(authenticatedUser);
                return;
            }
        }
        res.status(400).json({ message: "Invalid request. user authentication is invalid."});
    },
    getCurrentUser: function (req, res, next) {
        res.status(200).json(currentUser); 
    },
    // getAuthenticatedUserAccount: function(req,res,next){
    //     console.log(req.params);
    //     if(req.params){
    //         const {accountNumber} = req.params;
    //         console.log(accountNumber);
    //         //use this account to retrieve transactions and user info and add into userAccount obj
    //         let userAccount = {
    //             name: "",
    //             accountNumber :"",
    //             transactions : []
    //         };
    //         currentUser = getAuthenticatedUser();
    //         console.log(currentUser);  
    //     }
    // }
};

module.exports = controller;