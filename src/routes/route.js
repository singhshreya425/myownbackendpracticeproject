const express =require("express")
const mongoose = require("mongoose")
const router =express.Router();
const { createUser, loginUser, getUser, updateUser } = require("../controller/userController")
const{createProduct} =require("../controller/productController")
const{authenticate,authorize} =require("../middleware/middleware")

router.post("/register",createUser)
router.post("/login",loginUser)
router.get("/user/:userId/profile",authenticate ,getUser)
router.put("/user/:userId/profile",authenticate,authorize,updateUser)
router.post("/products",createProduct)



module.exports =router