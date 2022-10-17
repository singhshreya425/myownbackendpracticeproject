const express = require('express');
const abc = request('../introduction/intro')
const myrouter = express.Router();

router.get('/test-me', function (req, res) {
    res.send('My Batch is ',abc.name)
    abc.printName()
    res.send('abc')
    res.send('My second ever api!')
});
router.get('/route', function (req,res){
    console.log("Route handler")
    res.send('hi')
})
router.get('/profile-details',function(req, res){
    console.log('The path params in the request are : ',req.query)
    let students =["sabiha","Akash","pritesh"]
    res.send(students)
})

router.get('/students/sabiha',function(req,res){
    res.send('The full name is sabiha')
})
router.get('/students/shreya',function(req,res){
    res.send('The full name is pritesh')
})
router.get('/students/shreya',function(req,res){
    res.send('The full name is Akash')
})
router.get('/students/:studentName')

module.exports = router;