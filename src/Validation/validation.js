const mongoose =require("mongoose")

const isValid=function(value){
    if( typeof value=='undefined' || value==null) return false
    if( typeof value=='string' && value.trim().length===0) return false
    return true
}

const validName=function(name){
    const nameRegex=/^[A-Z a-z]+$/
    return nameRegex.test(name)
}
const validEmail=function(email){
    const emailRegex=/^[_a-z0-9-]+(\.[_a-z0-9-]+)@[a-z0-9-]+(\.[a-z0-9-]+)(\.[a-z]{2,3})$/
    return emailRegex.test(email)
}
const isValidPassword=function(password){
     password = password.trim()
    const passRegex= /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
    return passRegex.test(password)
}
const validPhone=function(phone){
    const phoneRegex=/^[789]\d{9}$/
    return phoneRegex.test(phone)
}
const validImage =function(value){
    const imageRegex= /\.(gif|jpe?g|tiff?|png|webp|bmp)$/ 
    return imageRegex.test(value)
}
const isValidPincode=function(pincode){
    const pincoderegex= /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/
    return pincoderegex.test(pincode)
}

module.exports={validName,isValid,validEmail,isValidPassword,validPhone,validImage,isValidPincode}