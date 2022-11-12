const express = require('express');
const router = express.Router();
const CowinController= require("../controllers/cowinController")
const userController = require("../controllers/userController")


router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})


router.get("/cowin/states", CowinController.getStates)
router.get("/cowin/districtsInState/:stateId", CowinController.getDistricts)
router.get("/cowin/getByPin", CowinController.getByPin)
router.get("/cowin/getByDistricts", CowinController.getDistrictSessions)
router.post("/cowin/getOtp", CowinController.getOtp)
router.get("/weather/listcity",CowinController.weatherbycity)

router.get("/getSortedCities",userController.getSortedCities)
router.post("/memeHandler",userController.memeHandler)

// WRITE A GET API TO GET THE LIST OF ALL THE "vaccination sessions by district id" for any given district id and for any given date



module.exports = router;