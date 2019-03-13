var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var bookSubject = new Schema({
  name: String,
  description: String,
  isActive: Boolean
})

var bookSchema = new Schema(
  {
    isbn: String,
    book_name: String,
    subject: [ bookSubject ],
    createdOn: { type: Date, default: Date.now() }
  }
)

module.exports = mongoose.model('Book',bookSchema);
