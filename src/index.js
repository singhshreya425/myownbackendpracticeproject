const express = require("express")
const route = require("./routes/route")
const app = express()
require("dotenv").config()
const mongoose = require("mongoose")
const multer=require("multer")
app.use(express.json())
app.use(multer().any())

app.use(express.urlencoded({ extended: true }))
mongoose.set('strictQuery', true)//Deprication error
mongoose.connect(process.env.DB,
    { useNewUrlParser: true })
    .then(() => console.log(("MongoDb is connected")))
    .catch(err => console.log(err.message))

app.use("/", route)

app.listen(process.env.PORT , function () {
    console.log("Express is running on port " + (process.env.PORT ))
})




