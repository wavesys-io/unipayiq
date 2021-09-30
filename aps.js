const router = require("express").Router()
const request = require('request');

router.post("/pay", (req, res) => {

    const { orderID, amount, currency = "368", lang = "AR", orderDesc = "" } = req.body

    const data = {
        userName: process.env.APS_USERNAME,
        password: process.env.APS_PASSWORD,
        orderNumber: orderID,
        amount,
        currency,
        returnUrl: `${process.env.API_URL}${req.baseUrl}/redirect`,
        failUrl: `${process.env.API_URL}${req.baseUrl}/fail`,
        language: lang,
        description: orderDesc
    };

    const requestOptions = {
        uri: `${process.env.APS_URL}/rest/register.do`,
        form: data,
        method: 'POST',
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


router.get("/redirect", (req, res) => {
    // verify request
    if (req.callback && typeof req.callback === "function") req.callback({ orderID: req.query.orderNumber, transID: req.query.tranRef, status: req.query.status, verified: true, provider: 'APS', providerData: req.query })
    res.status(200).json({ success: true, data: req.query })
})

router.get("/fail", (req, res) => {
    // verify request
    if (req.callback && typeof req.callback === "function") req.callback({ orderID: req.query.orderNumber, transID: req.query.tranRef, status: req.query.status, verified: true, provider: 'APS', providerData: req.query })
    res.status(200).json({ success: true, data: req.query })
})


router.post("/check", (req, res) => {
    const { orderID } = req.body
    const data = {
        userName: process.env.APS_USERNAME,
        password: process.env.APS_PASSWORD,
        orderId: orderID,
    };
    const requestOptions = {
        uri: `${process.env.APS_URL}/payment/rest/getOrderStatus.do`,
        form: data,
        method: 'POST',
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