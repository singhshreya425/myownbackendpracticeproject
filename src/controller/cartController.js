const cartModel= require("../model/cartModel")
const productModel= require("../model/productModel")
const { findById } = require("../model/userModel")
const userModel =require("../model/userModel")
const { isValidObjectIds} = require("../validation/validation")

const createCart= async (req,res)=>{
    try {
        let userId= req.params.userId
        let data= req.body
        //------------------------------Destructuring cart body data-------------------------------------------------------//
        let {cartId,productId,quantity}=data
       if(object.keys(data).length==0) return res.status(400).send({status:false,message:"No data found from body to put something(i.e.cartId .productId"})
       if(!cartId || !productId) return res.status(400).send({status:false,message:"Please enter the data in request body"})
       //------------------------------validation for cartId --------------------------------------------------//
       if(cartId){
        if(!isValidObjectIds(cartId)) return res.status(400).send({status:false,message:"cartId is not valid"})  
            let checkCreate =await findById(cartId)
            if(!checkCreate) return res.status(404).send({stats:false,message:"cartId is not found"})
        }
        //----------------------------------validation for product id------------------------------------------------//
        if(productId){
            if(!isValidObjectIds(productId)) return res.status(400).send({status:false,message:"Product id is not valid"})
            let productExist = await productModel.findOne({ _id: productId, isDeleted: false })
            if (!productExist) {
                return res.status(404).send({ status: false, message: "product does not exist" })
            }}
        
            //================ check if cart belong to the same user ===================
    
            let validCart = await cartModel.findOne({ userId: userId })
            if (validCart) {
                if (cartId) {
                    if (validCart._id.toString() != cartId) {
                        return res.status(403).send({ status: false, message: `Cart does not belong to this user` })
                    }
                }
               
                let productInCart = validCart.items
                let proId = productExist._id.toString()
                for (let i = 0; i < productInCart.length; i++) {
                    let productFromItem = productInCart[i].productId.toString()
    
    
                    //==================== if product is already present in cart ==========================================
                    
                    if (proId == productFromItem) {
                        let oldCount = productInCart[i].quantity
                        let newCount = oldCount + 1
                        let uptotal = (validCart.totalPrice + (productExist.price)).toFixed(2)
                        productInCart[i].quantity = newCount
                        validCart.totalPrice = uptotal
                        await validCart.save();
                        await validCart.populate({ path: "items.productId", select: { price: 1, title: 1, productImage: 1, _id: 0 } })
                        return res.status(201).send({ status: true, message: 'Success', data: validCart })
                    }
                }
    
                //================================== if new product wants to be added ====================================
              
                validCart.items.push({ productId: productId, quantity: 1 })
                let total = (validCart.totalPrice + (productExist.price * 1)).toFixed(2)
                validCart.totalPrice = total
                let count = validCart.totalItems
                validCart.totalItems = count + 1
                await validCart.save()
                await validCart.populate({ path: "items.productId", select: { price: 1, title: 1, productImage: 1, _id: 0 } })
                return res.status(201).send({ status: true, message: 'Success', data: validCart })
    
    
    
            }
            //==================================== if user does not have cart =====================================================
         
            let calprice = (productExist.price * 1).toFixed(2)
            let obj = {
                userId: requestparams,
                items: [{
                    productId: productId,
                    quantity: 1
                }],
                totalPrice: calprice,
            }
            obj['totalItems'] = obj.items.length
            let result = await cartModel.create(obj)
            await result.populate({ path: "items.productId", select: { price: 1, title: 1, productImage: 1, _id: 0 } })
    
            return res.status(201).send({ status: true, message: 'Success', data: result })
    
    }
        catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    }
    const getCart = async function (req, res) {
        try {
            let userId = req.params.userId;
            //if userId is given then is it valid or not
            if (userId) {
                if (!isValidObjectIds(userId))
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
   
//----------------------------------------------------update cart---------------------------------------------------------------------------//

const updateCart =async function(req,res){
    try{
        let data = req.body;
        let userId =req.params.userId
        if(!userId) return res.status(400).send({status:false,message:"Please provide userId in path params"})
        if(!isValidObjectIds(userId)) return res.status(400).send({status:false,message:"userId is not valid"})
        //----------------------------checking for a valid user input---------------------------------------//
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
        //--------------------------------------checking the remove product value-----------------------------------------------//
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