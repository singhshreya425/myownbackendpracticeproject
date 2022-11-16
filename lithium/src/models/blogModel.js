const mongoose= require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId
const blogSchema= new mongoose.Schema({


    title:{
        type:String,
         },
    body:{
        type:String,
        required:true
    },
    authorId:{
        type:ObjectId,
        required:true,
        ref:"author"
    },
    tags:[String],
    category:{
        type:String,
        requird:true
    },
    subcategory:[String],
     isDeleted:{
        type:Boolean,
        default:false
     },
     isPublished:{
        type:Boolean,
        default:false
     },
     deletedAt:{
        type : Date,
        require : true,
        default : Date.now
    } ,
     
     publishedAt:{
        type : Date,
        require : true,
        default : Date.now
    } ,
     
    },{timestamps:true});





    module.exports = mongoose.model('blog', blogSchema)