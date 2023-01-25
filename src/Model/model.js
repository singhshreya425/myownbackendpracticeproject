//default status open
//task listing//either u can return array of task
//react DND module help in functionality of drag and drop
//state is being changed in dnd 
//single responsibility validation shouldn't 
const mongoose = require("mongoose");


const TaskSchema = new mongoose.Schema(
    {
        firstName : {
            type : String,
            required : [ true , "firstName is mandatory"],
            trim : true,
           // validate : [Validations.isValidName, "please provide a valid firstName" ]
        },
        lastName : {
            type : String,
            required : [ true , "lastName  is mandatory"],
            trim : true,
          //  validate : [Validations.isValidName, "please provide a valid lastName" ]
        },
        PhoneNumber : {
            type : String,
            required : [ true , "PhoneNumber  is mandatory"],
            trim : true,
            unique : true,
           // validate : [Validations.isValidMobile, "please provide a valid lastName" ] 
        },
        Age : {
            type : Number,
            required : [ true , "Age is mandatory"],
            trim : true,
        },
        Password : {
            type : String,
            required : [ true , "PinCode is mandatory"],
        },
       Status : {
            type: String,
            default: "Open",
            enum: {
                values: ["In-Progress", "Completed"],
                message: "Please enter correct status",
              },
        },
       
        Title : {
            type : String,
            required : [ true ],
            enum:{Mrs,Ms,Mr}
        },
        Description:{
            type:String,
            required:true
        }
    }, Deletetimestamps={ timestamps: true }
)
module.exports = mongoose.model("userModel",TaskSchema)

