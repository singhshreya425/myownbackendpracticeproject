const jwt = require('jsonwebtoken');
const { isValidObjectIds } = require("../validation/validation");
const userModel = require("../model/userModel.js")


const authenticate = (req, res, next) => {
  try {
    let token = req.headers["authorization"];
    if (!token) return res.status(400).send({ status: false, msg: "token must be present" });
    token= token.slice(7)
     jwt.verify(token, "Group18", function (err, decode) {
      if (err) { return res.status(401).send({ status: false, message: "Authentication failed" }) }
      req.decode = decode;
      next();
    })
  }
  catch (error) {
    res.status(500).send({ staus: false, msg: error });
  }
}
const authorize = async function (req, res, next) {
  try {
    let userLoggedIn = req.decode; //Accessing userId from token attribute
    let userId = req.params.userId; // pass user id in path params
    //check if user id is valid or not
    if (!isValidObjectIds(userId)) {
      return res.status(400).send({status: false,message: "userId is invalid"});
    }
    let userAccessing = await userModel.findById(userId);
    if (!userAccessing) {return res.status(404).send({status: false,message: "Error! Please check userid and try again" }); }
    

    if (userAccessing["_id"].toString()!== userLoggedIn.userId) {     //string representation of object
      return res.status(403).send({status: false,msg: "Error, authorization failed"});
    }
    
    next();

  } catch (err) {
    res.status(500).send({status: false, error: err.message});
  }
};

module.exports = {authenticate,authorize}

