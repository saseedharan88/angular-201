let mongoose = require('mongoose')
let Schema = mongoose.Schema;

// let bookSubject = new Schema({
//   name: String,
//   description: String,
//   isActive: Boolean
// })

// Subject schema.
let subjectSchema = new Schema({
  name: String
})
let Subject = mongoose.model('Subject', subjectSchema);

// Author schema.
let authorSchema = new Schema({
  name: String
})
let Author = mongoose.model('Author', authorSchema);

// Book schema.
let bookSchema = new Schema(
  {
    title: String,
    subtitle: String,
    subjects: [ subjectSchema ],
    authors: [ authorSchema ],
    createdOn: { type: Date, default: Date.now() },
    copies: Number,
    bookId: String,
    publisher: String,
    publishedDate: String,
    description: String,
    thumbnail: String,
  }
)
let Book = mongoose.model('Book',bookSchema);

// Issue Register schema.
var issueRegisterSchema = new Schema(
  {
    issueDate: String,
    returnDate: String,
    reviewComment: String,
    bookRating: String
  }
)

let IssueRegister = mongoose.model('IssueRegister',issueRegisterSchema);

// Export all schemas.
module.exports = {
  Book: Book,
  Author: Author,
  Subject: Subject,
  IssueRegister: IssueRegister
}
