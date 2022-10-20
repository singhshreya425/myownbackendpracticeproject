const express = require('express');
const abc = require('../introduction/intro')
const router = express.Router();

router.get('/test-me', function (req, res) {
    console.log('My batch is', abc.name)
    let one = req.query
    console.log(one)
    abc.printName()
    res.send('My second ever api!')
});

router.get('/students', function (req, res) {
    console.log("The path params in the request are : ", req.params)
    let students = ['Sabiha', 'Neha', 'Akash']
    res.send(students)
})
router.get("/shoes", function (req, res) {
    let queryParams = req.query
    let brand = queryParams.brand
    let discount = queryParams.discount
    let color = queryParams.color
    console.log('The brand selected is ', brand)
    console.log('The discount option selected ', discount)
    console.log('The color selected is ', color)
    res.send("dummy response")
})


// Example 1 for path params
router.get('/students/:studentName', function (req, res) {
    // ':' denotes that the following part of route is a variable
    // The value of this variable is what we are sending in the request url after /students
    // This value is set in the form of an object inside req.params
    // The object contain key value pairs
    // key is the variable in the route
    // value is whatever dynamic value sent in the request url
    let myParams = req.params

    // params attribute is fixed in a request object
    // params contains the path parameters object
    console.log("The path params in the request are : ", myParams)
    res.send('The full name is ' + myParams.studentName)
})

// Example 2 for path params
router.get('/student-details/:name', function (req, res) {
    let requestParams = req.params
    console.log("This is the request ", requestParams)
    let studentName = requestParams.name
    console.log('Name of the student is ', studentName)
    res.send('Dummy response')
})
// Branch for this assignment is assignment/get-api

// Create an API for GET /movies that returns a list of movies. Define an array of movies in your code and return the value in response.
router.get('/movies', function (req, res) {
    console.log("The path params in the request are : ", req.params)
    let movies = ['Rang de basanti', 'The shining', 'Lord of the rings', 'Batman begins']

    res.send(movies)
})

// Create an API GET /movies/:indexNumber (For example GET /movies/1 is a valid request and it should return the movie in your array at index 1). You can define an array of movies again in your api
// [‘Rang de basanti’, ‘The shining’, ‘Lord of the rings’, ‘Batman begins’]
// /movies/2

router.get('/movies/:index', function (req, res) {
    console.log("The path params in the request are : ", req.params)
    let movies = ['Rang de basanti', 'The shining', 'Lord of the rings', 'Batman begins']
    let index = req.params.index

    res.send(movies[index])
})


// Handle a scenario in problem 2 where if the index is greater than the valid maximum value a message is returned that tells the user to use a valid index in an error message.
router.get('/movie/:index', function (req, res) {
    console.log("The path params in the request are : ", req.params)
    let movies = ['Rang de basanti', 'The shining', 'Lord of the rings', 'Batman begins']
    let index = req.params.index
    if (index < movies.length)
        return res.send(movies[index])
    else
        return res.send(" use a valid index")
})
// Write another api called GET /films. Instead of an array of strings define an array of movie objects this time. Each movie object should have values - id, name. An example of movies array is 
// [ {
//  “id”: 1,
//  “name”: “The Shining”
// }, {
//  “id”: 2,
//  “name”: “Incendies”
// }, {
//  “id”: 3,
//  “name”: “Rang de Basanti”
// }, {
//  “id”: 4,
//  “name”: “Finding Nemo”
// }]

// Return the entire array in this api’s response
router.get('/films', function (req, res) {
    let movies = [{
        id: 1,
        name: "The Shining"
    }, {
        id: 2,
        name: "Incendies"
    }, {
        id: 3,
        name: "Rang de Basanti"
    }, {
        id: 4,
        name: "Finding Nemo"
    }]

    res.send(movies)
})

// Write api GET /films/:filmId where filmId is the value received in request path params. Use this value to return a movie object with this id. In case there is no such movie present in the array, return a suitable message in the response body. Example for a request GET /films/3 should return the movie object 
// {
//  “id”: 3,
//  “name”: “Rang de Basanti”
// }
// Similarly for a request GET /films/9 the response can be something like - ‘No movie exists with this id’
router.get('/films/:filmid', function (req, res) {
    let arr = [{
        id: 1,
        name: "The Shining"
    }, {
        id: 2,
        name: "Incendies"
    }, {
        id: 3,
        name: "Rang de Basanti"
    }, {
        id: 4,
        name: "Finding Nemo"
    }];
    let count = 0
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].id == Number(req.params.filmid)) {
            count++
            res.send(arr[i])
        }


    }
    if (count == 0)
        res.send("id is not match")
})
// ASSIGNMENT 1
// Note: The below questions are very commonly asked in nodejs interviews
// Q1.
// // -write an api which gives the missing number in an array of integers starting from 1….e.g [1,2,3,5,6,7]
// : 4 is missing
// // Your route code will look like this
// app.get("/sol1", function (req, res) {
// //logic : sum of numbers is n(n+1)/2..so get sum of all numbers in array. now take sum of
// numbers till last digit in the array
// router.get("/sol", function (req, res) {
//     let arr = [1, 2, 3, 5, 6, 7]
//     let total = 0;
//     for (var i in arr) {
//         total += arr[i];//total=total+arr[i]
//     }
//     let lastDigit = arr.pop()
//     let consecutiveSum = lastDigit * (lastDigit + 1) / 2
//     let missingNumber = consecutiveSum - total
//     res.send({ data: missingNumber });
// });

// Q2.
// // -write an api which gives the missing number in an array of integers starting from anywhere….e.g [33,
// 34, 35, 37, 38]: 36 is missing
// // Your route code will look like this
// router.get("/sol2", function (req, res) {
//     // //logic : sum of n consecutive numbers is [ n * (first + last) / 2 ]..so get sum of all
//     // numbers in array. now take sum of n consecutive numbers.. n would be length+1 as 1 number is missing
//     let arr = [33, 34, 35, 37, 38]
//     let len = arr.length

//     let total = 0;
//     for (var i in arr) {
//         total += arr[i];
//     }
//     let firstDigit = arr[0]
//     let lastDigit = arr.pop()
//     let consecutiveSum = (len + 1) * (firstDigit + lastDigit) / 2
//     let missingNumber = consecutiveSum - total

//     res.send({ data: missingNumber });
// });
// Assignments 2 (Structure of the routes file would look like what is given at the bottom of the document):
// You have to write a POST apis:
// Write the api in first project directory (Routes/index.js or routes/route.js)
// Problem Statement 1 :
// NOTE: you must create the players array outside( on the top ) of the api( so that data is maintained across api hits )
// Your player collection should be an ARRAY of player objects. Each player object should have the following attributes:
// {
// "name": "manish",
// "dob": "1/1/1995",
// "gender": "male",
// "city": "jalandhar",
// "sports": [
// "swimming"
// ]
// }
// e.g. the players array would look like this:
// let players =
//     [
//         {
//             "name": "manish",
//             "dob": "1/1/1995",
//             "gender": "male",
//             "city": "jalandhar",
//             "sports": [
//                 "swimming"
//             ]
//         },
//         {
//             "name": "gopal",
//             "dob": "1/09/1995",
//             "gender": "male",
//             "city": "delhi",
//             "sports": [
//                 "soccer"
//             ]
//         },
//         {
//             "name": "lokesh",
//             "dob": "1/1/1990",
//             "gender": "male",
//             "city": "mumbai",
//             "sports": [
//                 "soccer"
//             ]
//         },
//     ]
// router.post('/players', function (req, res) {
//     const body = req.body
    // {
    //                "name": "lokesh",
    //                "dob": "1/1/1990",
    //                "gender": "male",
    //                "city": "mumbai",
    //                "sports": [
    //                    "soccer"
    //                ]
    //            }

//     const playerDetail = player.find(player => player.name === body.name)
//     if (player) {
//         res.send({ message: "player already exist" })
//     } else {
//         players.push(body)
//         res.send(players)
//     }
// })


// ASSIGNMENT 2
// Write a POST /players api that creates a new player ( i.e. that saves a player’s details and doesn’t allow saving the data of a player with a name that already exists in the data)

// NOTE: you must create the players array outside( on the top ) of the api( so that data is maintained across api hits)



// —----------------


// The file inside routes would look like this:

// const express = require('express');
// constrouter = express.Router();

let player =
    [
        {
            "name": "manish",//string
            "dob": "1/1/1995",//string
            "gender": "male",//string
            "city": "jalandhar",//string
            "sports": [
                "swimming"   //array can be more then one
            ]
        },
        {
            "name": "gopal",
            "dob": "1/09/1995",
            "gender": "male",
            "city": "delhi",
            "sports": [
                "soccer"
            ],
        },
        {
            "name": "lokesh",
            "dob": "1/1/1990",
            "gender": "male",
            "city": "mumbai",
            "sports": [
                "soccer"
            ],
        },
    ]

// router.post('/player1', function (req, res) {
//     console.log(player)
//     let newplayer = req.body.p1
//     console.log(newplayer)
//     for (i of player) {
//         if (i.name == newplayer.name) {
//             return res.send("name already exists")
//         }
//     }

//     player.push(newplayer)
//     console.log(result)
//     res.send({ msg: player, status: true })
// });

router.post('/hello', function(req,res){
    res.send({msg : "hello"})
})

let players = []

router.post('/newplayers', function (req, res) {
    
    console.log("hello")
    let newPlayer = req.body
    let newPlayersName = newPlayer.name
    let isNameRepeated = false

    let player = player.find(p => p.name == newPlayersName)

    for(let i = 0; i < player.length; i++) {
        if(player[i].name == newPlayersName) {
            isNameRepeated = true;
            break;
        }
    }

    //undefined is same as false/ a falsy value
    if (isNameRepeated) {
        //Player exists
        res.send("This player was already added!")
    } else {
        //New entry
        player.push(newPlayer)
        res.send(player)
    };
});


    //LOGIC WILL COME HERE
    //path params
    // router.get("/wiki/:countryName", function (req, res) {
    //     res.send({ data: "something data" })
    // })
    // router.get("/:product")
    // //Query params 
    // //use case: to make filters/ searches
    // //variable name is visible in the url itself
    // router.get("/get-query-1", function (req, res) {
    //     let data = req.query
    //     let var1 = data.myCoolVar
    //     let var2 = data.xyz
    //     console.log(data)
    //     res.send({ data: data, status: true })
    // })
    // //take marks in req.query in a variable named "marks"
    // router.get("get-query-2", function (req, res) {
    //     let marks = req.query.marks
    //     let result = marks > 40 ? "pass" : "fail"
    //     //ternary operator
    //     res.send({ data: result, status: true })
    // })
    //query params (as well  as path params) can be sent
    // router.post("/post-query-1", function (req, res) {
    //     let data = req.query
    //     console.log(data)
    //     res.send({ data: data, status: true })
    // })
    // //filter out all the numbers that are greater than ""
    let myArr = [23, 45, 67, 281394, 423, 24, 42323]
    router.post("/post-query-2", function (req, res) {
        let input = req.query.input
        // let finArr= myArr.filter(ele => ele>input)
        let finalArr = []
        for (i = 0; i < myArr.length; i++) {
            if (myArr[i] > input) finalArr.push(myArr[i])

        }
        res.send({ data: finalArr, status: true })
    })
    //     ASSIGNMENT:

    // ASSIGNMENT:
    // you will be given an array of persons ( i.e an array of objects )..each person will have  a {name: String , age: Number, votingStatus: true/false(Boolean)}
    // take input in query param as votingAge..and for all the people above that age, change votingStatus as true
    // also return an array consisting of only the person that can vote

    // WRITE A POST API TO THE ABOVE


    // take this as sample for array of persons:
//     let persons = [
//         {
//             name: "PK",
//             age: 10,
//             votingStatus: false
//         },
//         {
//             name: "SK",
//             age: 20,
//             votingStatus: false
//         },
//         {
//             name: "AA",
//             age: 70,
//             votingStatus: false
//         },
//         {
//             name: "SC",
//             age: 5,
//             votingStatus: false
//         },
//         {
//             name: "HO",
//             age: 40,
//             votingStatus: false
//         }
//     ]
    
//     router.post("/name", function(req, res){
//         console.log("hi")
//         let newVotingAge=[]
//         let votingAge = req.query.votingAge
//         for(let i=0; i<persons.length; i++){
//             if(persons[i].age>votingAge){
//                 persons[i].votingStatus=true;
//                 newVotingAge.push(persons[i])
//             }
//         }
//             res.send({data:newVotingAge, status:true})

// })




module.exports = router;