const express = require('express');
const router = require('./router/Router');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());

app.use(cors());

app.use(express.static('./resource'));

app.use('/', router);
//app.use('/account',router);


app.listen(port, () => {
    console.log('Running on Port ' + port);
});