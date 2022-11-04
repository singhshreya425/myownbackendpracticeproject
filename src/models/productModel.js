const mongoose = require('mongoose')
const createproduct = new mongoose.Schema({
    name:String,
    category:String,
    price:{
        type:String,
        required:true
    }
},{ timestamps: true });
module.exports=mongoose.model("product",createproduct)