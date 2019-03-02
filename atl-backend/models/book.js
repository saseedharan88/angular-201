var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var bookSchema = new Schema(
  {
    isbn: String,
    bookName: String,
    createdOn: { type: Date, default: Date.now() }
  }
)

module.exports = mongoose.model('Book',bookSchema);
