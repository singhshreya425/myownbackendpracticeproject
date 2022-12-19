const express =require("express")
const router =express.Router();
const { createUser, loginUser, getUser } = require("../controller/userController")
const{authenticate,authorize} =require("../middleware/middleware")

router.post("/register",createUser)
router.post("/login",loginUser)
router.get("/user/:userId/profile",authenticate,authorize,getUser)


module.exports =router