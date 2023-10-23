const express = require('express');
const router = require('./router/Router');
const cors = require('cors');
const key = require('./key');

const app = express();
const port = 3000;

app.use(express.json());

app.use(cors());

app.use(express.static('./resource'));

app.use('/', (req, res, next) => {
    console.log('in auth middleware');
    if (req.headers && req.headers.authorization) {
        console.log('has token', req.headers.authorization);
        next();
    }
    else
        res.status(401).json({ message: 'Token missing' });
});

app.use('/', router);

app.listen(port, () => {
    console.log('Running on Port ' + port);
});