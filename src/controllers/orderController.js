const mongoose = require('mongoose')
const orderModel =require("../models/orderModel")
const productModel = require("../models/productModel")
const userModel = require("../models/userModel")
const createorder = async function (req, res){
    let reqbody= req.body
    let price =await productModel.findById(reqbody.productId).select({_id:0,price:1})
    let p = price.price
    await userModel.findOneAndUpdate({_id:reqbody.userId},{ 
        $inc: { 
            
            balance: -p
        }
    })
    console.log("hi")
    reqbody.amount= p
    reqbody.isFreeAppUser= req.isFreeAppUser
    let result = await orderModel.create(reqbody)
    res.send({msg:result})

} 
module.exports={createorder}