const mongoose= require('mongoose')


const publishschema=new mongoose.Schema({

    name:{ 
        type:String,
        require:true
    },  
    headQuarter:String
},{timestamps:true});

module.exports=mongoose.model('publisher', publishschema)