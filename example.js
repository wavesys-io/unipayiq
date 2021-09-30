const express = require('express');
const unipay = require("./unipayiq")

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

// do your logic
const myCallback = data => console.log(data)

app.use("/unipay", unipay(myCallback))

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});
