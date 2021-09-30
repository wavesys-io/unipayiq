const router = require("express").Router()
const request = require('request');


const getTasdidToken = async (userName, password) => {
    return new Promise((done, fail) => {
        const postData = {
            userName,
            password
        };

        const requestOptions = {
            uri: `${process.env.TASDID_URL}/v1/api/Auth/Token`,
            body: JSON.stringify(postData),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        };

        request(requestOptions, function (error, response) {
            try {
                const jsonRes = JSON.parse(response.body)
                if (jsonRes.token) return done(jsonRes.token)
                fail(jsonRes)
            } catch (err) {
                fail(err)
            }
        });
    })
}


router.post("/pay", async (req, res) => {
    try {
        const { orderID, customerName, dueDate, phoneNumber, orderDesc, amount } = req.body
        const token = await getTasdidToken(process.env.TASDID_USERNAME, process.env.TASDID_PASSWORD)

        const postData = {
            payId: orderID,
            customerName,
            dueDate,
            phoneNumber: phoneNumber,
            serviceId: process.env.TASDID_SERVICE_ID,
            amount,
            note: orderDesc,
        };

        const requestOptions = {
            uri: `${process.env.TASDID_URL}/v1/api/Provider/AddBill`,
            body: JSON.stringify(postData),
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        };

        request(requestOptions, (error, response) => {
            const jsonRes = JSON.parse(response.body)
            res.json({ success: true, data: jsonRes })
        });
    } catch (err) {
        res.json({ success: false, err })
    }
})



router.post("/redirect", (req, res) => {
    if (req.callback && typeof req.callback === "function") req.callback({ orderID: req.query.payId, transID: req.body.serviceId, status: req.body.struetatus, verified: req.body.key === process.env.TASDID_KEY, provider: 'TASDID', providerData: req.body })
})


router.get("/chech", (req, res) => {
    res.json({ success: false, err: 'not supported' })
})


module.exports = router