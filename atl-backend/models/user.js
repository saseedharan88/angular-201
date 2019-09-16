var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs')

var Schema = mongoose.Schema

var userSchema = new Schema(
  {
    email: String,
    password: String,
    id: String, // Social ID.
    name: String,
    photoUrl: String, // Social Photo URL.
    firstName: String,
    lastName: String,
    provider: String,
    loginTime: Date,
  }
)

userSchema.pre('save', function(next) {
  var user = this

  if (!user.isModified('password'))
    return next()

  bcrypt.hash(user.password, null, null, (err, hash) => {
    if(err) return next(err)

    user.password = hash
    next()
  })

})

module.exports = mongoose.model('User',userSchema);
