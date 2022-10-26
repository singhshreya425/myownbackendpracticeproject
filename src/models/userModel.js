const mongoose = require('mongoose');
// const {Schema} = mongoose;

const userSchema = new mongoose.Schema( {
   
 
    firstName: String,
    lastName: String,
    mobile: {
        type: String,
        unique: true,
        required: true
    },
    emailId: String,
    gender: {
        type: String,
        enum: ["male", "female", "LGBTQ"] //"falana" will give an error
    }

}, { timestamps: true });


module.exports = mongoose.model('User', userSchema) //users-collections(plural form of it)



// String, Number
// Boolean, Object/json, array