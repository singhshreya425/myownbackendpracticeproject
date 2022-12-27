const userModel = require("../model/userModel.js")
const jwt = require('jsonwebtoken')
const { validName, isValid, validEmail, isValidPassword, validPhone, validImage, isValidPincode, isValidObjectIds, isValidStreet } = require("../validation/validation")
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

        if (data.address || data.address == "") {            // Validate address
            data.address = JSON.parse(data.address);
            if (!isValid(data.address)) {
                return res.status(400).send({ status: false, message: "Please provide address details!" });
            }
            if (!isValid(data.address.shipping)) {
                return res.status(400).send({ status: false, message: "Please enter shipping address!" });
            }
            if (!isValid(data.address.shipping.city) || !validName(data.address.shipping.city)) {
                return res.status(400).send({ status: false, message: "Please provide a valid city in shiping address!" });
            }
            if (!isValid(data.address.shipping.street) || !isValidStreet(data.address.shipping.street)) {
                return res.status(400).send({ status: false, message: "Please provide a valid street in shiping address!" });
            }
            if (!isValid(data.address.shipping.pincode) || !isValidPincode(data.address.shipping.pincode)) {
                return res.status(400).send({ status: false, message: "Please provide a valid pincode in shiping address!" });
            }

            if (!isValid(data.address.billing)) {
                return res.status(400).send({ status: false, message: "Please enter billing address!" });
            }
            if (!isValid(data.address.billing.city) || !validName(data.address.billing.city)) {
                return res.status(400).send({ status: false, message: "Please provide a valid city in billing address!" });
            }
            if (!isValid(data.address.billing.street) || !isValidStreet(data.address.billing.street)) {
                return res.status(400).send({ status: false, message: "Please provide a valid street in billing address!" });
            }
            if (!isValid(data.address.billing.pincode) || !isValidPincode(data.address.billing.pincode)) {
                return res.status(400).send({ status: false, message: "Please provide a valid pincode in billing address!" });
            }
        }

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
            if (isDuplicateEmail.phone == phone) { return res.status(400).send({ status: false, message: `this phone:${phone} is already exist` }) }
        }
        if (!validPhone(phone)) { return res.status(400).send({ status: false, mesaage: "phone number is in wrong format" }) }
        //   if (!validImage(profileImage)) { return res.status(400).send({ status: false, message: "profileImage should be in wrong format" }) }
        //-------------------------------create s3 link--------------------------------------------------------//
        if(!isValid(profileImage)){return res.status(400).send({status:false,message:"profile image is in wrong format"})}
        if(files[0].fieldname!=="profileImage"){return res.status(400).send({status:false,message:"Name of filed is not correct"})}
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


        let token = jwt.sign(payload, "Group18", { expiresIn: "24h" });

        res.setHeader("authorization", token);
        res.status(200).send({ status: true, message: "User login successfull", data: { userId: verifyUser["_id"], token } });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message, });
    }
};
//-----------------------------------------------------------------Get User Api--------------------------------------------------------------------------

const getUser = async function(req, res)  {

    try {
        let userId= req.params.userId
        let tokenUserId = req.decode.userId
       
      //  if (!userId) { return res.status(400).send({ status: false, message: "User id is required in params" }) }
        if (!isValidObjectIds(userId)) return res.status(400).send({ status: false, messsge: "Invalid user Id" })
        //------------------------userId matches from the token for authorization purpose-------------------------------//
        if(userId!==tokenUserId){return res.status(403).send({status:false,message:"you are not authorized user"})}
        const getData = await userModel.findById({ _id: userId });

        if (!getData) { return res.status(404).send({ status: false, message: "User id is not present in DB" }) }

        return res.status(200).send({ status: true, message: "User profile details", data: getData })

    } catch (error) {
        return res.status(500).send({ status: false, Message: error.Message })
    }

}

//-------------------------------------------------------Update User Api----------------------------------------------------------------------------

const updateUser = async function (req, res) {
    try {
        let userId = req.params.userId;
        const data = req.body;
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Insert Data : BAD REQUEST" });
        }

        let { fname, lname, email, phone, password } = data;
        if (fname || fname == "") {                     //validation for fname
            if (!isValid(fname)) {
                return res.status(400).send({ status: false, message: "Please Provide first name" });
            }
            if (!validName(fname)) {
                return res.status(400).send({ status: false, msg: "Invalid fname" });
            }
        }

        if (lname || lname == "") {                   //validation for lname
            if (!isValid(lname)) {
                return res.status(400).send({ status: false, msg: "Please Provide last name" });
            }
            if (!validName(lname)) {
                return res.status(400).send({ status: false, msg: "Invalid lname" });
            }
        }

        if (email || email == "") {                 //validation for mail
            if (!isValid(email)) {
                return res.status(400).send({ status: false, msg: "Please Provide email address" });
            }

            if (!validEmail(email)) {
                return res
                    .status(400).send({ status: false, message: "Provide a valid email id" });
            }
            const checkEmail = await userModel.findOne({ email: email });
            if (checkEmail) {
                return res.status(400).send({ status: false, message: "email id already exist" });
            }
        }
        if (phone || phone == "") {           //validation for phone no.        
            if (!isValid(phone)) {
                return res.status(400).send({ status: false, msg: "Please Provide email address" });
            }
            if (!validPhone(phone)) {  return res.status(400).send({ status: false, message: "Invalid phone number" }) }

            const checkPhone = await userModel.findOne({ phone: phone });
            if (checkPhone) {return res.status(400).send({ status: false, message: "phone number already exist" }) }}
        if (password || password == "") {                 // validation for password
            if (!isValid(password)) { return res.status(400).send({ status: false, message: "password is required" }) }
            if (!isValidPassword(password)) {
                return res.status(400).send({ status: false, message: "Password should be Valid min 8 character and max 15 " });
            }

            const encrypt = await bcrypt.hash(password, 10);
            data.password = encrypt;
        }

        if (data.address || data.address == "") {            // Validate address
            data.address = JSON.parse(data.address);
            if (!isValid(data.address)) {
                return res.status(400).send({ status: false, message: "Please provide address details!" });
            }
            if (!isValid(data.address.shipping)) {
                return res.status(400).send({ status: false, message: "Please enter shipping address!" });
            }
            if (!isValid(data.address.shipping.city) || !validName(data.address.shipping.city)) {
                return res.status(400).send({ status: false, message: "Please provide a valid city in shiping address!" });
            }
            if (!isValid(data.address.shipping.street) || !isValidStreet(data.address.shipping.street)) {
                return res.status(400).send({ status: false, message: "Please provide a valid street in shiping address!" });
            }
            if (!isValid(data.address.shipping.pincode) || !isValidPincode(data.address.shipping.pincode)) {
                return res.status(400).send({ status: false, message: "Please provide a valid pincode in shiping address!" });
            }

            if (!isValid(data.address.billing)) {
                return res.status(400).send({ status: false, message: "Please enter billing address!" });
            }
            if (!isValid(data.address.billing.city) || !validName(data.address.billing.city)) {
                return res.status(400).send({ status: false, message: "Please provide a valid city in billing address!" });
            }
            if (!isValid(data.address.billing.street) || !isValidStreet(data.address.billing.street)) {
                return res.status(400).send({ status: false, message: "Please provide a valid street in billing address!" });
            }
            if (!isValid(data.address.billing.pincode) || !isValidPincode(data.address.billing.pincode)) {
                return res.status(400).send({ status: false, message: "Please provide a valid pincode in billing address!" });
            }
        }

        let updateData = await userModel.findOneAndUpdate({ _id: userId }, data, { new: true });
        res.status(200).send({ status: true, message: "User profile updated", data: updateData });
    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
};
module.exports = { createUser, loginUser, getUser, updateUser }