const express = require('express');
const router = express.Router();

const authorController= require("../controllers/authorController")
const bookController= require("../controllers/bookController")
const mypublisher=require("../controllers/publisher")
const midd1 = require("../midleware/midd1")

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

// router.post('/createAuthor', midd1, authorController.createAuthor)
// router.post('/createBook',midd1, bookController.createBook)
// router.get("/getBooks")
router.post("/createAuthor", authorController.createAuthor  )

router.get("/getAuthorsData", authorController.getAuthorsData)

router.post("/createBook", bookController.createBook  )

router.get("/getBooksData", bookController.getBooksData)
router.post("/postpublishersData", mypublisher.publisher)
router.put("/updatepublisher", bookController.updatebookbydata)
router.put("/updateprice", bookController.updaterating)
router.get("/getBooksWithAuthorDetails", bookController.getBooksWithAuthorDetails)

module.exports = router;