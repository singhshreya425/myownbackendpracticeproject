//Routes will simply have the api's.
const express = require('express');
const router = express.Router();
const UserModel= require("../models/userModel.js")
const UserController= require("../controllers/userController")
const BookModel= require("../models/bookmodel.js")
const BookController= require("../controllers/bookcontrollers.js")

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post("/createUser", UserController.createUser  );//handler

router.get("/getUsersData", UserController.getUsersData);

router.post("/createBook", BookController.createBook  );

router.get("/getBooksData", BookController.getBooksData);

module.exports = router;