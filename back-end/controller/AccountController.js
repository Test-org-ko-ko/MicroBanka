const Account = require("../model/Account");
const User = require("../model/User");
const path = require('path');

let currentUserAccount;

const acctController = {
    findAccount: function (req, res, next) {
        if (req.params) {
            if (!req.params.accountNumber) {
                res.status(404).json({ message: 'Account No. is empty.' });
                return;
            }
            const acc = findAccountByAccountNumber(req.params.accountNumber);
            if (!acc) {
                currentUserAccount = acc;
                res.status(404).json({ message: 'Account with account number ' + req.params.accountNumber + ' does not exist.'});
                return;
            }
            res.status(200).json(acc);
            return;
        }
        res.status(400).json({ message: 'Invalid request. Provide account number'});
    },
    createAccount: function (req, res, next) {
        if (req.body) {
            const { name, email, password, address, phone, ssn, 
                securityQtn, securityAns, initialDeposit, accountType } = req.body;

            if (name && email && password && address && phone && ssn &&
            securityQtn && securityAns && initialDeposit && accountType) {

                const user = new User(name, email, password, address, phone, ssn, 
                    securityQtn, securityAns, initialDeposit, accountType);
                    if(user){
                        res.status(200).json(user);
                        return;
                    }
            }
        }
        res.status(400).json({ message: "Invalid request. Provide User data to create account."});
    },
    transfer: function (req, res, next) {
        if (req.body) {
            const { fromAcctNumber, toAcctNumber, amount} = req.body;
            if (fromAcctNumber && toAcctNumber && amount) {
                const fromAcc = findAccountByAccountNumber(fromAcctNumber);
                const toAcc = findAccountByAccountNumber(toAcctNumber);
                if (!fromAcc || !toAcc){
                    return;
                }
                transfer(amount, fromAcc, toAcc);
                res.status(200).json({ message: 'success' });
                return;
            }
        }
        res.status(400).json({ message: 'failed' });
    },
    withdraw: function (req, res, next) {
        if (req.body) {
            const { fromAcctNumber, amount} = req.body;
            if (fromAcctNumber && amount) {
                const fromAcc = findAccountByAccountNumber(fromAcctNumber);
                if (!fromAcc){
                    return;
                }
                withdrawFromATM(amount, fromAcc);
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
    }
}

function findAccountByAccountNumber(number) {
    return Account.getAllAccounts().find(acc => acc.accountNumber === number);
}

function transfer(amount, from, to) {
    if (amount <= 0 || amount > from.balance) {
        return;
    }
    from.balance -= amount;
    to.balance += amount;
    to.createTransaction(amount, TransactionType.CREDIT, from.accountNumber, null);
    from.createTransaction(amount, TransactionType.DEBIT, null, to.accountNumber);
};

function withdrawFromATM(amount, from) {
    if (amount <= 0 || amount > from.balance) {
        return;
    }
    from.balance -= amount;
    from.createTransaction(amount, TransactionType.ATM_DEBIT, null, null);
}

{/* <script src="https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js"></script> */}

// new QRCode(document.getElementById("qrcode"), {
//     text: "https://webisora.com",
//     width: 128,
//     height: 128,
//     colorDark : "#5868bf",
//     colorLight : "#ffffff",
//     correctLevel : QRCode.CorrectLevel.H
// });

module.exports = acctController;