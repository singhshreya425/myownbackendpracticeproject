const jwt =require('jsonwebtoken');
const mongoose =require('mongoose');
const usermodel = require("../models/usermodel");

const createUser = async function (req, res){
    try {
        let userdetails = req.body;
        let usercreated = await usermodel.create(userdetails);
        res.status(201).send({status:false, data:usercreated})
        
    } catch (error) {
        res.status(500).send({status: false, message: error.message});
    }
};
   
//login+generate jwt token
const login = async function(req,res){
    try {
        userName = req.body.name;
        userPassword = req.body.password;

        let user = await usermodel.findOne({
            name: userName,
            password: userPassword,
            isDeleted: false,
        });
        if (user){
            const generatedtoken = jwt.sign({ userId: user._id},"lithium-secret");
            res.status(200)
            res.send({status: true,data: user._id, token: generatedtoken});
        }else{
            return res.status(400).send({status:false, message: "Invalid credentials"});
        }
    } catch (error) {
        return res.status(500).send({status:false, message: error.message || ""})
    }
};
const getDetails= async function(req, res){
    try {
        let userId = req.params.userId;
        let decodedUserToken = req.user;
        if (userId==decodedUserToken.userId){
            let userdetails=await usermodel.findOne({
                _id:userId,
                isDeleted: false,
            });
            if (userdetails){
                res.status(200).send({status:true, data:userdetails});
            }else{
                res.status(404).send({status:false, message:"User not found"});
            }
        }
        else res.status(403).send({status:false,message:"Prohibited as maybe trying to access a different user's account"});
    } catch (error) {
        res.status(500).send({status:false, message:error.message});
    }

};
const updateUser = async function (req,res){

};
// //promises
// let p = new Promise((resolve,reject)=>{
//     let a = 1+1 
//     if (a==2){
//         resolve('success')

//     }else{
//         reject('Failed')
//     }
// })
// p.then((message)=>{
//     console.log('This is in the then'+ message)
// }).catch((message)=>{
//     console.log('This is in the catch'+ message)
// })
// const userLeft = false
// const userWatchingCatMeme= false
// function WatchTutorialCallback(callback, errorCallback){
//     if (userLeft){
//         errorCallback({
//             name: 'User Left',
//             message: ':('
            
//         })
//     }else if (userWatchingCatMeme){
//         errorCallback({
//             name: 'User Watching Cat Meme',
//             message:'WebDevSimplified<Cat'
//         })
//     }else{
//         callback(' Go ahead')
//     }
// }
// WatchTutorialCallback((message)=>{
//     console.log('Success:'+message)
// },(error)=>{
//     console.log(error.name+ ' '+error.message)
// })

// function WatchTutorialPromise(){
//     return new Promise((resolve, reject))
//     if (userLeft){
//         errorCallback({
//             name:'User Left',
//             message:':('
//         })
//     }else if (userWatchingCatMeme){
//         errorCallback({
//             name: 'User Watching Cat Meme',
//             message:'WebDevSimplified<Cat'
//         })
//     }else{
//         callback('Thumbs up')
//     }
// }
module.exports.login=login;
module.exports.createUser=createUser;
module.exports.getDetails=getDetails;
module.exports.updateUser=updateUser;