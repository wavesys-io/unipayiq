const express = require('express');



const app = express();
const unipay = require("./unipay")

require('dotenv').config();

const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: false }))

const myCallback = data => console.log(data)


app.use("/unipay", unipay(myCallback))


app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});


