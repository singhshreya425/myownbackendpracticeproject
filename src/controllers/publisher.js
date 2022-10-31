const publisherModel=require("../models/publisherModel")

const publisher= async function(req,res){
    const data=req.body
    
    let publisher =  await publisherModel.create(data)
     
    res.send({msg:publisher})
}

module.exports.publisher=publisher