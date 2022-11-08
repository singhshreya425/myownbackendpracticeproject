const express = require('express');
const router = express.Router();
const jwt =require('jsonwebtoken');
const mongoose = require('mongoose');
const usercontroller = require('../controllers/usercontroller');
const authmiddleware = require('../middleware/authmiddleware');

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post('/users',usercontroller.createUser);
router.post('/login',usercontroller.login);
router.get('/users/:userId',authmiddleware.authenticate, usercontroller.getDetails);
router.put('/users/:userId',authmiddleware.authenticate, usercontroller.updateUser);
// router.put('/users/:userId',midd.authorise,usercontroller.updateUser);
// router.get("/cowin/states",cowincontroller.getstates)
// router.get("/cowin/districtinstates/:stateId",cowincontroller.getdistricts)//by giving path params by giving stateid
// router.get("/cowin/getbypin", cowincontroller.getbypin)
// router.post("/cowin/getotp", cowincontroller.getotp)

//inside cowincontroller.js file
// let axios = require("axios")
// let getstates = async function(req, res){

//     let options  = {method:'get',url:'url'}
//     let result = await axios (options);
     
//     console.log(result)
//     let data = result.data
//     res.status(200).send({msg:data,status:true})
// }
// let getdistricts = async function (req, res){
//     let id  = req.params.stateId
//     let result  = await axios.get('url/${id}');
//     let options={
//         method:'get',url:'url'
//     }
//     console.log=(result)
//     let data = result.data
//     res.status(200).send({msg:data,status:true})
// }
// let getbypin = async function (req, res ){
//     let pin = req.query.pincode
//     let date = req.query.date
//     console.log(`query params are: ${pin} ${date}`)
//     var options={
//         method: "get",
//         url: `url=${pin}&date=${date}`
//     }
//     let result = await axios (options)
//     console.log (result.data)
//     res.status(200).send({msg:result.data})
// }
// let getotp = async function (req, res ){
//     let blahh = req.body
    
//     console.log(`body is: ${blahh} `)
//     var options={
//         method: "post",
//         url: `url`,
//         data: blahh
//     }
//     let result = await axios (options)
//     console.log (result.data)
//     res.status(200).send({msg:result.data})
// }
//add try catch for above code as per convienient
// write a get api to get the  list of all the "vaccination session by " 

// module.exports.getstates=getstates;
// module.exports.getdistricts=getdistricts;
// module.exports.getotp=getotp;
// module.exports.getbypin=getbypin;

module.exports = router;