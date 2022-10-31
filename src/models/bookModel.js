const mongoose = require('mongoose');
const { type } = require('os');
const ObjectId = mongoose.Schema.Types.ObjectId

const bookSchema = new mongoose.Schema( {
    name:{
        type: String,
        unique:true,
        require:true
    },
    author_id: {
        type: ObjectId,
        ref: "libauthor"
    }, 
    price: Number,
    ratings: Number,
    publisher: {
        type:ObjectId,
        ref:"publisher"
   },
   isHardCover:{
    type:Boolean,
    default:false
   },

}, { timestamps: true });


module.exports = mongoose.model('libbook', bookSchema)
