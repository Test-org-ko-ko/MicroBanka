const { v4: uuid } = require('uuid');
const Account = require('./Account');

let Users = [];
class User {
    constructor(name, email, password, address, phone, ssn, 
        securityQtn, securityAns, initialDeposit, accountType
    ) {
        this.id = uuid();
        this.name = name;
        this.email = email;
        this.password = password;
        this.address = address;
        this.phone = phone;
        this.ssn = ssn;
        this.securityAns = securityAns;
        this.securityQtn = securityQtn;
        this.activeAccounts = [];
        this.createAccount(accountType, initialDeposit);
    }

    createAccount(accountType, deposit) {
        const account = new Account(accountType, deposit);
        this.activeAccounts.push(account);
        Users.push(this);
    }

    static getAll() {
        return Users;
    }
}

module.exports = User;