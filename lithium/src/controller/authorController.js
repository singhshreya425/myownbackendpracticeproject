const authorModel = require("../models/authorModel.js");
const jwt=require("jsonwebtoken");

const createAuthor = async function (req, res) {
  try {
      let author = req.body

    //   if (Object.keys(author).length == 0) {
    //       return res.status(400).send({ status: false, msg: "Invalid request Please provide valid Author  details" });
    //   }



    //   if (!author.fname) return res.status(400).send({ msg: " First name is required " });
    //   if (!author.lname) return res.status(400).send({ msg: " Last name is required " });
    //   if (!author.email) return res.status(400).send({ msg: " email is required " });
    //   if (!author.password) return res.status(400).send({ msg: " password is required " });
    //   let titleEnum = ['Mr', 'Mrs', 'Miss']


    //   if (!titleEnum.includes(author.title)) {
    //       res.status(400).send({ status: false, msg: "title should be Mr, Mrs or Miss" })
    //   }



    //   if (!emailValidator.validate(author.email)) {
    //       return res.status(400).send({ status: false, msg: "Check the format of the given email" })
    //   }


    //   let emailValidation = await authorModel.findOne({ email: author.email })
    //   if (emailValidation) {
    //       return res.status(409).send({ status: false, msg: "This  email  already exists " })
    //   }
      

      let authorCreated = await authorModel.create(author)


      res.status(201).send({ data: authorCreated })
  } catch (error) {
      res.status(500).send({ msg: error.message })
  }
}



const login = async function (req, res) {
  try {
      let author = req.body
      let email = req.body.email
      let password = req.body.password
      if (Object.keys(author).length == 0) {
          return res.status(400).send({ status: false, msg: "Invalid request Please provide valid Author  details" });
      }

      if (email.trim().length == 0 || password.trim().length == 0) {
          return res.status(400).send({
              status: false,
              msg: "please provide login details",
          });
      }

      if (!email) return res.status(400).send({ msg: " email is required " })
      if (!password) return res.status(400).send({ msg: "  password is required " })


      let loggedAuthor = await authorModel.findOne({ email: email, password: password })
      if (!loggedAuthor) return res.status(404).send({ msg: "Email or Password is Incorrect!" })
          
      
      


      let token = jwt.sign(
          {
              authorId: loggedAuthor._id.toString(),
              batch: "lithium",
              project: "Blog-Project"
          },
          "Secret-Key-lithium" ,{ expiresIn: '12h'}
      )

      res.status(200).send({ msg: "User logged in successfully!", loggedAuthor, token })
  } catch (error) {
      res.status(500).send({ msg: error.message })
  }
}





module.exports.createAuthor = createAuthor;
module.exports.login = login
