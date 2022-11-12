let axios = require("axios")

const weatherbycity = async function (_req, res) {
    const cities = ["Bengaluru", "Mumbai", "Delhi", "Kolkata", "Chennai", "London", "Moscow"]
    const weatherbycity = []
    for (let index = 0; index < cities; index++) {
        const city = array[index];
        const options = {
            method: 'get',
            url: `http://api.openweathermap.org/data/2.5/weather?q=${London}&appid=236134cb51f7eb2b131b5147f2ab2f26`     //city name and api key
        }
        const result = await axios(options)
        weatherbycity.push(result.data)
    }
    res.status(200).send({ data: result.data })
}
let getStates = async function (req, res) {

    try {
        let options = {
            method: 'get',
            url: `https://cdn-api.co-vin.in/api/v2/admin/location/states`
        }
        let result = await axios(options);
        console.log(result)
        let data = result.data
        res.status(200).send({ msg: data, status: true })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}


let getDistricts = async function (req, res) {
    try {
        let id = req.params.stateId
        let options = {
            method: "get",
            url: `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${id}`//url with path params so here we are giving id according to id we are finding states
        }
        let result = await axios(options);
        console.log(result)
        let data = result.data
        res.status(200).send({ msg: data, status: true })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}

let getByPin = async function (req, res) {
    try {
        let pin = req.query.pincode
        let date = req.query.date
        // console.log(`query params are: ${pin} ${date}`)
        var options = {
            method: "get",
            url: `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pin}&date=${date}`//url with query params
        }
        let result = await axios(options)
        console.log(result.data)
        res.status(200).send({ msg: result.data })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}

let getOtp = async function (req, res) {
    try {
        let blahhh = req.body

        console.log(`body is : ${blahhh} `)
        var options = {
            method: "post",
            url: `https://cdn-api.co-vin.in/api/v2/auth/public/generateOTP`,//here we are giving mob no. in data
            data: blahhh
        }

        let result = await axios(options)
        console.log(result.data)
        res.status(200).send({ msg: result.data })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}

let getDistrictSessions = async function (req, res){
    try {
        let district = req.query.districtId
        let date = req.query.date
        let options ={
            method:'get',
            url:`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${district}&date=${date}`
        }
        let result = await axios(options)
        console.log(result.data)
        res.status(200).send({msg: result.data})
    } catch (error) {
        console.log(result.data)
        res.status(500).send({msg:result.data})
        
    }
}


module.exports.getStates = getStates
module.exports.getDistricts = getDistricts
module.exports.getByPin = getByPin
module.exports.getOtp = getOtp
module.exports.weatherbycity = weatherbycity
module.exports.getDistrictSessions=getDistrictSessions