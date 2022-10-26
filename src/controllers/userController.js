const UserModel= require("../models/userModel")

const createUser= async function (req, res) {
    let data= req.body
    console.log("hi")
    let savedData= await UserModel.create(data)
    console.log("hello")
    res.send({msg: savedData})
}

const getUsersData= async function (req, res) {
    let allUsers= await UserModel.find()
    res.send({msg: allUsers})
}

module.exports.createUser= createUser
module.exports.getUsersData= getUsersData