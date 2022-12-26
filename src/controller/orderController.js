const orderModel =require("../model/orderModel")
const cartModel =require("../model/cartModel")
const { isValidObjectIds,isValid,isValidStatus} = require("../validation/validation")
const createOrder = async function(req,res){
    try{
        let userId =req.params.userId
        let data=req.body
         let{cartId,cancellable} =data
         //------------------------------create a empty object-------------------------------------------------//
         let obj={}
         if(Object.keys(data).length==0) return res.status(400).send({status:false,message:"body can't be empty"})
         if(!isValid(cartId)) return res.status(400).send({status:false,message:"please enter a cartID"})       
         if(!isValidObjectIds(cartId)) return res.status(400).send({status:false,message:"cart id is not valid"})
         //------------------------------condition for checking cancellable is true or false-----------------------//
         if(cancellable || cancellable ==''){
            if(!isValid) return res.status(400).send({status:false,message:"Please a enter valid cancellable"})
            if(cancellable!=true && cancellable!= false){
                return res.status(400).send({status:false,message:"cancellable value in Boolean value(i.e:true or false)"})
                
            }
            obj.cancellable=cancellable
        }
         
            let findCart =await cartModel.findOne({userId:userId,_id:cartId})
            if(!findCart) return res.status(400).send({status:false,message:"This cart is empty"})
        //-------------------------------------push the key value pair in empty Object----------------------------//
        obj.userId=findCart.userId
        obj.items= findCart.items
        obj.totalPrice =findCart.totalPrice
        obj.totalItems = findCart.totalItems
        //-----------------------------------------set value of quantity is 0---------------------------------//
        let quantity =0
        //----------------------------------------for loop to access total quantity of every product-----------//
        for(let i=0;i<findCart.items.length;i++){
            quantity =quantity+findCart.items[i].quantity
        }    
        obj.totalQuantity=quantity
        //----------------------------final order created--------------------------------------------//
        let orderCreate=await orderModel.create(obj)
        //-----------------------------update or delete that cartData in db--------------------------//
        cartModel.findOneAndUpdate({_id:cartId},{items:[],totalItems:0,totalPrice:0})
        //---------------------------return response for successful order creattion-------------------//
        return res.status(201).send({status:true,message:"Success",data:orderCreate})
 
    }
    catch(error){
 return res.status(500).send({status:false,message:error.message})
    }
}

//==========================================function for created========================================================//
const updateOrder = async function(req,res){
    try{
        let userId =req.params.userId
        let data =req.body
        let{orderId,status} =data
        if(Object.keys(data).length==0) return res.status(400).send({status:false,message:"body can't be empty"})
        if(!isValid(orderId)) return res.status(400).send({status:false,message:"please enter a orderID"})       
        if(!isValidObjectIds(orderId)) return res.status(400).send({status:false,message:"order id is not valid"})
        //--------------------------validtion for status with enum values---------------------------------------//
       if(!isValidStatus(status)) return res.status(400).send({status:false,message:"plaese enter existing status(i.e 'pending','completed',cancled')"})
       //------------------------------fetch the order data from db----------------------------------------------//   
       let checkStatus =await orderModel.findOne({_id:orderId,userId: userId})
       if(!checkStatus){return res.status(404).send({status:false,messsage:"order doesn't exist with your userId"})}
        //---------------------------fetch the order data from data and checking the status value-----------------//
 
       if(checkStatus.status=='completed') {
        return res.status(200).send({status:true,message:"your order have been placed"})
       }
       if(checkStatus.status=='cancelled'){return res.status(200).send({status:true,message:"your order already cancelled"})}
       //----------------------------------fetch the order and checking the cancellable value----------------------//
       if(checkStatus.cancellable==false && status == 'cancelled'){
        return res.status(200).send({status:true,message:"Your order can't be cancel!"})
       }
       //-------------------------------fetch the cart data from db----------------------------------------------//
       let cartDetails = await cartModel.findOne({userId:userId})
       if(!cartDetails){return res.status(404).send({status:false,message:"cart doesn't exist!!"})}
       //-----------------------------final orderUpdation-----------------------------------------------------//
        let orderUpdate = await orderModel.findByIdAndUpdate({_id:orderId,userId:userId},{status:status},{new:true})
        return res.status(200).send({status:true,message:"Success",data:orderUpdate})
    }
    catch(error){
        return res.status(500).send({status:false,message:error.message})

    }
}
module.exports={createOrder,updateOrder}