const Account = require("../model/Account");
const User = require("../model/User");
const path = require('path');

let currentUserAccount;

const TransactionType = {
    CREDIT: 'CREDIT',
    DEBIT: 'DEBIT',
    ATM_DEBIT: 'ATM_DEBIT'
};

const acctController = {
    findAccount: function (req, res, next) {
        console.log('finding acc');
        if (req.params) {
            if (!req.params.accountNumber) {
                res.status(404).json({ message: 'Account No. is empty.' });
                return;
            }
            const acc = findAccountByAccountNumber(req.params.accountNumber);
            if (!acc) {
                res.status(404).json({ message: 'Account with account number ' + req.params.accountNumber + ' does not exist.'});
                return;
            }
            currentUserAccount = acc;
            console.log('setting currentacc ' + currentUserAccount);
            res.status(200).json(acc);
            return;
        }
        res.status(400).json({ message: 'Invalid request. Provide account number'});
    },
    createAccount: function (req, res, next) {
        if (req.body) {
            const { name, email, password, address, phone, ssn, 
                securityQtn, securityAns, initialDeposit, accountType } = req.body;
            console.log(name,email,password,address, phone, ssn, 
                securityQtn, securityAns, initialDeposit, accountType);
            if (name && email && password && address && phone && ssn &&
            securityQtn && securityAns && initialDeposit && accountType) {

                const user = new User(name, email, password, address, phone, ssn, 
                    securityQtn, securityAns, Number(initialDeposit), accountType);
                    console.log(user);
                    if(user){
                        res.status(200).json(user);
                        return;
                    }
            }
        }
        res.status(400).json({ message: "Invalid request. Provide User data to create account."});
    },
    transfer: function (req, res, next) {
        console.log('trnsfer acct controller');
        if (req.body) {
            console.log('...');
            const { fromAcctNumber, toAcctNumber, amount} = req.body;
            console.log(fromAcctNumber, toAcctNumber, amount);
            if (fromAcctNumber && toAcctNumber && amount) {
                const fromAcc = findAccountByAccountNumber(fromAcctNumber);
                const toAcc = findAccountByAccountNumber(toAcctNumber);
                if (!fromAcc || !toAcc){
                    return;
                }
                console.log('create transactionss..');
                transfer(amount, fromAcc, toAcc);
                res.status(200).json({ message: 'success' });
                return;
            }
        }
        res.status(400).json({ message: 'failed' });
    },
    withdraw: function (req, res, next) {
        if (req.params) {
            const amount = req.params.amount;
            console.log(amount);
            if (amount) {
                withdrawFromATM(amount, currentUserAccount);
                res.status(200).json({ message: 'success' });
                return;
            }
        }
        res.status(400).json({ message: 'failed' });
    },
    viewTransactions: function (req, res, next) {
        if (currentUserAccount) {
            res.status(200).sendFile(path.join(__dirname, '../resource/view/transactions.html'));
            // getelementbyId and fill up the data
            const transactions = currentUserAccount.transactions;
        }
    },
    getCurrentAccount: function (req, res, next) {
        if (currentUserAccount) {
            res.status(200).json(currentUserAccount);
        }
    },
    deleteAccount: function(req,res,next){

    }
    
}

function findAccountByAccountNumber(number) {
    return Account.getAllAccounts().find(acc => acc.accountNumber === number);
}

function transfer(amount, from, to) {
    if (amount <= 0 || amount > from.balance) {
        return;
    }
    console.log('before ',from.balance);

    from.balance -= amount;
    console.log('after ',from.balance);
    to.balance += amount;
    Account.createTransaction.call(from, amount, TransactionType.CREDIT, from.accountNumber, to.accountNumber);
    Account.createTransaction.call(to, amount, TransactionType.DEBIT, from.accountNumber, to.accountNumber);
    
    User.getAll().forEach(user => {
        if (user.account.accountNumber === from.accountNumber) {
            user.account.balance = from.balance;
            user.account.transactions = from.transactions;
        }
        else if (user.account.accountNumber === to.accountNumber) {
            user.account.balance = to.balance;
            user.account.transactions = to.transactions;
        }
    })
};

function withdrawFromATM(amount, from) {
    if (amount <= 0 || amount > from.balance) {
        return;
    }
    from.balance -= amount;
    console.log(from.balance);
    Account.createTransaction.call(from, amount, TransactionType.ATM_DEBIT, from.accountNumber, null);
    User.getAll().forEach(user => {
        if (user.account.accountNumber === from.accountNumber) {
            user.account.balance = from.balance;
            user.account.transactions = from.transactions;
        }
    })
}

module.exports = acctController;