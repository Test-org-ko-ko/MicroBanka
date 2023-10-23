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
    console.log(req);
    console.log('token...', req.headers.authorization);
    let bearer;
    if (req.headers && req.headers.authorization) {
        bearer = req.headers.authorization.split(' ')[1];
        console.log(bearer, ' === ', key);
        if (bearer === key)
            next();
        else
            res.status(401).json({ message: 'Unauthroized, Token: ' + bearer });
    }
    else {
        res.status(401).json({ message: 'Empty Auth' });
    }
});

app.use('/', router);

app.listen(port, () => {
    console.log('Running on Port ' + port);
});