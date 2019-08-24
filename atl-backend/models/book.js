let mongoose = require('mongoose')
let Schema = mongoose.Schema;

// let bookSubject = new Schema({
//   name: String,
//   description: String,
//   isActive: Boolean
// })

let subjectSchema = new Schema({
  name: String
})
module.exports = mongoose.model('Subject', subjectSchema);

let authorSchema = new Schema({
  name: String
})
module.exports = mongoose.model('Author', authorSchema);

let bookSchema = new Schema(
  {
    isbn: String,
    book_name: String,
    genre: [ {type:mongoose.Schema.ObjectId,
      ref: 'Subject'} ],
    authors: [ {type:mongoose.Schema.ObjectId,
      ref: 'Author'} ],
    createdOn: { type: Date, default: Date.now() },
    copies: Number,
    bookId: String,
  }
)

module.exports = mongoose.model('Book',bookSchema);
