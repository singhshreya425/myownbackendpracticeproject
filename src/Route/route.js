//create  and get and edit api
const express =require("express")
const mongoose = require("mongoose")
const router =express.Router();
const { createUser, loginUser } = require("../Controller/controller")
router.post("/register",createUser)
router.post("/login",loginUser)


module.exports =router