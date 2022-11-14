const express = require('express');
const router = express.Router();
const authorMiddleware = require("../middleware/authorMiddleware");
const authorController = require("../controller/authorController")
const blogController = require("../controller/blogController")

router.get("/test-me",function(req,res){
    res.send("hiii")
})

router.post("/blogs",authorController.createAuthor)
router.get("/blogss/:authorId",blogController.getAuthor)
router.put("/blogs/:blogId",)
router.delete("/")
router.get("/");




module.exports=router;