const mongoose= require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId
const blogSchema= new mongoose.Schema({


    title:{
        type:String,
        required: true
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
     subcategory:{ },

     createdAt: Date.now(),
     updatedAt: Date.now(),
     deletedAt:Date.now(),
     isDeleted:{
        type:Boolean,
        default:false
     },
     publishedAt:Date.now(),
     isPublished:{
        type:Boolean,
        default:false
     },
     
    },{timestamps:true});





    module.exports = mongoose.model('blog', blogSchema)