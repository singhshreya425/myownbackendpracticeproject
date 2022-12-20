const productModel = require("../model/productModel.js")
const { validImage ,isValidStreet,isValidPrice, isValidAvailableSizes,validName,isValidObjectIds} = require("../validation/validation")
const { uploadFile } = require('../aws/aws.js')
const createProduct = async function (req, res) {
    try {

        let data= req.body
        let files = req.files

        if (Object.keys(data).length == 0)return res.status(400).send({ status: false, message: "Data is required inside request body" })
//-----------------------------------Destructuring user body data------------------------------------------------------//
        let { title, description, price,  productImage, style, availableSizes,currencyId,currencyFormat } = data

      
        if (!title) return res. status(400). send({ status: false, message: "title is required" })

        if (!isValidStreet(title)) return res. status(400). send({ status: false, message: "title is not valid" })

        if (!description) return res. status(400). send({ status: false, message: "description is required" })


        if (!isValidStreet(description)) return res. status(400). send({ status: false, message: "description is not valid" })
        if (currencyId) {
            if (currencyId != "INR")return res.status(400).send({ status: false, message: "currencyId must be INR" }) }
    
        if (currencyFormat) {
            if (currencyFormat != 'Rs')return res.status(400).send({ status: false, message: "currencyformate must be 'Rs' formate" }) }
    

        if (!price)return res. status(400).send({ status: false, message: "price is required" })

        if (!isValidPrice(price)) return res. status(400).send({ status: false, message: "price is not valid" })
     if (files) {const url = await uploadFile(files[0]) //fileupload on aws
                data.productImage = url //bucketlink stored on profileimage 
                } else {
                    return res.status(400).send({ status: true, message: "product image is mandatory" })
                }
       
        if (!style)return res.status(400).send({ status: false, message: "style is missing" })

        if (!isValidStreet(style))return res.status(400).send({ status: false, message: "style is invalid" })

        if (!availableSizes) return res. status(400). send({ status: false, message: "availableSizes is missing" })
        if (!isValidStreet(availableSizes))
            availableSizes = JSON.parse(availableSizes)
        //if (!isValidAddress((availableSizes)))return res.status(400). send({ status: false, message: "availabelSizes contains Array of String value" })

        let arr = ["S", "XS", "M", "X", "L", "XXL", "XL"]
        for (let i = 0; i < availableSizes.length; i++) {
            if (availableSizes[i] == ",")
                continue
            else {
                if (!arr.includes(availableSizes[i]))
                    return res.
                        status(400).
                        send({ status: false, message: `availableSizes can contain only these value [${arr}]` })
            }
        }


        let checktitle = await productModel.findOne({ title: title })
        if (checktitle != null)return res.status(400). send({ status: false, message: "this title is already present" })
        let result = await productModel.create(data)
        res.status(201).send({ status: true, message: "Success", data: result })
    } catch (error) { res.status(500).send({ status: false, message: error.message })
    }
}

const filterProduct=async function (req, res){
    try{
         let obj  = req.query
         let filter = {isDeleted : false}
         let { size, name, priceLessThan, priceGreaterThan, priceSort} = obj
         
         if (Object.keys(obj).length === 0 ) {
            return res.status(400).send({ status: false, message: "Please give some parameters." })
       }

       if(Object.keys(obj).length != 0){

        if (size) {
            if(!isValidAvailableSizes (size)){
                return res.status(400).send({ status : false, message : "Size is not valid"})
            }
            filter['availableSizes'] = {$in : size}
    }

    if(name){
        filter['title'] = {$regex : name}
    }

    if(priceLessThan){
        if(!isValidPrice(priceLessThan)){
            return res.status(400).send({ status : false, message : "Price is not valid"})
        }
        filter['price'] = {$lt : priceLessThan}
    }

    if(priceGreaterThan){
        if(!isValidPrice(priceGreaterThan)){
            return res.status(400).send({ status : false, message : "Not a valid Price"})
        }
        filter['price'] = {$gt : priceGreaterThan}
    }

    if(priceSort){
        if(!(priceSort == 1 || priceSort == -1)){
            return res.status(400).send({ status : false, message : "Price can be sorted with the value 1 or -1 only"})
        }
    }
}

    let productDetails = await productModel.find(filter).sort({ price: priceSort })
    if(productDetails.length === 0){
        return res.status(404).send({ status : false, message : "no data found"})
    }
    return res.status(200).send({ status: true, message: 'Success', data: productDetails })


    }catch(error){
        return res.status(500).send({ error : error.message })
    }
}
const productsById = async function (req, res) {
    try {

        let product = req.params.productId

        if (!isValidObjectIds(product)) {
            return res.status(400).send({ status: false, message: "This productId is not valid" })
        }

        const productCheck = await productModel.findById({ _id: product })
        if (!productCheck) {
            return res.status(404).send({ status: false, message: "This product is not found" })
        }

        if (productCheck.isDeleted == true) {
            return res.status(404).send({ status: false, message: "This product has been deleted" })
        }

        let getProducts = await productModel.findOne({ _id: product, isDeleted: false }).select({ deletedAt: 0 })
        return res.status(200).send({ status: true, message: "Success", data: getProducts })


    } catch (error) {
        res.status(500).send({ status: "false", message: error.message })
    }
}

module.exports={createProduct,filterProduct,productsById}