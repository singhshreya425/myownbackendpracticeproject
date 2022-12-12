const express= require("express")
const router= express.Router()
const URLController= require("../controllers/urlController")



router.post("/url/shorten",URLController.createURL)
router.get("/:urlCode",URLController.getURL)


module.exports = router