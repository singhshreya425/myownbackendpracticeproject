const userModel = require("../model/userModel.js")
const jwt = require('jsonwebtoken')
const { validName, isValid, validEmail, isValidPassword, validPhone, validImage, isValidPincode,isValidObjectIds } = require("../validation/validation")
const { uploadFile } = require('../aws/aws.js')
const bcrypt = require("bcrypt")

//===================================Create USer Api===========================================================//

const createUser = async function (req, res) {
    try {
        let data = req.body
        let files = req.files
        //--------------------------Destructuring user data------------------------------------//
        let { fname, lname, email, profileImage, phone, password, address } = data
        //---------------------------Body can't be empty-------------------------------------//
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "data can't be empty" })
        //---------------------------------validation for each key----------------------//
        let newarr = ["fname", "lname", "email", "phone", "password", "address"]

        for (field of newarr) { if (!data[field]) return res.status(400).send({ status: false, msg: `${field} is empty input valid data` }) }
        if (!address || address == '') return res.status(400).send({ status: false, message: "address is required" })
        //----------------------convert from JSON string to JSon onject of address-----------------//
        data.address = JSON.parse(address)
        
        //--------------------------------Destructuring address from object data----------------------------//
        let {shipping,billing}=data.address
        if(!shipping) return res.status(400).send({status:false,message:"Enter shipping address"})
        if(!isValid(shipping.street)) return res.status(400).send({status:false,message:"please enter valid shipping street "})
       // if(!isValid(shipping.city)) return res.status(400).send({status:false,message:"please enter shipping city"})
      //  if(!validName(city)) return res.status(400).send({status:false,message:"city should be alphabet"})

        //---------------------------------validation for billing--------------------------------------//
        if(!billing) return res.status(400).send({status:false,message:"Enter billing address"})
        if(!isValid(billing.street)) return res.status(400).send({status:false,messsge:"please enter billing street"})
        //if(!isValid(billing.city)) return res.status(400).send({status:false,message:"please enter billing city"})
        //if(!validName(city)) return res.status(400).send({status:false,message:"city should be in capital"})
        //if(!isValid(billing.pincode)) return res.status(400).send({status:false,message:"please enter billing pin"})
        //if(!isValidPincode(pincode)) return res.status(400).send({status:false,message:"invalid billing pin code"})


        //------------------------------validation of object---------------------------------------------//
        if (!isValid(data.address)) { return res.status(400).send({ status: false, message: "Address should be in object" }) }
        if (!isValid(data)) { return res.status(400).send({ status: false, message: "data is in wrong format" }) }
        if (!validName(fname)) { return res.status(400).send({ status: false, message: "fname should be in alphabet" }) }
        if (!validName(lname)) { return res.status(400).send({ status: false, message: "lname should be in alphabet" }) }
        if (!validEmail(email)) { return res.status(400).send({ status: false, message: "email is in wrong format" }) }
        if (!isValidPassword(password)) { return res.status(400).send({ status: false, message: "password is in wrong format" }) }
        //----------------------------------Encrypt the password by bcrypt-------------------------------//
        bcrypt.hash(password, 10, function (error, result) {
            if (error) return res.status(400).send({ status: false, message: error.message })
            else { data.password = result }
        })
        //---------Fetching data of email from db checking duplicate email or phone is present or not------------//
        const isDuplicateEmail = await userModel.findOne({ $or: [{ email: email }, { phone: phone }] })
        if (isDuplicateEmail) {
            if (isDuplicateEmail.email == email) { return res.status(400).send({ status: false, message: `this emailId:${email} is already exist` }) }
            if (isDuplicateEmail.phone == phone) { return res.status(400).send({ status: false, message: `this emailId:${phone} is already exist` }) }
        }
        if (!validPhone(phone)) { return res.status(400).send({ status: false, mesaage: "phone number is in wrong format" }) }
     //   if (!validImage(profileImage)) { return res.status(400).send({ status: false, message: "profileImage should be in wrong format" }) }
        //-------------------------------create s3 link--------------------------------------------------------//
        if (files) {
            const url = await uploadFile(files[0]) //fileupload on aws
            data.profileImage = url //bucketlink stored on profileimage 
        } else {
            return res.status(400).send({ status: true, message: "profile is mandatory" })
        }
        let userCreated = await userModel.create(data)
        return res.status(201).send({ status: true, message: "Data created succsesfully", data: userCreated })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//------------------------------------------------------------Login Api-------------------------------------------------------------------------------

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
            return res.status(400).send({ status: false,message: "Password is mandatory" });
        }
        if (password.length < 8 || password.length > 15) {
            return res.status(400).send({ status: false, message: "the length of password must be min:- 8 or max: 15", });
        }
       
         let verifyUser = await userModel.findOne({ email: email});
        if (!verifyUser) return res.status(400).send({ status: false, message: "Invalid Login Credential" });

        //-------------------------------------------Decrypt the password and compare the password with user input------------------------------------------//
        bcrypt.compare(password, verifyUser.password, function(error, verifyUser) {
            if(error) return res.status(400).send({status:false,message:error.message})
        //    else verifyUser == true
        });
        

        let payload = { userId:verifyUser["_id"], iat: Date.now(), };
       

        let token = jwt.sign(payload, "Group18", { expiresIn: "24h" });

        res.setHeader("authorization", token);
        res.status(200).send({ status: true, message: "User login successfull", data: { userId:verifyUser["_id"], token } });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message, });
    }
};
//-----------------------------------------------------------------Get User Api--------------------------------------------------------------------------

const getUser = async (req, res) => {

    try {
        const paramId = req.params.userId

        if (!paramId) { return res.status(400).send({ status: false, message: "User id is required in params" }) }
        if (!isValidObjectIds(paramId)) return res.status(400).send({ status: false, messsge: "Invalid user Id" })

        const getData = await userModel.findById({ _id: paramId});

        if (!getData) { return res.status(404).send({ status: false, message: "User id is not present in DB" }) }

        return res.status(200).send({ status: true, message: "User profile details", data: getData })

    } catch (error) {
        return res.status(500).send({ status: false, Message: error.Message })
    }

}

//-------------------------------------------------------Update User Api----------------------------------------------------------------------------

const updateUser = async function (req, res) {
    try {
        const data = req.body;
        const files = req.files;
        const userId = req.params.userId;
        const update = {};
        //-------------------------Destructuring user body data------------------------------------------------//
        const { fname, lname, email, password, phone, address } = data;
       if(object.keys(data).length==0)return res.status(400).send({status:false,message:"data can't be empty"})
        if (!isValid(data) && !files) {
            return res.status(400).send({ status: false, mesaage: "invalid format" });
        }
        if (fname) {
            if (!isValid(fname) || !validName(fname)) {
                return res.status(400).send({ status: false, message: "please provide correct fname" })
            }
            update["fname"] = fname;
        }
        if (lname) {
            if (!isValid(lname) || !validName(lname)) {
                return res.status(400).send({ status: false, message: "please provide correct lname" })
            }
            update["lname"] = fname;
        }
        if (email) {
            if (!validEmail(email)) {
                return res.status(400).send({ status: false, message: "please provide valid email" })
            }

            let useremail = await userModel.findOne({ email: email });
            if (useremail) {
                return res.status(400).send({ status: false, mesaage: "please provide  unique email address" })
            }
            update["email"] = email
        }
        if (phone) {
            if (!isValid(phone)) {
                return res.status(400).send({ status: false, message: "please provide valid phone number" })
            }

            let userphonenumber = await userModel.findOne({ phone: phone });
            if (userphonenumber) {
                return res.status(400).send({ status: false, message: "please provide unique phone number" });
            }
            update["phone"] = phone
        }
        if (password) {
            if (!isValid(password)) {
                return res.status(400).send({ status: false, message: "please provide correct password" });
            }

            let userpassword = await userModel.findOne({ password: password });
            if (userpassword) {
                return res.status(400).send({ status: false, message: "please provide unique password" })
            }
            const salt = await bcrypt.genSalt(30);
            data.password = await bcrypt.hash(data.password, salt);

            let encryptPassword = data.password;
            update["password"] = encryptPassword;
        }
        
        if(address){
            const {shipping,billing}=address;

            if(shipping){
                const {street,city,pincode}=shipping;
                if(street){
                    if (!validName(address.shipping.street)){
                        return res.status(400).send({status:false,message:"Invalid shipping street"});
                    }
                    update["address.shipping.street"]=street;
                }
                if (city){
                    if (!validName(address.shipping.city)){
                        return res.status(400).send({status:false,message:"please provide correct city details"});
                    }
                    update["address.shipping.city"]=city;
                }
                if (pincode){
                    if (!isValidPincode(address.shipping.city)){
                        return res.status(400).send({status:false,message:"please provide valid pincode"})
                    }
                    update["address.shipping.city"]=pincode;
                }
            }
            if (billing){
                const {street,city,pincode}=billing;
                if (street){
                    if (!validName(address.billing.street)){
                        return res.status(400).send({status:false,message:"please provide correct street details"})
                    }
                    update["address.billing.street"]=street
                }
                if (city) {
                    if (!validName(address.billing.city)) {
                      return res.status(400).send({ status: false, message: " please provide a proper Billing city " });
                    }
                    update["address.billing.city"] = city;
                  }
                  if (pincode) {
                    if (!isValidPincode(address.billing.city)) {
                      return res.status(400).send({ status: false, message: "Invalid Pincode" });
                    }
                    update["address.billing.city"] = pincode;
                  }
            }
        }
        if (files && files.length > 0) {

            if (!isValidFile(files[0].originalname))
              return res.status(400).send({ status: false, message: `Enter format jpeg/jpg/png only.` });
      
            let uploadedFileURL = await AWS.uploadFile(files[0]);
      
            update["profileImage"] = uploadedFileURL;
          }  
          else if (Object.keys(data).includes("profileImage")) {
            return res.status(400).send({ status: false, message: "please add profileimage" });
          }
      
          const updateUser = await userModel.findOneAndUpdate({ _id: userId },update,{ new: true });
          return res.status(200).send({status: true,message: "user profile successfully updated",data: updateUser,});

 } catch (error) {
       return res.status(500).send({status:false,message:error.message})
    }
}
module.exports = { createUser, loginUser, getUser, updateUser }