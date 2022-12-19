const mongoose =require("mongoose")

const isValid=function(value){
    if( typeof value=='undefined' || value==null) return false
    if( typeof value=='string' && value.trim().length===0) return false
    return true
}

//----------------------------------------------Validation for name-----------------------------------------------------------------------------

const validName=function(name){
    const nameRegex=/^[A-Z a-z]+$/
    return nameRegex.test(name)
}

//----------------------------------------------Validation for email-----------------------------------------------------------------------------

const validEmail=function(email){
    const emailRegex=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return emailRegex.test(email)
}

//----------------------------------------------Validation for password-----------------------------------------------------------------------------

const isValidPassword=function(password){
     password = password.trim()
    const passRegex= /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
    return passRegex.test(password)
}

//----------------------------------------------Validation for phone-----------------------------------------------------------------------------

const validPhone=function(phone){
    const phoneRegex=/^[789]\d{9}$/
    return phoneRegex.test(phone)
}

//----------------------------------------------Validation for Image-----------------------------------------------------------------------------

const validImage =function(value){
    const imageRegex= /^\.(gif|jpe?g|tiff?|png|webp|bmp)$/ 
    return imageRegex.test(value)
}

//----------------------------------------------Validation for pincode-----------------------------------------------------------------------------

const isValidPincode=function(pincode){
    const pincoderegex= /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/
    return pincoderegex.test(pincode)
}

module.exports={validName,isValid,validEmail,isValidPassword,validPhone,validImage,isValidPincode}