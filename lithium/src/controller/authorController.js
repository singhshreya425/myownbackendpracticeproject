const authorModel = require("../models/authorModel.js");




const createAuthor= async function (req, res) {
   try {
    let data = req.body

    let authorData=await authorModel.create(data);
     
     res.status(201).send({data: authorData})
}

catch (error) {
    res.status(500).send({ msg: error.message })
  }
}





module.exports.createAuthor=createAuthor