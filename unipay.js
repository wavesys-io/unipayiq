const express = require("express")
require('dotenv').config();
const router = express.Router()
const zainCash = require("./zainCash")
const switchMasterCard = require("./switch")
const amwal = require("./amwal")
const aps = require("./aps")
const tasdid = require("./tasdid");
const { route } = require("./amwal");




module.exports = (callback = ({ orderID, transID, status = String, verified = Boolean, provider = String, providerDara = Object }) => { }) => {
    router.use((req, res, next) => {
        req.callback = callback
        next()
    })

    router.use(express.urlencoded({ extended: false }))

    router.use("/zain", zainCash)
    router.use("/switch", switchMasterCard)
    router.use("/amwal", amwal)
    router.use("/aps", aps)
    router.use("/tasdid", tasdid)

    return router
}