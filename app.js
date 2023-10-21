const express = require('express');
const router = require('./router/Router');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static('./resource'));

app.use('/', router);
//app.use('/account',router);


app.listen(port, () => {
    console.log('Running on Port ' + port);
});