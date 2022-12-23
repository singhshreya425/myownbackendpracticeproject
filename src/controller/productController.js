const productModel = require("../model/productModel.js")
const { validImage, isValidStreet, isValidPrice, isValidAvailableSizes, validName, isValidObjectIds, isValid } = require("../validation/validation")
const { uploadFile } = require('../aws/aws.js')
const createProduct = async function (req, res) {
    try {

        let data = req.body
        let files = req.files

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Data is required inside request body" })
        //-----------------------------------Destructuring user body data------------------------------------------------------//
        let { title, description, price, productImage, style, availableSizes, currencyId, currencyFormat } = data


        if (!title) return res.status(400).send({ status: false, message: "title is required" })

        if (!isValidStreet(title)) return res.status(400).send({ status: false, message: "title is not valid" })

        if (!description) return res.status(400).send({ status: false, message: "description is required" })


        if (!isValidStreet(description)) return res.status(400).send({ status: false, message: "description is not valid" })
        if (currencyId) {
            if (currencyId != "INR") return res.status(400).send({ status: false, message: "currencyId must be INR" })
        }

        if (currencyFormat) {
            if (currencyFormat != 'Rs') return res.status(400).send({ status: false, message: "currencyformate must be 'Rs' formate" })
        }


        if (!price) return res.status(400).send({ status: false, message: "price is required" })

        if (!isValidPrice(price)) return res.status(400).send({ status: false, message: "price is not valid" })

        if (files && files.length > 0) {

            const url = await uploadFile(files[0]) //fileupload on aws
            data.productImage = url //bucketlink stored on profileimage 
        } else {
            return res.status(400).send({ status: true, message: "product image is mandatory" })
        }


        if (!style) return res.status(400).send({ status: false, message: "style is missing" })

        if (!isValidStreet(style)) return res.status(400).send({ status: false, message: "style is invalid" })

        if (!availableSizes) return res.status(400).send({ status: false, message: "availableSizes is missing" })
        if (!isValidStreet(availableSizes)) availableSizes = availableSizes.split(",").map((a) => a.trim())

        //if (!isValidAddress((availableSizes)))return res.status(400). send({ status: false, message: "availabelSizes contains Array of String value" })

        let validSize = (value) => { return ["S", "XS", "M", "X", "L", "XXL", "XL"].indexOf(value) !== -1 }

        for (let i = 0; i < availableSizes.length; i++) {
            if (!validSize(availableSizes[i])) {
                return res.status(400).send({ status: false, message: `availableSizes can contain only these value` })
            } else {
                data.availableSizes = availableSizes
            }
        }
        // if (availableSizes[i] == ",")
        //     continue
        // else {
        //   if (!arr.includes(availableSizes[i]))

        let checktitle = await productModel.findOne({ title: title })
        if (checktitle != null) return res.status(400).send({ status: false, message: "this title is already present" })
        let result = await productModel.create(data)
        res.status(201).send({ status: true, message: "Success", data: result })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

const filterProduct = async function (req, res) {
    try {
        let obj = req.query
        let filter = { isDeleted: false }
        let { size, name, priceLessThan, priceGreaterThan, priceSort } = obj

        if (Object.keys(obj).length === 0) {
            return res.status(400).send({ status: false, message: "Please give some parameters." })
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

const updateProducts = async function (req, res) {
    try {
        //-------------------------------------validation for projectID ---------------------------------------------//
        let productId = req.params.productId

        let data = req.body
        let files = req.files

        if (!isValidObjectIds(productId)) { return res.status(400).send({ status: false, message: "this productId is not valid" }) }
        const existingProduct = await productModel.findById({ _id: productId })
        if (!existingProduct) { return res.status(404).send({ status: false, message: "this product is not found" }) }
        if (existingProduct.isDeleted == true) {
            return res.status(404).send({ status: false, message: "This product is not found" })
        }
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "data can't be empty" })

        if (data.title) {
            if (!isValid(data.title)) { return res.status(400).send({ status: false, message: "title is not valid" }) }
        }
        const titleCheck = await productModel.findOne({ title: data.title })
        if (titleCheck) { return res.status(400).send({ status: false, message: "this title is already existng" }) }
        if (data.price) {
            if (!isValidPrice(data.price)) {
                return res.status(400).send({ status: false, message: "Price is not in correct format" })
            }
        }
        //--------------------------------------upload file-------------------------------------------------------//
        //-------------------------------create s3 link--------------------------------------------------------//
        if (files && files.length > 0) {
            const url = await uploadFile(files[0]) //fileupload on aws
            data.productImage = url //bucketlink stored on profileimage 
        }
        if (data.isFreeShipping) {
            if (!(data.isFreeShipping == "true" || data.isFreeShipping == "false")) {
                return res.status(400).send({ status: false, message: "Please enter a boolean value for isFreeShipping" })
            }
        }
        if (data.style) {
            if (!isValidStreet(data.style)) return res.status(400).send({ status: false, message: "style is invalid" })

            if (!isValid(data.style)) {
                return res.status(400).send({ status: false, message: "style is not correct format" })
            }

        }

        if (data.availableSizes) {
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
        }

        const updateProduct = await productModel.findByIdAndUpdate({ _id: productId }, data, { new: true })
        return res.status(200).send({ status: true, message: "Product updated successfully", data: updateProduct })


    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}
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