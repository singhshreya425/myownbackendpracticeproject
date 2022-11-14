const authorModel = require("../models/author");




const createAuthor= async function (req, res) {
   try {let data = req.body

    let authorData=await authorModel.create(data);
     
     res.status(201).send({data: authorData})
}

catch (error) {
    res.status(500).send({ msg: error })
  }
}





module.exports.createAuthor=createAuthor