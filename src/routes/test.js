const express = require('express');
const router = express.Router();
// Assignments:
// Write a POST /players api that saves a player’s details and doesn’t allow saving the data of a player with a name that already exists in the data


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

// router.get("/testapi", function(req,res){
//    return  res.send({data :"test api"})
// })

// let players = []

router.post('/newplayers', function (req, res) {

    console.log("hello")
    let newPlayer = req.body
    let newPlayersName = newPlayer.name
    let isNameRepeated = false

    // let player = player.find(p => p.name == newPlayersName)

    for (let i = 0; i < player.length; i++) {
        if (player[i].name == newPlayersName) {
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
    
// router.post("/name", function (req, res) {
//     // console.log("hi")
//     let newVotingAge = []
//     let votingAge = req.query.votingAge
//     for (let i = 0; i < persons.length; i++) {
//         if (persons[i].age > votingAge) {
//             persons[i].votingStatus = true;
//             newVotingAge.push(persons[i])
//         }
//     }
//     res.send({ data: newVotingAge, status: true })

// })
// module.exports = router; 