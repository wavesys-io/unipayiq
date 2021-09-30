const router = require("express").Router()
const request = require('request');


router.post("/pay", (req, res) => {
    const { orderID, orderDesc, currency = "IQD", amount } = req.body

    const data = {
        profile_id: process.env.AMWAL_PROFILE_ID,
        tran_type: process.env.AMWAL_TRNAS_TYPE,
        tran_class: process.env.AMWAL_TRNAS_CLASS,
        cart_description: orderDesc,
        cart_id: orderID,
        cart_currency: currency,
        cart_amount: amount,
        callback: `${process.env.API_URL}${req.baseUrl}/redirect`,
        return: `${process.env.AMWAL_RETURN_URL}`,
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
    if (req.callback && typeof req.callback === "function") req.callback({ orderID: req.body.cartId, transID: req.body.tranRef, status: req.query.respStatus, verified: true, provider: 'AMWAL', providerData: req.body })
    res.status(200).send()
})


router.get("/check", (req, res) => {
    const { transID } = req.query


    const data = {
        "profile_id": process.env.AMWAL_PROFILE_ID,
        "tran_ref": transID
    }
    const requestOptions = {
        uri: `${process.env.AMWAL_URL}/payment/query`,
        method: 'POST',
        body: JSON.stringify(data),
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


module.exports = router