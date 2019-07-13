let mongoose = require('mongoose')
let Schema = mongoose.Schema;

let bookSubject = new Schema({
  name: String,
  description: String,
  isActive: Boolean
})

let bookSchema = new Schema(
  {
    isbn: String,
    book_name: String,
    subject: [ bookSubject ],
    createdOn: { type: Date, default: Date.now() },
    copies: Number,
    bookId: String,
  }
)

module.exports = mongoose.model('Book',bookSchema);
