const mongoose = require('mongoose')
const productModel =require("../models/productModel")
const createproduct = async function (req, res){
    let reqbody= req.body
    let result = await productModel.create(reqbody)
    res.send({msg:result})

} 
module.exports={createproduct}