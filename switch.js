const router = require("express").Router()
const request = require('request');

router.post("/pay", (req, res) => {
    const { currency = "IQD", amount } = req.body

    const data = {
        "entityId": process.env.SWITCH_ENTITY_ID,
        "paymentType": "DB",
        "amount": amount,
        "currency": currency,
    };

    const requestOptions = {
        uri: `${process.env.SWITCH_URL}/v1/checkouts`,
        form: data,
        method: 'POST',
        headers: {
            'authorization': `Bearer ${process.env.SWITCH_AUTH_TOKEN}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    };

    request(requestOptions, function (error, response) {
        try {
            console.log(response.body)
            const jsonRes = JSON.parse(response.body)
            res.json({ success: true, data: jsonRes, })
        } catch (err) {
            res.json({ success: false, err })
        }
    });
})


router.get("/check", (req, res) => {
    const { transID } = req.query
    const requestOptions = {
        uri: `${process.env.SWITCH_URL}/v1/checkouts/${transID}/payment?entityId=${process.env.SWITCH_ENTITY_ID}`,
        method: 'GET',
        headers: {
            'authorization': `Bearer ${process.env.SWITCH_AUTH_TOKEN}`,
        }
    };

    request(requestOptions, function (error, response) {
        try {
            const jsonRes = JSON.parse(response.body)
            res.json({ success: true, data: jsonRes })
        } catch (err) {
            res.json({ success: false, err })
        }
    });

})



module.exports = router