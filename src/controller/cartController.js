const cartModel= require("../model/cartModel")
const productModel= require("../model/productModel")
const userModel =require("../model/userModel")
const { isValidObjectIds,isValid,isValidNum} = require("../validation/validation")

//<<<===================== This function is used for Create Cart Data =====================>>>//
const createCart = async function (req, res)  {

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
        
        if(quantity<0)return res.status(400).send({status:false,message:"quantity is must be greater than 0"})
        
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

            } 

            else {

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

                let resData = await cartModel.findOneAndUpdate({ userId },{ $push: { productId: productId, quantity: quantity}}).populate('items.productId')

                return res.status(201).send({ status: true, message: "Success", data: resData })

            } else {

                return res.status(400).send({ status: false, message: "You have already CardId which is exist in your account." })
            }
        }

    } catch (error) {

        return res.status(500).send({ status: false, error: error.message })
    }
}

//<<<===================== This function is used for Update Cart Data =====================>>>//
const updateCart = async function (req, res)  {

    try {

        let data = req.body;
        let userId = req.params.userId

        //===================== Checking for a valid user input =====================//
        let findCart = await cartModel.findOne({ userId: userId });
        if (!findCart) return res.status(404).send({ status: false, message: `No cart found with this '${userId}' userId` });

        //===================== Checking is cart is empty or not =====================//
        if (findCart.items.length == 0) return res.status(400).send({ status: false, message: "Cart is already empty" });

        //===================== Destructuring Cart Body Data =====================//
        let { cartId, productId, removeProduct} = data;


        //===================== Checking Field =====================//
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Data is required inside request body" })

        //===================== Checking the RemoveProduct Value =====================//
        if (!isValid(removeProduct)) { return res.status(400).send({ status: false, message: "RemoveProduct is Mandatory." }) }
        if (removeProduct != 0 && removeProduct != 1) { return res.status(400).send({ status: false, message: "RemoveProduct must be 0 or 1!" }) }

        //===================== Validation for CartID =====================//
        if (cartId || typeof cartId == 'string') {
            if (!isValid(cartId)) return res.status(400).send({ status: false, message: "Enter a valid cartId" });
            if (!isValidObjectIds(cartId)) return res.status(400).send({ status: false, message: "Please Enter Valid CartId" })
            if (findCart._id.toString() !== cartId) return res.status(400).send({ status: false, message: "This is not your CartId, Please enter correct CartId." })
        }

        //===================== Validation for ProductID =====================//
        if (!isValid(productId)) return res.status(400).send({ status: false, message: "Please Enter productId" })
        if (!isValidObjectIds(productId)) return res.status(400).send({ status: false, message: "Please Enter Valid productId" })

        //===================== Fetch the Product Data From DB =====================//
        let getProduct = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!getProduct) return res.status(404).send({ status: false, message: `No product found with this productId: '${productId}'.` })

        //===================== Fetch the Cart Data From DB =====================//
        let getCart = await cartModel.findOne({ _id: findCart._id, 'items.productId': { $in: [productId] } })
        if (!getCart) return res.status(404).send({ status: false, message: `No product found in the cart with this productId: '${productId}'.` })


        //===================== Set the Total Amount =====================//
        let totalAmount = getCart.totalPrice - getProduct.price

        //===================== Store the Item Array inside arr variable =====================//
        let arr = getCart.items
        let totalItems = getCart.totalItems

        //===================== Condition for RemoveProduct value as 1 =====================//
        if (removeProduct == 1) {

            //===================== loop for arr =====================//
            for (let i = 0; i < arr.length; i++) {

                //===================== Condition for checking those two Product is matched or not =====================//
                if (arr[i].productId.toString() == productId) {
                    arr[i].quantity -= 1

                    //===================== Condition for checking the Product Quantity is 0 or not =====================//
                    if (arr[i].quantity < 1) {

                        totalItems--

                        //===================== Pull that Product from that cart and Update values =====================//
                        let update1 = await cartModel.findOneAndUpdate({ _id: findCart._id }, { $pull: { items: { productId: productId } }, totalItems: totalItems }, { new: true }).populate('items.productId')

                        //===================== Fetch item and total item and set in Variable =====================//
                        arr = update1.items
                        totalItems = update1.totalItems
                    }
                }
            }

            //===================== Update that cart =====================//
            let updatePrice = await cartModel.findOneAndUpdate({ _id: findCart._id }, { $set: { totalPrice: totalAmount, items: arr, totalItems: totalItems } }, { new: true }).populate('items.productId')

            return res.status(200).send({ status: true, message: "Success", data: updatePrice })
        }

        //===================== Condition for RemoveProduct value as 0 =====================//
        if (removeProduct == 0) {

            //===================== Fetch Total Items and Decrese 1 item =====================//
            let totalItem = getCart.totalItems - 1
     //===================== loop for arr =====================//
     for (let i = 0; i < arr.length; i++) {

        //===================== Decrese the TotalPrice  =====================//
        let prodPrice = getCart.totalPrice - (arr[i].quantity * getProduct.price)

        //===================== Condition for checking those two Product is matched or not =====================//
        if (arr[i].productId.toString() == productId) {

            //===================== Pull that Product from that cart and Update values =====================//
            let update2 = await cartModel.findOneAndUpdate({ _id: findCart._id }, { $pull: { items: { productId: productId } }, totalPrice: prodPrice, totalItems: totalItem }, { new: true }).populate('items.productId')

            return res.status(200).send({ status: true, message: "Success", data: update2 })
        }
    }
}

} catch (error) {

return res.status(500).send({ status: false, error: error.message })
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
const deleteCart = async function (req, res)  {

    try {

        let userId = req.params.userId;

        //===================== Fetch Cart Data from DB and Delete Cart =====================//
        let cartDelete = await cartModel.findOneAndUpdate({ userId: userId }, { $set: { items: [], totalPrice: 0, totalItems: 0 } }, { new: true })
        if (!cartDelete) return res.status(404).send({ status: false, message: "cart does not exist!" })

        //===================== Return Responce =====================//
        res. status(204). send({ status: true, message: "Cart deleted Successfully", data: cartDelete})

    } catch (error) {

        return res.status(500).send({ status: false, error: error.message })
    }
}
module.exports={updateCart,deleteCart,createCart,getCart}