const express = require('express');
const router = express.Router();
const authorMiddleware = require("../middleware/authorMiddleware");
const authorController = require("../controller/authorController");
const blogController = require("../controller/blogController");


router.post("/author",authorController.createAuthor);
router.post("/blog",blogController.createBlog);
router.post("/logIn",authorController.login);
router.get("/blogs/:authorId",authorMiddleware.authenticate,blogController.getBlogsData);

//router.get('/getauthor',authorMiddleware.authenticate,authorController.getdata)







module.exports=router;