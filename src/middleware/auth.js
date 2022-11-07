const jwt = require('jsonwebtoken');
const authenticate = function(req, res, next) {
    //check the token in request header
    //validate this token
    try{
        const header = req.headers["x-auth-token"]
        if(!header)return res.status(400).send ({msg:"x-auth-token key is required in headers"})

        // if (header){
         //const decoded=
     jwt.verify(header,'passwordSignature',(err,res)=>{
    console.log(err)
   if(error)  return res.status(404).send({status:false, msg:err})
  req.headers["userId"]=res.id
    
 })
// console.log(decoded)
//  req.id=decoded.id
//  if(!decoded){
//     return res.send({status:false  ,msg:"invalid token"})
//  }
        }catch(err){
            return res.status(500).send({status:false,msg:err})
      }

}



const authorise = function(req, res, next) {
    // comapre the logged in user's id and the id in request
    try{
        if(!decoded){
            return res.send({status:false, msg:"invalid token"})
        }
        next()
    // }else{
    //     console.log("x-auth-token key is required in headers")
    // }
    }catch(err){
          return res.status(500).send({status:false,msg:err})
    }
}
module.exports.authenticate=authenticate;
module.exports.authorise=authorise;