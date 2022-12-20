const productModel = require("../model/productModel.js")
const { validImage ,isValidStreet,isValidPrice,} = require("../validation/validation")
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
                    return res.status(400).send({ status: true, message: "profile is mandatory" })
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
        if (checktitle != null)return res.status(409). send({ status: false, message: "this title is already present" })
        let result = await productModel.create(data)
        res.status(201).send({ status: true, message: "Success", data: result })
    } catch (error) { res.status(500).send({ status: false, message: error.message })
    }
}
module.exports={createProduct}