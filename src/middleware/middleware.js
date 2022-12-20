const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  try {
    let token = req.headers["authorization"];
    

    if (!token) return res.status(400).send({ status: false, msg: "token must be present" });
    token= token.slice(7)
    

    jwt.verify(token, "Group18", function (err, decode) {
      if (err) { return res.status(401).send({ status: false, message: "Authentication failed" }) }
      req.decode = decode;
      next();
    })
  }
  catch (error) {
    res.status(500).send({ staus: false, msg: error });
  }
}

const authorize = function (req, res, next) {
  try {

    if (req.body.userId == req.decode.userId) return next();
    else return res.status(403).send({ status: false, msg: "you are not authorised !" });

  } catch (error) {
    return res.status(500).send({ msg: error.message })
  }
}


module.exports = {authenticate,authorize}
