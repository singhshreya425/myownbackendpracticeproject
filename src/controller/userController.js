const userModel = require("../model/userModel.js")
const jwt = require('jsonwebtoken')
const { validName, isValid ,validEmail,isValidPassword,validPhone,validImage,isValidPincode} = require("../validation/validation")
const {uploadFile} =require('../aws/aws.js')
const bcrypt =require("bcrypt")
const createUser = async function (req, res) {
    try {
        let data = req.body
        let files = req.files
        let { fname, lname, email, profileImage, phone, password, address } = data

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "data can't be empty" })
        let newarr = ["fname","lname","email","phone","password","address"]
       
        for(field of newarr) { if (!data[field]) return res.status(400).send({ status: false, msg: `${field} is empty input valid data` }) }
        if(!address || address =='') return res.status(400).send({status:false,message:"address is required"})
        data.address = JSON.parse(address)
        if(!isValid(data.address)) {return res.status(400).send({status:false,message:"Address should be in object"})} 
        if(!isValid(data)){return res.status(400).send({status:false,message:"data is in wrong format"})}
        if(!validName(fname)) {return res.status(400).send({status:false,message:"fname should be in alphabet"})}
        if(!validName(lname)) {return res.status(400).send({status:false,message:"lname should be in alphabet"})}
        if(!validEmail(email)){return res.status(400).send({status:false,message:"email is in wrong format"})}
        if(!isValidPassword(password)){return res.status(400).send({status:false,message:"password is in wrong format"})}
        bcrypt.hash(password,10,function(error,result){
            if(error) return res.status(400).send({status:false,message:error.message})
           else{ data.password =result }
        })
        if(!validPhone(phone)) {return res.status(400).send({status:false,mesaage:"phone number is in wrong format"})}
        if(!validImage(profileImage)) {return res.status(400).send({status:false,message:"profileImage should be in wrong format"})}
        if(files){
            const url = await uploadFile(files[0]) //fileupload on aws
              data.profileImage=url //bucketlink stored on profileimage 
        }else{
            return res.status(400).send({status:true,message:"profile is mandatory"})
        }
        let userCreated =await userModel.create(data)
        return res.status(201).send({status:true,message:"Data created succsesfully",data:userCreated})
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}
const loginUser = async function (req, res) {
    try {
        let { email, password } = req.body;

        if (Object.keys(req.body).length === 0) {
            return res.status(400).send({ status: false, message: "please input user Details" });
        }

        if (!email) {
            return res.status(400).send({ status: false, message: "EmailId is mandatory", });
        }
        if (!validator.isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "EmailId should be Valid", });
        }
        if (!password) {
            return res.status(400).send({
                status: false,
                message: "Password is mandatory",
            });
        }
        if (password.length < 8 || password.length > 15) {
            return res.status(400).send({ status: false, message: "the length of password must be min:- 8 or max: 15", });
        }

        let findUser = await userModel.findOne({ email });
        if (!findUser) return res.status(404).send({ status: false, message: "no user with this email exists" });

        let verifyUser = await userModel.findOne({ email: email, password: password, });
        if (!verifyUser) return res.status(400).send({ status: false, message: "Invalid Login Credential" });

        let payload = { userId: findUser._id, iat: Date.now(), };

        let token = jwt.sign(payload, "Group18", { expiresIn: "30s" });

        res.setHeader("x-api-key", token);
        res.status(200).send({ status: true, message: "User login successfull", data: { userId: id, token } });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message, });
    }
};

const getUser = async (req, res) => {

    try {
        const paramId = req.params.userId

        if (!paramId) { return res.status(400).send({ status: false, message: "User id is required in params" }) }

        const getData = await userModel.findById({ userId: userId });

        if (!getData) { return res.status(404).send({ status: false, message: "User id is not present in DB" }) }

        return res.status(200).send({ status: true, message: "User profile details", data: getData })

    } catch (error) {
        return res.status(500).send({ status: false, Message: error.Message })
    }

}

module.exports = { createUser, loginUser, getUser }