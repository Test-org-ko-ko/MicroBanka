const {v4: uuid} = require('uuid');
const Transaction = require('./Transaction');

let Accounts = [];

const TransactionType = {
    CREDIT: 'CREDIT',
    DEBIT: 'DEBIT',
    ATM_DEBIT: 'ATM_DEBIT'
};

class Account {
    constructor(accountType, deposit) {
        this.accountNumber = this.generateAccountNumber();
        this.accountType = accountType;
        this.balance = deposit;
        this.transactions = [];
        this.makeInitialTransaction(deposit);
    }

    generateAccountNumber() {
        // 20231020xxxx
        const today = new Date();
        const prefix = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate();
        return prefix + 
            Math.floor(Math.random() * (9999 - 1000) + 1000);
    }

    makeInitialTransaction(initialDeposit) {
        this.createTransaction(initialDeposit, TransactionType.CREDIT, null, this.accountNumber);
        Accounts.push(this);
    }

    createTransaction(amount, transactionType, fromAcctNumber, 
            toAcctNumber) {

        this.transactions.push(
            new Transaction(
                uuid(),
                Date.now(),
                amount,
                transactionType,
                fromAcctNumber,
                toAcctNumber
            )
        );
    }

    static getAllAccounts() {
        return Accounts;
    }


}

module.exports = Account;