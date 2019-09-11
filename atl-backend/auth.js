var User = require('./models/User.js')
var bcrypt = require('bcrypt-nodejs')
var jwt = require('jwt-simple')
var express = require('express')
var router = express.Router()

// User register service.
router.post('/register', (req, res) => {
  try {
    var userData = req.body;
    var user = new User(userData);
    user.save((err, newUser) => {
      if (err)
        res.status(401).send({message: 'Error in registering a user: ' + err})
      createSendToken(res, newUser)
    })
  }
  catch (error) {
    res.sendStatus(500)
  }
})

// User login service.
router.post('/login', async (req, res) => {
  try {
    var loginData = req.body;
    var user = await User.findOne({email: loginData.email});
    if (!user)
      return res.status(401).send({message: 'Email or Password is invalid'})
    bcrypt.compare(loginData.password, user.password, (err, isMatch) => {
      if (err)
        return res.status(401).send({message: 'Error in checking ' + err})
      if (!isMatch)
        return res.status(401).send({message: 'Password is invalid'})
      createSendToken(res, user)
    })
  }
  catch(error) {
    return res.sendStatus(500)
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
