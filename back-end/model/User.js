const { v4: uuid } = require('uuid');
const Account = require('./Account');

let Users = [{"id":"b0a227cf-708d-44e4-84ab-bcc5df131956","name":"Winnie","email":"test@gmail.com","password":"abc123","address":"123, test, 123, Iowa","phone":"536565","ssn":"4254","securityAns":"1234","securityQtn":"movie",
"account":{"accountNumber":"202310214275","accountType":"checking","balance":"500","transactions":[{"id":"19d98067-6376-4369-8f89-7123e93990aa","date":"2023/10/21","amount":"500","type":"CREDIT","from":null,"to":"202310214275"}]}}, 

{"id":"b0a227cf-708d-44e4-84ab-bcc5df131000","name":"Jon","email":"test@gmail.com","password":"123","address":"123, test, 123, Iowa","phone":"536565","ssn":"4254","securityAns":"1234","securityQtn":"movie",
"account":{"accountNumber":"202310214200","accountType":"checking","balance": 500,"transactions":[{"id":"19d98067-6376-4369-8f89-7123e93990bb","date":"2023/10/21","amount": 500,"type":"CREDIT","from":null,"to":"202310214200"}]}}
];
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
        this.account = this.createAccount(accountType, initialDeposit);
    }

    createAccount(accountType, deposit) {
        const account = new Account(accountType, deposit);
        Users.push(this);
        return account;
    }

    static getAll() {
        return Users;
    }
}

module.exports = User;