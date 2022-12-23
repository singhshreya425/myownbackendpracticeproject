const cartModel= require("../model/cartModel")
const productModel= require("../model/productModel")
const { findById } = require("../model/userModel")
const userModel =require("../model/userModel")
const { isValidObjectIds,isValid,isValidNum} = require("../validation/validation")

//<<<===================== This function is used for Create Cart Data =====================>>>//
const createCart = async (req, res) => {

    try {

        let userId = req.params.userId
        let data = req.body

        //===================== Destructuring Cart Body Data =====================//
        let { cartId, productId, quantity} = data

        //===================== Checking Field =====================//
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Data is required inside request body" })
        //===================== Validation of productId =====================//
        if (!isValid(productId)) return res.status(400).send({ status: false, message: "Enter ProductId." })
        if (! isValidObjectIds(productId)) return res.status(400).send({ status: false, message: `This ProductId: ${productId} is not valid!` })

        //===================== Fetching Product Data is Present or Not =====================//
        let checkProduct = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!checkProduct) { return res.status(404).send({ status: false, message: `This ProductId: ${productId} is not exist!` }) }


        if (quantity || typeof quantity == 'string') {

            if (!isValid(quantity)) return res.status(400).send({ status: false, message: "Enter a valid value for quantity!" });
            if (!isValidNum(quantity)) return res.status(400).send({ status: false, message: "Quantity of product should be in numbers." })

        } else {
            quantity = 1
        }

        //===================== Assign Value =====================//
        let Price = checkProduct.price


        if (cartId) {

            //===================== Checking the CartId is Valid or Not by Mongoose =====================//
            if (!isValid(cartId)) return res.status(400).send({ status: false, message: "Enter a valid cartId" });
            if (!isValidObjectIds(cartId)) return res.status(400).send({ status: false, message: `This cartId: ${cartId} is not valid!.` })

            //===================== Fetch the Cart Data from DB =====================//
            let checkCart = await cartModel.findOne({ _id: cartId, userId: userId }).select({ _id: 0, items: 1, totalPrice: 1, totalItems: 1 })

            //===================== This condition will run when Card Data is present =====================//
            if (checkCart) {

                let items = checkCart.items
                let object = {}

                //===================== Run Loop in items Array =====================//
                for (let i = 0; i < items.length; i++) {

                    //===================== Checking both ProductId are match or not =====================//
                    if (items[i].productId.toString() == productId) {

                        items[i]['quantity'] = (items[i]['quantity']) + quantity
                        let totalPrice = checkCart.totalPrice + (quantity * Price)
                        let totalItem = items.length

                        //===================== Push the Key and Value into Object =====================//
                        object.items = items
                        object.totalPrice = totalPrice
                        object.totalItems = totalItem

                        //===================== Update Cart document =====================//
                        let updateCart = await cartModel.findOneAndUpdate({ _id: cartId }, { $set: object }, { new: true }).populate('items.productId')

                        return res.status(201).send({ status: true, message: "Success", data: updateCart })

                    }
                }

                //===================== Pushing the Object into items Array =====================//
                items.push({ productId: productId, quantity: quantity })
                let tPrice = checkCart.totalPrice + (quantity * Price)

                //===================== Push the Key and Value into Object =====================//
                object.items = items
                object.totalPrice = tPrice
                object.totalItems = items.length

                //===================== Update Cart document =====================//
                let update1Cart = await cartModel.findOneAndUpdate({ _id: cartId }, { $set: object }, { new: true }).populate('items.productId')

                return res.status(201).send({ status: true, message: "Success", data: update1Cart })

            } else {

                return res.status(404).send({ status: false, message: 'Cart is not exist with this userId!' })
            }

        } else {

            //===================== Fetch the Cart Data from DB =====================//
            let cart = await cartModel.findOne({ userId: userId })

            //===================== This condition will run when Card Data is not present =====================//
            if (!cart) {

                //===================== Make a empty Array =====================//
                let arr = []
                let totalPrice = quantity * Price

                //===================== Pushing the Object into items Arr =====================//
                arr.push({ productId: productId, quantity: quantity })
                
                //===================== Create a object for Create Cart =====================//
                let obj = {
                    userId: userId,
                    items: arr,
                    totalItems: arr.length,
                    totalPrice: totalPrice
                }

                //===================== Final Cart Creation =====================//
                await cartModel.create(obj)

                let resData = await cartModel.findOne({ userId }).populate('items.productId')

                return res.status(201).send({ status: true, message: "Success", data: resData })

            } else {

                return res.status(400).send({ status: false, message: "You have already CardId which is exist in your account." })
            }
        }

    } catch (error) {

        return res.status(500).send({ status: false, error: error.message })
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

module.exports={updateCart,deleteCart,createCart,getCart}