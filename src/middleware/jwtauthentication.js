const jwt = require("jsonwebtoken");

const mid1 = async (req, res, next)=>{
    try{
    let token = req.headers["x-auth-token"];
    console.log(token);
    //if no token is present in the req header return error . This means the user is 
    if (!token)
    return res.send ({status:false, msg: "token must be present"});
    let decodedToken = jwt.verify(token, "functionup-lithium-very-very-secret-key");
    if(!decodedToken)
    return res.send({status: false, msg: "token is invalid"});
    next();
}
catch(error){
    res.status(500).send({msg:"something went wrong"})
}
}
module.exports.mid1=mid1;