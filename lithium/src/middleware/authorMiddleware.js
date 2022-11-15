const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    try {
        let token = req.headers["x-auth-key"];
        if (!token) return res.status(400).send({ status: false, msg: "token must be present" });

        let decodedToken = jwt.verify(token, "Secret-Key-lithium");

        if (!decodedToken) return res.status(401).send({ status: false, msg: "token is invalid" });

        let id = req.params.authorId;
        if (id !== decodedToken.authorId)
    
        return res.status(401).send({ status: false, msg: "your are not authorised !" });
        next();
    }
    catch (error) {
        res.status(500).send({ staus: false, msg: error });
    }
}

const authorize= function ( req, res, next) {
    try{
      let token = req.headers["x-api-key"];
      
  if (!token) return res.status(400).send({ status: false, msg: "token must be present" });
  
  let decodedToken = jwt.verify(token, "Secret-Key");

  if (!decodedToken)
  return res.status(401).send({ status: false, msg: "token is invalid" });

   //<-------Passing LoggedIn UserId into Route Handler------>//
  // let userTobeModified =req.body.authorId  
  // let userLoggedIn = decodedToken.userId  
  
    if (req.body.authorId  == decodedToken.userId ) return next();
      else return res.status(401).send({ status: false, msg: "you are not authorised !" });

    }catch(error){
      res.status(500).send({msg: error.message})
    }
  }


module.exports.authenticate=authenticate;
module.exports.authorize = authorize