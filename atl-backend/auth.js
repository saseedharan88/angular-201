var User = require('./models/User.js')
var bcrypt = require('bcrypt-nodejs')
var jwt = require('jwt-simple')
var express = require('express')
var router = express.Router()

// User register service.
router.post('/register', (req, res) => {
  var userData = req.body;
  var user = new User(userData);
  user.save((err, result) => {
    if (err)
      res.status(401).send({message: 'Error in registering a user: ' + err})
    res.status(200).send({message: 'Successfully Registered !!'})
  })
})

// User login service.
router.post('/login', async (req, res) => {
  var loginData = req.body;
  var user = await User.findOne({email: loginData.email});
  console.log("from db user: " + user.email + " = " + user.password);
  if (!user)
    res.status(401).send({message: 'Email or Password is invalid'})
  bcrypt.compare(loginData.password, user.password, (err, isMatch) => {
    if (err)
      res.status(401).send({message: 'Error in checking ' + err})
    if (!isMatch)
      res.status(401).send({message: 'Password is invalid'})
    var payload = {}
    var token = jwt.encode(payload, '123')
    res.status(200).send({token})
  })
})

module.exports = router
