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
                let existingUser = User.getAll().find(data=>data.id === currentUser.id);
                if(existingUser){
                    existingUser.email = currentUser.email;
                    existingUser.address = currentUser.address;
                    existingUser.phone = currentUser.phone;
                    res.status(200).json(currentUser);
                }
                else{
                    res.status(400).json({message: "Bad Request, only existing user can be modified."});
                }
                
            }
        }
        res.status(400).json({ message: "Invalid request. Provide User data to update detail."});
    },
    getAllUsers: function (req, res, next) {
        res.status(200).json(User.getAll());
    },
    getAuthenticatedUser: function (req, res, next) {
        console.log('in usercontroler param', req.params);
        console.log('in usercontroler body', req.body);
        if (req.params) {
            const { username, password } = req.params;
            console.log(username,password);
            let authenticatedUser = User.getAll().find(data => data.name.toLowerCase() === username.toLowerCase() && data.password === password);
            console.log('existing users', User.getAll());
            if(authenticatedUser){
                currentUser = authenticatedUser;
                res.status(200).json({
                    accountNumber: authenticatedUser.account.accountNumber,
                    token: `${authenticatedUser.name}-${Date()}`
                });
                return;
            }
            else {
                res.status(404).json({ message: "User not found."});
                return;
            }
        }
        res.status(400).json({ message: "Invalid request. user authentication is invalid."});
    },
    getCurrentUser: function (req, res, next) {
        res.status(200).json(currentUser); 
    },
    changePassword: function (req, res, next) {
        if (req.body) {
            const { username, password, securityQtn, securityAns } = req.body;
            
            if (username) {
                const userToChangePasswod = User.getAll().find(user => 
                    username.toLowerCase() === user.name.toLowerCase()
                );
                if (!userToChangePasswod
                    || securityQtn.toLowerCase() !== userToChangePasswod.securityQtn.toLowerCase() 
                    || securityAns.toLowerCase() !== userToChangePasswod.securityAns.toLowerCase()) {
                        
                    res.status(400).json({ message: "Security Question and Answer provided is not matched."});
                    return;
                }
                userToChangePasswod.password = password;
                res.status(200).json(userToChangePasswod);
            }
        }
        res.status(400).json({ message: "Invalid request. Provide required data to change password."});

    },
    deleteUserAccount: function (req,res,next){
        console.log("req params " + req.params);
        console.log("req params id " + req.params.id);
        if(req.params){
            let deletedUser = User.deleteUserAccount(req.params.id);
            console.log(deletedUser);
            res.status(200).json({message:"Deleted user account"});
            return;
        }
        res.status(400).json({message:"Bad Request: " + res.status});
        
    }
};

module.exports = controller;