const express = require( 'express' );
const router=express.Router()
const axios = require('axios')
const { getCryptocurrency }  = require('../Controller/cryptocurrencyController.js')

router.get('/get100Cryptocurrency',getCryptocurrency);


module.exports=router;

