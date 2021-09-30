const router = require("express").Router()

router.post("/pay", (req, res) => {
    const { orderID, currency = "IQD", amount } = req.body

    const data = {
        "apiOperation": "CREATE_CHECKOUT_SESSION",
        "apiPassword": process.env.SWITCH_API_PASSWORD,
        "apiUsername": `merchant.${process.env.SWITCH_API_USERNAME}`,
        "merchant": process.env.SWITCH_API_USERNAME,
        "interaction.operation": "AUTHORIZE",
        "order.id": orderID,
        "order.amount": amount,
        "order.currency": currency,
    };

    const requestOptions = {
        uri: process.env.AMWAL_URL,
        form: data,
        method: 'POST',
    };

    request(requestOptions, function (error, response) {
        try {
            const jsonRes = JSON.parse(response.body)
            res.json({ success: true, data: jsonRes, })
        } catch (err) {
            res.json({ success: false, err })
        }
    });
})


module.exports = router