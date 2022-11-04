const mongoose=require("mongoose")
const objectId =mongoose.Schema.Types.ObjectId
const ordermodel = new mongoose.Schema({
    userId:{
        type:objectId,
        ref:"User"
    },
    productId:{
        type:objectId,
        ref:"product"
    },
    amount:{
        type:Number,
        default:0
    },
    isFreeAppUser:{
        type:Boolean,
        default:false
    },
    date:{
        type:String,
        default:Date.now()
    }

    },{ timestamps: true });


module.exports=mongoose.model('order',ordermodel)









	
	
	 
	