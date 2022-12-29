const productModel = require("../model/productModel.js")
const { isValidInstallment, isValidPrice, isValidAvailableSizes, validName, isValidObjectIds, isValid,isValidProdName, validImage } = require("../validation/validation")
const { uploadFile } = require('../aws/aws.js')
//<<<===================== This function is used for Create Product Data =====================>>>//
const createProduct = async (req, res) => {

    try {

        let data = req.body
        let files = req.files


        //===================== Destructuring User Body Data =====================//
        let { title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments, productImage } = data

        //===================== Checking Mandotory Field =====================//
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "No data found from body! You need to put the Mandatory Fields (i.e. title, description, price, currencyId, currencyFormat, productImage). " });


        //===================== Create a Object of Product =====================//
        let obj = {}

        //===================== Validation of title =====================//
        if (!isValid(title)) { return res.status(400).send({ status: false, message: "Please enter title!" }) }
        if (!isValidProdName(title)) { return res.status(400).send({ status: false, message: "Please mention valid title In Body!" }) }
        obj.title = title

        //===================== Validation of Description =====================//
        if (!isValid(description)) return res.status(400).send({ status: false, message: "Please enter description!" });
        obj.description = description

        //===================== Validation of Price =====================//
        if (!isValid(price)) return res.status(400).send({ status: false, message: "Please enter price!" });
        if (!isValidPrice(price)) return res.status(400).send({ status: false, message: "Please valid valid price In Body!" });
        obj.price = price

        //===================== Validation of CurrencyId =====================//
        if (currencyId || currencyId == '') {
            if (!validator.isValidBody(currencyId)) return res.status(400).send({ status: false, message: "Please enter CurrencyId!" });
            if (currencyId != 'INR') return res.status(400).send({ status: false, message: "CurrencyId must be 'INR'!" });
            obj.currencyId = currencyId
        }

        //===================== Validation of CurrencyFormat =====================//
        if (currencyFormat || currencyFormat == '') {
            if (!isValid(currencyFormat)) return res.status(400).send({ status: false, message: "Please enter currencyFormat!" });
            if (currencyFormat != '₹') return res.status(400).send({ status: false, message: "Currency Format must be '₹'!" });
            obj.currencyFormat = currencyFormat
        }

        //===================== Validation of isFreeShipping =====================//
        if (isFreeShipping) {
            if (!isValid(isFreeShipping)) return res.status(400).send({ status: false, message: "Please enter value of Free Shipping!" });
            if (isFreeShipping !== 'true' && isFreeShipping !== 'false') return res.status(400).send({ status: false, message: "Please valid value of Free shipping!" });
            obj.isFreeShipping = isFreeShipping
        }


        //===================== Validation of Style =====================//
        if (style) {
            if (!isValid(style)) return res.status(400).send({ status: false, message: "Please enter style!" });
            if (!validName(style)) return res.status(400).send({ status: false, message: "Please valid style!" });
            obj.style = style
        }

        //===================== Validation of AvailableSizes =====================//
        if (!isValid(availableSizes)) return res.status(400).send({ status: false, message: "Please enter Size!" });
        availableSizes = availableSizes.split(',').map((item) => item.trim())
        for (let i = 0; i < availableSizes.length; i++) {
            if (!isValidAvailableSizes(availableSizes[i])) return res.status(400).send({ status: false, message: "Please mention valid Size!" });
        }
        obj.availableSizes = availableSizes


        //===================== Validation of Installments =====================//
        if (installments || installments == '') {
            if (!isValid(installments)) return res.status(400).send({ status: false, message: "Please enter installments!" });
            if (! isValidInstallment(installments)) return res.status(400).send({ status: false, message: "Provide valid Installments number!" });
            obj.installments = installments
        }


        //===================== Fetching Title of Product from DB and Checking Duplicate Title is Present or Not =====================//
        const isDuplicateTitle = await productModel.findOne({ title: title });
        if (isDuplicateTitle) {
            return res.status(400).send({ status: false, message: "Title is Already Exists, Please Enter Another Title!" });
        }


        //===================== Checking the ProductImage is present or not and Validate the ProductImage =====================//
        if (files && files.length > 0) {
            if (files.length > 1) return res.status(400).send({ status: false, message: "You can't enter more than one file for Create!" })
            if (!validImage(files[0]['originalname'])) { return res.status(400).send({ status: false, message: "You have to put only Image." }) }
            let uploadedFileURL = await uploadFile(files[0])
            obj.productImage = uploadedFileURL
        } else {
            return res.status(400).send({ message: "Product Image is Mandatory! Please input image of the Product." })
        }


        //x===================== Final Creation of Product =====================x//
        let createProduct = await productModel.create(obj)

        return res.status(201).send({ status: true, message: "Success", data: createProduct })

    } catch (error) {

        return res.status(500).send({ status: false, error: error.message })
    }
}
//<<<===================== This function is used for Get Data of Products =====================>>>//
const filterProduct = async function (req, res) {
    try {
        let obj = req.query
        let filter = { isDeleted: false }
        let { size, name, priceLessThan, priceGreaterThan, priceSort } = obj

        if(!obj){
        if (Object.keys(obj).length === 0) {
            return res.status(400).send({ status: false, message: "Please give some parameters." })
        }
    }
        if (Object.keys(obj).length != 0) {

            if (size) {
                if (!isValidAvailableSizes(size)) {
                    return res.status(400).send({ status: false, message: "Size is not valid" })
                }
                filter['availableSizes'] = { $in: size }    //it is used to select those document where the value  of the field is equal to any of the given value in the array
            }

            if (name) {
                filter['title'] = { $regex: name }  //pattern matching string in queries
            }

            if (priceLessThan) {
                if (!isValidPrice(priceLessThan)) {
                    return res.status(400).send({ status: false, message: "Price is not valid" })
                }
                filter['price'] = { $lt: priceLessThan }
            }

            if (priceGreaterThan) {
                if (!isValidPrice(priceGreaterThan)) {
                    return res.status(400).send({ status: false, message: "Not a valid Price" })
                }
                filter['price'] = { $gt: priceGreaterThan }
            }

            if (priceSort) {
                if (!(priceSort == 1 || priceSort == -1)) {
                    return res.status(400).send({ status: false, message: "Price can be sorted with the value 1 or -1 only" })
                }
            }
        }

        let productDetails = await productModel.find(filter).sort({ price: priceSort })
        if (productDetails.length === 0) {
            return res.status(404).send({ status: false, message: "no data found" })
        }
        return res.status(200).send({ status: true, message: 'Success', data: productDetails })


    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}
//<<<===================== This function is used for Get Data of Products By Path Param =====================>>>//
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
//<<<===================== This function is used for Update Products Data By Path Param =====================>>>//

const updateProducts = async function (req, res)  {

    try {

        let data = req.body

        let files = req.files

        let productId = req.params.productId
        //===================== Destructuring User Body Data ===========================================//

        let { title, description, price, isFreeShipping, style, availableSizes, installments, productImage } = data

        //===================== Checking the ProductId is Valid or Not by Mongoose =====================//

        if (!isValidObjectIds(productId)) return res.status(400).send({ status: false, message: `Please Enter Valid ProductId: ${productId}` })

        //===================== Checking Body ==========================================================//

        if (  (Object.keys(data).length == 0) && !(files)) return res.status(400).send({ status: false, message: "You have to put atleast one key to update Product (i.e. title, description, price, isFreeShipping, style, availableSizes, installments, productImage). " });

             //===================== Create a Object of Product ===============================================//
        let obj = {}

        //===================== Validation of title ======================================================//

        if (title || title == '') {

            if (!isValid(title)) { return res.status(400).send({ status: false, message: "Please enter title!" }) }

            if (!isValidProdName(title)) { return res.status(400).send({ status: false, message: "Please mention valid title In Body!" }) }

            //===================== Fetching Title of Product from DB and Checking Duplicate Title is Present or Not =====================//
            let isDuplicateTitle = await productModel.findOne({ title: title });

            if (isDuplicateTitle) {

                return res.status(400).send({ status: false, message: "Title is Already Exists, Please Enter Another One Title!" });
            }

            obj.title = title
        }

        //===================== Validation of Description =======================================//

        if (description || description == '') {
            if (!isValid(description)) return res.status(400).send({ status: false, message: "Please enter description!" });

            obj.description = description
        }

        //===================== Validation of Price =============================================//
        if (price || price == '') {

            if (! isValid(price)) return res.status(400).send({ status: false, message: "Please enter price!" });

            if (!isValidPrice(price)) return res.status(400).send({ status: false, message: "Please valid valid price In Body!" });
            obj.price = price
        }

        //===================== Validation of isFreeShipping =====================//
        if (isFreeShipping || isFreeShipping == '') {

            if (isFreeShipping !== 'true' && isFreeShipping !== 'false') return res.status(400).send({ status: false, message: "Please valid value of Free shipping!" });
            obj.isFreeShipping = isFreeShipping
        }

        //===================== Checking the ProductImage is present or not and Validate the ProductImage =====================//
        if (productImage == '') return res.status(400).send({ status: false, message: "You have to put image while choosing productImage" })
        if (files && files.length > 0) {

            if (files.length > 1) return res.status(400).send({ status: false, message: "You can't enter more than one file for Create!" })
            if (!validImage(files[0]['originalname'])) { return res.status(400).send({ status: false, message: "You have to put only Image." }) }
            let uploadedFileURL = await uploadFile(files[0])
            obj.productImage = uploadedFileURL
        }

        //===================== Validation of Style =====================//
        if (style || style == '') {
            if (! isValid(style)) return res.status(400).send({ status: false, message: "Please enter style!" });
            if (!validName(style)) return res.status(400).send({ status: false, message: "Please valid style!" });
            obj.style = style
        }

        //===================== Validation of AvailableSizes =====================//
        if (availableSizes || availableSizes == '') {
            if (! isValid(availableSizes)) return res.status(400).send({ status: false, message: "Please enter Size!" });
            availableSizes = availableSizes.split(',').map((item) => item.trim())
            for (let i = 0; i < availableSizes.length; i++) {
                if (!isValidAvailableSizes(availableSizes[i])) return res.status(400).send({ status: false, message: "Please mention valid Size!" });
            }
            obj.availableSizes = availableSizes
        }
 //===================== Validation of Installments =====================//
 if (installments || installments == '') {
    if (! isValid(installments)) return res.status(400).send({ status: false, message: "Please enter installments!" });
    if (!isValidInstallment(installments)) return res.status(400).send({ status: false, message: "Provide valid Installments number!" });
    obj.installments = installments
}


//x===================== Fetching All Product Data from Product DB then Update the values =====================x//
let updateProduct = await productModel.findOneAndUpdate({ isDeleted: false, _id: productId }, { $set: obj }, { new: true })

//x===================== Checking the Product is Present or Not =====================x//
if (!updateProduct) { return res.status(404).send({ status: false, message: "Product is not found or Already Deleted!" }); }

return res.status(200).send({ status: true, message: "Success", data: updateProduct })

} catch (error) {

return res.status(500).send({ status: false, message: error.message })
}
}

//<<<===================== This function is used for Delete Product Data By Path Param =====================>>>//
const deleteProductById = async function (req, res) {
    try {
        let productId = req.params.productId
        if (!productId) { return res.status(400).send({ status: false, message: "please give productId in requesst params" }) }
        if (!isValidObjectIds(productId)) { return res.status(400).send({ status: false, message: "please enter productId in valid format" }) }
        let findData = await productModel.findOneAndUpdate({ _id: productId, isDeleted: false }, { isDeleted: true, deletedAt: Date.now() })
        if (!findData) { return res.status(200).send({ status: true, message: `product not found by this [${productId}] productId` }) }
        return res.status(200).send({ status: false, message: "data deleted successfully", data: findData })

    } catch (error) { res.status(500).send({ status: false, message: error.message }) }
}
module.exports = { createProduct, filterProduct, productsById, updateProducts, deleteProductById }