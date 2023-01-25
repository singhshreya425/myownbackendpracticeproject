const userModel = require("../model/usermodel");
const jwt = require("jsonwebtoken");
const mongoose=require("mongoose")

const createuser = async function (req,res){
    try {
        let data = req.body
        if (!data) return res.status(400).send({status:false,message:"plz provide appropriate data"})
        const createdata=await userModel.create(data);
        return res.status(201).send({status:true,msg:createdata})
    } catch (error) {
        return res.status(500).send({status:false,message:error.message})  
    }
}
module.export.createuser=createuser


const loginUser = async function (req, res) {
    try {
        let { email, password } = req.body;

        if (Object.keys(req.body).length === 0) {
            return res.status(400).send({ status: false, message: "please input user Details" });
        }

        if (!email) {
            return res.status(400).send({ status: false, message: "EmailId is mandatory", });
        }
        if (!validEmail(email)) {
            return res.status(400).send({ status: false, message: "EmailId should be Valid", });
        }
        if (!password) {
            return res.status(400).send({ status: false, message: "Password is mandatory" });
        }
        if (password.length < 8 || password.length > 15) {
            return res.status(400).send({ status: false, message: "the length of password must be min:- 8 or max: 15", });
        }

        let verifyUser = await userModel.findOne({ email: email });
        if (!verifyUser) return res.status(400).send({ status: false, message: "Invalid Login Credential" });

        //-------------------------------------------Decrypt the password and compare the password with user input------------------------------------------//
        bcrypt.compare(password, verifyUser.password, function (error, verifyUser) {
            if (error) return res.status(400).send({ status: false, message: error.message })
            //    else verifyUser == true
        });


        let payload = { userId: verifyUser["_id"], iat: Date.now(), };


        let token = jwt.sign(payload, "CloudDesign", { expiresIn: "24h" });

        res.setHeader("authorization", token);
        res.status(200).send({ status: true, message: "User login successfull", data: { userId: verifyUser["_id"], token } });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message, });
    }
};

module.export.loginUser=loginUser