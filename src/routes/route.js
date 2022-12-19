const express =require("express")
const mongoose = require("mongoose")
const router =express.Router();
const { createUser, loginUser, getUser, updateUser } = require("../controller/userController")
const{authenticate,authorize} =require("../middleware/middleware")

router.post("/register",createUser)
router.post("/login",loginUser)
router.get("/user/:userId/profile",authenticate,authorize,getUser)
router.put("/user/:userId/profile",authenticate,authorize,updateUser)


module.exports =router