const URLModel= require("../models/urlModel")
const shortUrl = require("node-url-shortener");
const shortid = require('shortid');

const Validations= require("../validations/validation");



const createURL = async function (req, res) {

    
    try {

        
      const data = req.body
      if (Object.keys(data).length == 0) {
        return res
          .status(400)
          .send({ status: false, message: "No input provided" });
      }
      const { longUrl} = data

      if(!(Validations.isValidURL(longUrl))){
        res.status(400).send({status:false,message:"wrongurl"})
      }


      let urlDataNew= await URLModel.findOne({longUrl:longUrl}).select({_id:0,
        updatedAt:0,createdAt:0,
        __v:0
        })

        if(urlDataNew != null){
          return res.status(200).send({status:false, message:"already shorted",data:urlDataNew })
        }
     


              

  


let urlCode= shortid.generate(longUrl);

let shortUrl= `http://localhost:3000/${urlCode}`

data["shortUrl"] = `http://localhost:3000/${urlCode}`
data["urlCode"] = `${urlCode}`

if(!(Validations.isValidURL(data.shortUrl))){
    res.status(400).send({status:false,message:"wrongurl"})
  }





      const createURL = await URLModel.create(data);

     
      
      return res.status(201).send({ status: true,message:"success", data: createURL })
    }

    catch (err) {
      return res.status(500).send({ status: false, message: err.message })
    }
}





const getURL= async function(req,res){
  try{

    let urlCode = req.params.urlCode
    console.log(urlCode)

    if(!(Validations.isValidURLCode(urlCode))){
      return res.status(400).send({status:false, message:"urlcode is not valid"})
    }
    let urlData= await URLModel.findOne({urlCode:urlCode})
    if(urlData== null){
     return res.status(404).send({status:false,message:"urlcode is not registered"})
    }
  let longUrl =   urlData.longUrl

 return  res.status(302).redirect(longUrl)




  }
  catch(err){
   return  res.status(500).send({msg:err.message})
  }
}
  










  module.exports={createURL ,getURL }