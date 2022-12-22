const cartModel= require("../model/cartModel")
const productModel= require("../model/productModel")
const userModel =require("../model/userModel")
const { isValidObjectIds} = require("../validation/validation")

const createCart= async (req,res)=>{
    try {
        let userIdparams= req.params.userId
        let bodyData= req.body
        let { productId,  quantity}= bodyData
    
        
        const findProduct= await productModel.findOne({_id: productId,isDeleted: false,})
    
       
        if(!findProduct){ return res.send({msg:"can not find product"});}
    
    //    const findCart =await cartModel.findone({userId:userIdparams});
    
    //    if(findCart!=null){
    //     let updateCart = await cartModel.updateOne({ userId:userIdparams},
    //         {$push: { productId:productId,quantity:quantity }}, { new: true });
    
            
    //         return res.send({data:updateCart})
    //     }
        
    //    else if(!findCart||findCart==null||findCart==undefined){
    
        const finalCart={
            userId,
            items:[{productId:productId,quantity:quantity}],
            totalPrice:findProduct.price*quantity,
            totalItems:1//object.key(items).length
        }
    
        const createCart=await cartModel.create(finalCart); 
    
        return res.status(201).send({status:true,carts:createCart});
    
    //} 
     
    } catch (error) {
        return res.status(500).send({status:false, Message:error.Message})
    }
    }
    const getCart = async function (req, res) {
        try {
            let userId = req.params.userId;
            //if userId is given then is it valid or not
            if (userId) {
                if (!isValid.isValidObjectIds(userId))
                    return res.status(400).send({ status: false, msg: "wrong userId" });
            }
            // finding user in DB 
            let checkUserId = await userModel.findOne({ _id: userId });
            if (!checkUserId) {
                return res.status(404).send({ status: false, message: "no user details found" });
            }
            // finding in cart 
            let getData = await cartModel.findOne({ userId });
            if (getData.items.length == 0)
                return res.status(400).send({ status: false, message: "items details not found" });
            //If not get
            if (!getData) {
                return res.status(404).send({ status: false, message: "cart not found" });
            }
            res.status(200).send({ status: true, message: "cart successfully", data: getData });
        } catch (err) {
            return res.status(500).send({ status: false, msg: err.message })
        }
    }
    module.exports.getCart=getCart
//----------------------------------------------------update cart---------------------------------------------------------------------------//

const updateCart =async function(req,res){
    try{
        let data = req.body;
        let userId =req.params.userId
        if(!userId) return res.status(400).send({status:false,message:"Please provide userId in path params"})
        if(!isValidObjectIds(userId)) return res.status(400).send({status:false,message:"userId is not valid"})
        let checkUser =await userModel.findById(userId)
        if(!checkUser) return res.status(404).send({status:false,message:"user is not found"})
        if(Object.keys(data).length==0) return res.status(400).send({status:false,message:"Body cannot be empty"})

        let {productId,cartId,removeProduct} =data

        if(!cartId) return res.status(400).send({status:false,message:"Plz provide cartId"})
        if(!isValidObjectIds(cartId)) return res.status(400).send({status:false,message:"cartId is not valid"})
        let findCart =await cartModel.findOne({_id:cartId,isDeleted:false})
        if(!findCart )return res.status(404).send({status:false,message:"cart not found"})
        if(userId !=findCart.userId) return res.status(403).send({status:false,message:"Access denied ,this is not your cart"})
        if(!productId) return res.status(400).send({status:false,message:"Plz provide productId"})
        if(!isValidObjectIds(cartId)) return res.status(400).send({status:false,message:"productId is not valid"})
        let findProduct =await productModel.findOne({_id:productId,isDeleted:false})
        if(typeof removeProduct != "number") return res.status(400).send({status:false,message:"removeProduct value should be Number"})
        //--------------------------------------remove product condition-----------------------------------------------//
        if((removeProduct !==0 && removeProduct !==1)){
              return res.status(400).send({status:false,message:"removeProduct value should be 0 or 1 only"})

        }
        let productPrice =findProduct.price
        let item = findCart.items
        //-----------------------------------checking cart is empty-------------------------------------------//
        if(item.length==0) return res.status(404).send({status:false,message:"cart is empty"})
        let productIndex =item.findIndex(loopVariable=>loopVariable.productId.toString()==productId)
        if(productIndex > -1){
            if( removeProduct ==1){
                item[productIndex].quantity--
                 findCart.totalPrice -=productPrice

            }
            else if(removeProduct ==0){
                let changePrice =item[productIndex].quantity * productPrice
                findCart.totalPrice -=changePrice
                item[productIndex].quantity = 0
            }
            if (item[productIndex].quantity == 0) {
                item.splice(productIndex, 1)
            }
        }
        if (productIndex == -1) {

            return res.status(404).send({ status: false, message: "productId not found in cart" })
        }
 
        findCart.totalItems = item.length
        await findCart.save()
        let find = await cartModel.findOne({ userId: userId }).populate('items.productId')

        return res.status(200).send({ status: true, message: "Success", data: find })
    }

    
        
    catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}
const deleteCart = async function (req, res) {
    try {
        let user_id = req.params.userId
        let items = []
        if (!isValidObjectIds(user_id))return res. status(400). send({ status: false, message: `${user_id} is not valid` })
        let findUser = await cartModel.findOne({ userId: user_id })
        if (!findUser) return res. status(404). send({ status: false, message: `cart is not  exist for this ${user_id} user` })
        let data = await cartModel.findOneAndUpdate({ userId: user_id }, { $set: { items: items, totalPrice: 0, totalItems: 0 } }, { returnOriginal: false })
        res. status(204). send({ status: true, message: "Cart deleted Successfully", data: data })  //no content on the request
    } catch (error) {res.status(500).send({ status: false, message: error.message })
    }
}

module.exports={updateCart,deleteCart,getCart,createCart}