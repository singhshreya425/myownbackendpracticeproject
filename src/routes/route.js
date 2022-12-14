const express= require("express")
const router= express.Router()
const URLController= require("../controllers/urlController")



router.post("/url/shorten",URLController.createURL)
router.get("/:urlCode",URLController.getURL)




router.all("/*", function(req,res){
    res.status(400).send({message:"url is wrong"})
})


module.exports = router