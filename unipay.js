const router = require("express").Router()
const zainCash = require("./zainCash")
const switchMasterCard = require("./switch")
const amwal = require("./amwal")
const aps = require("./aps")
const tasdid = require("./tasdid")




module.exports = (callback) => {
    router.use((req, res, next) => {
        req.callback = callback
        next()
    })

    router.use("/zain", zainCash)
    router.use("/switch", switchMasterCard)
    router.use("/amwal", amwal)
    router.use("/aps", aps)
    router.use("/tasdid", tasdid)

    return router
}