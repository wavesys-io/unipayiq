const router = require("express").Router()
const request = require('request');


router.post("/pay", (req, res) => {
    const { orderID, orderDesc, currency, amount } = req.body

    const data = {
        profile_id: process.env.AMWAL_MERCHANTID,
        tran_type: process.env.AMWAL_TRNAS_TYPE,
        tran_class: process.env.AMWAL_TRNAS_CLASS,
        cart_description: orderDesc,
        cart_id: orderID,
        cart_currency: currency,
        cart_amount: amount,
        callback: `${process.env.API_URL}${req.baseUrl}/redirect`,
        return: `${process.env.HOME_URL}`,
    };

    const requestOptions = {
        uri: `${process.env.AMWAL_URL}/payment/request`,
        body: JSON.stringify(data),
        method: 'POST',
        headers: {
            'authorization': process.env.AMWAL_SERVER_KEY,
            'Content-Type': 'application/json',
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

router.post("/redirect", (req, res) => {
    // verify request
    if (req.callback && typeof req.callback === "function") req.callback({ orderID: req.query.cartId, transID: req.query.tranRef, status: req.query.respStatus, verified: true, provider: 'AMWAL', providerData: req.query })
    res.status(201).send()
})


module.exports = router