const express = require('express');
const app = express();
require('dotenv').config();
const unipay = require("./unipay")
const callback = require('./callback')

const PORT = process.env.PORT || 3000;


app.use(express.json());

app.use("/unipay", unipay(callback))


app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});


