const {v4: uuid} = require('uuid');
const Transaction = require('./Transaction');

let Accounts = [
    {"accountNumber":"202310214275","accountType":"checking","balance": 500,"transactions":[{"id":"19d98067-6376-4369-8f89-7123e93990aa","date":1697935591368,"amount":"500","type":"CREDIT","from":null,"to":"202310214275"}]},
    {"accountNumber":"202310214200","accountType":"checking","balance": 500,"transactions":[{"id":"19d98067-6376-4369-8f89-7123e93990bb","date":1697935591368,"amount":"500","type":"CREDIT","from":null,"to":"202310214200"}]}


];

const TransactionType = {
    CREDIT: 'CREDIT',
    DEBIT: 'DEBIT',
    ATM_DEBIT: 'ATM_DEBIT'
};

class Account {
    constructor(accountType, deposit) {
        this.accountNumber = this.generateAccountNumber();
        console.log(this.accountNumber);
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
        Account.createTransaction.call(this,Number(initialDeposit), TransactionType.CREDIT, null, this.accountNumber);
        Accounts.push(this);
    }

    static createTransaction(amount, transactionType, fromAcctNumber, 
            toAcctNumber) {
        const today = new Date();
        const transDate= today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate();

        return this.transactions.push(
            new Transaction(
                uuid(),
                transDate,
                amount,
                transactionType,
                fromAcctNumber,
                toAcctNumber
            )
        );
        console.log(this.transactions);
    }

    static getAllAccounts() {
        return Accounts;
    }

}

module.exports = Account;