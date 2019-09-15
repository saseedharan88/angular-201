let mongoose = require('mongoose')
let Schema = mongoose.Schema;

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
    copiesIssued: Number,
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
    userId: String,
    bookId: String,
    issueDate: String,
    returnDate: String,
    reviewComment: String,
    copies: Number,
    email: String,
    phone: String,
    notificationMode: String,
    rating: String,
    issueStatus: String,
    borrower: mongoose.Schema.ObjectId,
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
