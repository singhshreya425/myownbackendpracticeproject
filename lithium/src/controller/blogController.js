const blogModel= require("../models/blogModel")







const createBlog= async function (req, res) {
   try {
    let data = req.body

    let authorData=await blogModel.create(data);
     
     res.status(201).send({data: authorData})
}

catch (error) {
    res.status(500).send({ msg: error.message })
  }
}





module.exports.createBlog=createBlog