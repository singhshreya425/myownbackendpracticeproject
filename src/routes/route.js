const express =require("express")
const mongoose = require("mongoose")
const router =express.Router();
const { createUser, loginUser, getUser, updateUser } = require("../controller/userController")
const{createProduct,filterProduct,productsById,updateProducts,deleteProductById} =require("../controller/productController")
const{authenticate,authorize} =require("../middleware/middleware")
const{createCart,updateCart,deleteCart,getCart} =require("../controller/cartController")
const{createOrder,updateOrder}= require("../controller/orderController")

router.post("/register",createUser)
router.post("/login",loginUser)
router.get("/user/:userId/profile",authenticate ,getUser)
router.put("/user/:userId/profile",authenticate,authorize,updateUser)
router.post("/products",createProduct)
router.get("/products",filterProduct)
router.get("/products/:productId",productsById)
router.put("/products/:productId",updateProducts)
router.delete("/products/:productId",deleteProductById)
router.put("/users/:userId/cart",updateCart)
router.post("/users/:userId/cart",authenticate,authorize,createCart)
router.put("/users/:userId/cart",authenticate,authorize,updateCart)
router.get("/users/:userId/cart",authenticate,authorize,getCart)
router.delete("/users/:userId/cart",authenticate,authorize,deleteCart)
router.post("/users/:userId/orders",authenticate,authorize,createOrder)
router.put("/users/:userId/orders",authenticate,authorize,updateOrder)



module.exports =router