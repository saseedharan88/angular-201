var User = require('./models/User.js')
var bcrypt = require('bcrypt-nodejs')
var jwt = require('jwt-simple')
var express = require('express')
var router = express.Router()

// User register service.
router.post('/register', (req, res) => {
  try {
    var registerData = req.body;
    const user = User.findOne({email: registerData.email}, function(err, userObj){
      if(err){
        res.status(401).send({message: 'Error occurred while registering : ' + err})
      }
      else if (userObj){
        // User exists already.
        res.status(401).send({message: 'Email ID already exists'})
      }
      else{
        var user = new User(registerData);
        user.save((err, newUser) => {
          if (err)
            res.status(401).send({message: 'Error in registering a user: ' + err})
          createSendToken(res, newUser)
        })
      }
    });
  }
  catch(error) {
    return res.status(500).send({message: 'Error in registering a user : ' + error})
  }
})

// User login service.
router.post('/login', async (req, res) => {
  try {
    var loginData = req.body;
    const user = await User.findOne({email: loginData.email}, function(err, userObj){
      if(err){
        res.status(401).send({message: 'Error occurred while login : ' + err})
      }
      else if (userObj){
        // User exists.
        bcrypt.compare(loginData.password, userObj.password, (err, isMatch) => {
          if (err)
            return res.status(401).send({message: 'Error in checking ' + err})
          if (!isMatch)
            return res.status(401).send({message: 'Password is invalid'})
          createSendToken(res, userObj)
        })
      }
      else{
        return res.status(401).send({message: 'Email or Password is invalid'})
      }
    });
  }
  catch(error) {
    return res.sendStatus(500)
  }
})

// User social login service.
router.post('/slogin', (req, res) => {
  try {
    var loginData = req.body;
    const user = User.findOne({email: loginData.email}, function(err, userObj){
      if(err){
        res.status(401).send({message: 'Error occurred while login : ' + err})
      }
      else if (userObj){
        // User exists already.
        createSendToken(res, userObj)
      }
      else{
        var user = new User(loginData);
        user.save((err, newUser) => {
          if (err)
            res.status(401).send({message: 'Error in registering a user: ' + err})
          createSendToken(res, newUser)
        })
      }
    });
  }
  catch(error) {
    return res.status(500).send({message: 'Error in social login : ' + error})
  }
})

function createSendToken(res, user) {
  var payload = { sub: user._id }
  var token = jwt.encode(payload, '123')
  res.status(200).send({token})
}

var auth = {
  router,
  checkAuthenticated: (req, res, next) => {
    if (!req.header('authorization'))
      return res.status(401).send({message: 'Unauthorized. Missing Auth Header'})
    var token = req.header('authorization').split(' ')[1]
    var payload = jwt.decode(token, '123')
    if (!payload)
      return res.status(401).send({ message: 'Unauthorized. Auth Header Invalid'})
    req.userId = payload.sub
    next()
  }
}

module.exports = auth
