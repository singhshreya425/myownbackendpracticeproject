const orderModel =require("../model/orderModel")
const cartModel =require("..model/cartModel")
const { isValidObjectIds,isValid} = require("../validation/validation")
const createOrder = async function(req,res){
    try{
        let userId =req.params.userId
        let data=req.body
         let{cartId,cancellable} =data
         //------------------------------create a empty object-------------------------------------------------//
         let obj={}
         if(object.keys(data).length==0) return res.status(400).send({status:false,message:"body can't be empty"})
         if(isValidObjectIds(cartId)) return res.status(400).send({status:false,message:"cart id is not valid"})
         let cartExist =await cartModel.find(cartId)
         if(!cartExist) return res.status(404).send({status:false,message:"cartId not found"})
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


module.exports={createOrder}