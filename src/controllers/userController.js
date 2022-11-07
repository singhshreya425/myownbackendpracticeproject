const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const mongoose = require('mongoose');
/*
  Read all the comments multiple times to understand why we are doing what we are doing in login api and getUserData api
*/
const createUser = async function (req, res) {
  //You can name the req, res objects anything.
  //but the first parameter is always the request 
  //the second parameter is always the response
  let data = req.body;
  let savedData = await userModel.create(data);
  // console.log(req.newAttribute);
  res.send({ msg: savedData });
};

const loginUser = async function (req, res) {
  let userName = req.body.emailId;
  let password = req.body.password;

  let user = await userModel.findOne({ emailId: userName, password: password });
  if (!user)
    return res.send({
      status: false,
      msg: "username or the password is not corerct",
    });

  // Once the login is successful, create the jwt token with sign function
  // Sign function has 2 inputs:
  // Input 1 is the payload or the object containing data to be set in token
  // The decision about what data to put in token depends on the business requirement
  // Input 2 is the secret (This is basically a fixed value only set at the server. This value should be hard to guess)
  // The same secret will be used to decode tokens 
  let token = jwt.sign(
    {
      userId: user._id.toString(),
      batch: "lithium",
      organisation: "FunctionUp",
      month: "September"
    },
    "functionup-lithium-very-very-secret-key"
  );
  res.setHeader("x-auth-token", token);
  res.send({ status: true, token: token });
};

const getUserData = async function (req, res) {
  
  // let token = req.headers["x-Auth-token"];
  // if (!token) token = req.headers["x-auth-token"];

  //If no token is present in the request header return error. This means the user is not logged in.
  // if (!token) return res.send({ status: false, msg: "token must be present" });

  // console.log(token);
  // If a token is present then decode the token with verify function
  // verify takes two inputs:
  // Input 1 is the token to be decoded
  // Input 2 is the same secret with which the token was generated
  // Check the value of the decoded token yourself

  // Decoding requires the secret again. 
  // A token can only be decoded successfully if the same secret was used to create(sign) that token.
  // And because this token is only known to the server, it can be assumed that if a token is decoded at server then this token must have been issued by the same server in past.
  // let decodedToken = jwt.verify(token, "functionup-lithium-very-very-secret-key");
  // if (!decodedToken)
  //   return res.send({ status: false, msg: "token is invalid" });

  let userId = req.params.userId;
  let userDetails = await userModel.findOne({_id:userId},{isDeleted:false});
  if (!userDetails)
    return res.send({ status: false, msg: "No such user exists" });

  res.send({ status: true, data: userDetails });
  // Note: Try to see what happens if we change the secret while decoding the token
};

const updateUser = async function (req, res) {
  // Do the same steps here:
  // Check if the token is present
  // Check if the token present is a valid token
  // Return a different error message in both these cases

  let userId = req.params.userId;
 
  let user = await userModel.findById(userId);
  //Return an error if no user with the given id exists in the db
  if (!user) {
    return res.send("No such user exists");
   };

    let userData = req.body;
 let updatedUser = await userModel.findById(userId).updateMany(userData);
  res.send({ status: true, data: updatedUser });
};

const DeleteUser = async function (req, res){
  let userId = req.params.userId
  let user = await userModel.findById(userId);
  if(!user){
    return res.send("No such User Exists")
  }
  let DeleteUser = await userModel.findOneAndUpdate({_id:userId},[{$set:{isDeleted: true}}],{new:true});
  res.send({status: true, data: DeleteUser})
};

const postMessage = async function (req, res){
  let message =req.body.message
  if(!user)return res.send({status: false, msg: 'No such user exist'})
  let updatedPosts =user.posts.push(message)
  let updatedUser = await userModel.findOneAndUpdate({_id: user._id},{password: password})
  return res.send({status: true, data: updatedUser})
  // const token = req.headers['token']
  // const decoded = jwt.verify(token, 'functionup-lithium-very-very-secret-key')
  // const body = req.body
  //db calls
  // const myToken = jwt.sign({userId:"",name:"shreya"},'your secret password')
  // res.send({token : myToken,msg:"success"})
  //if  (req.wantsjson) res.send({msg:"another example response"})
  //else res.send("another example response")
}
module.exports.createUser = createUser;
module.exports.getUserData = getUserData;
module.exports.updateUser = updateUser;
module.exports.loginUser = loginUser;
module.exports.postMessage = postMessage;
module.exports.DeleteUser = DeleteUser;