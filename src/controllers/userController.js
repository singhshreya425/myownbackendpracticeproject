const UserModel = require("../models/userModel")
let axios = require("axios")

const basicCode = async function (req, res) {
    let tokenDataInHeaders = req.headers.token
    console.log(tokenDataInHeaders)

    console.log("HEADER DATA ABOVE")
    console.log("hey man, congrats you have reached the Handler")
    res.send({ msg: "This is coming from controller (handler)" })
}

const createUser = async function (req, res) {
    let data = req.body
    let savedData = await UserModel.create(data)
    res.send({ msg: savedData })
}

const getUsersData = async function (req, res) {
    let allUsers = await UserModel.find()
    res.send({ msg: allUsers })
}

// Create API's to do each of the following:
//                     - get weather of London from http://api.openweathermap.org/data/2.5/weather?q=London&appid=<useYourOwnAppId>  (NOTE: must use HTTP infront of the url else axios will attempt to hit localhost and give error  ..also use HTTP only and not HTTPS)
//                     - then change the above to get the temperature only( of London)
//                     - Sort the cities  ["Bengaluru","Mumbai", "Delhi", "Kolkata", "Chennai", "London", "Moscow"] in order of their increasing temperature
//                     result should look something like this
//                     [
//                     {city:"London", temp: 280},
//                     {city:"Moscow", temp: 290},
//                     {city:"Bangalore", temp: 301.2},
//                     .......
//                     ]
//                     The result looks like an array of object-> here ans has object and object contains two keys  
//                      one is city and the other one is temp the array above is sorted based upon temp
let getSortedCities = async function (_req, res) {
   
    try {
        let cities =["Bengaluru","Mumbai", "Delhi", "Kolkata", "Chennai", "London", "Moscow"] 
        let cityObjArray=[]
        //better to use for..of here
        for(i=0; i<cities.length; i++){
            let obj = {city: cities[i]}//{city:"Bengaluru"}
            let resp= await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${cities[i]}&appid=236134cb51f7eb2b131b5147f2ab2f26`)
            console.log(resp.data.main.temp)

            obj.temp = resp.data.main.temp//{city:"Bengaluru", temp:301.2}
            cityObjArray.push(obj)
        }
        // cityObjArray = [{city:"Bengaluru",temp:301.2},{city:"Mumbai",temp:304.2},{city:"Delhi",temp:320.2}....]
        //one key inside each array
        //sort an array of object based on numeric property
        //myarray.sort([a, b] => a.age-b.age);
        let sorted = cityObjArray.sort(function(a, b){return a.temp-b.temp})
        //can pass cityObjArray also here as sort method does sorting on the same array (in place) and original array is replaced by the sorted one
        //either ways both(sorted and cityObjArray) are referring to same array..assignment by reference is the default assignment in an array 
        //if  u are soting a then b also gets automatically change and viceversa
        console.log(sorted)
        res.status(200).send({status: true, data: sorted})//can pass cityObjArray also here as sort method does sorting on the same array
        //(in place )and original array is represented by the sorted onezoo
    } catch (error) {
        console.log(error)
        res.status(500).send({status:false, msg:"server error"})
    }
}

let memeHandler = async function (req, res) {
    try {
        let options = {
            method: "post",
            url: `https://api.imgflip.com/caption_image?template_id=181913649&text0=Functionup&text1=Yes&username=chewie12345&password=meme@123`
            // url:`https://api.imgflip.com/caption_image?template_id=${memeId}&text0=${text0}&text1=${text1}&username=chewie12345&password=meme@123`
        }
        let result = await axios(options)
        res.send({ data: result.data })

    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, msg: "server error" })

    }
}
//https://api.imgflip.com/get_memes-to get memes id,name,url

module.exports.createUser = createUser
module.exports.getUsersData = getUsersData
module.exports.basicCode = basicCode
module.exports.memeHandler = memeHandler
module.exports.getSortedCities = getSortedCities