const express = require("express")
const router = express.Router()
const jwt = require('jsonwebtoken');
const request = require('request');
require('dotenv').config();


router.post('/pay', (req, res) => {


    const { amount, orderDesc, orderID } = req.body;

    const time = Date.now();

    const tokenData = {
        'amount': amount,
        'serviceType': orderDesc,
        'msisdn': process.env.ZAINCASH_MSISDN,
        'orderId': orderID,
        'redirectUrl': `${process.env.API_URL}${req.baseUrl}/redirect`,
        'iat': time,
        'exp': time + 60 * 60 * 4
    };

    const token = jwt.sign(tokenData, process.env.ZAINCASH_SECRET);

    const data = {
        'token': token,
        'merchantId': process.env.ZAINCASH_MERCHANTID,
        'lang': process.env.ZAINCASH_LANG
    };

    const requestOptions = {
        uri: `${process.env.ZAINCASH_URL}/transaction/init`,
        body: JSON.stringify(data),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    request(requestOptions, function (error, response) {
        try {
            const jsonRes = JSON.parse(response.body)
            if (!jsonRes.id) return res.json({ success: false, data: jsonRes })
            res.redirect(`${process.env.ZAINCASH_URL}/transaction/pay?id=${jsonRes.id}`)
        } catch (err) {
            res.json({ success: false, err })
        }
    });
});

router.get('/redirect', (req, res) => {
    const token = req.query.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.ZAINCASH_SECRET);
            if (req.callback && typeof req.callback === "function") req.callback({ orderID: decoded.orderid, transID: decoded.id, status: decoded.status, verified: true, provider: 'ZAINCASH', providerData: decoded })
            res.json({ success: decoded.status == 'success', data: decoded })
        } catch (err) {
            res.json({ success: false, err })
        }
    } else {
        res.json({ success: false, err: "invalid token", data: req.query })
    }
});


router.get("/check", (req, res) => {
    const { transID } = req.query
    const msisdn = process.env.ZAINCASH_MSISDN
    const token = jwt.sign({ id: transID, msisdn }, process.env.ZAINCASH_SECRET, { expiresIn: '4h' });

    const requestOptions = {
        uri: `${process.env.ZAINCASH_URL}/transaction/get`,
        body: JSON.stringify({
            token,
            merchantId: process.env.ZAINCASH_MERCHANTID
        }),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
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
