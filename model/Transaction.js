class Transaction {
    constructor(id, date, amount, type, from, to) {
        this.id = id;
        this.date = date;
        this.amount = amount;
        this.type = type;
        this.from = from;
        this.to = to;
    }
}

module.exports = Transaction;