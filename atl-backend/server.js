var express = require('express')
var app = express()
var cors = require('cors')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var https = require('https')
var cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')
var session = require('express-session')
var dbschema = require('./models/dbschema')
var User = require('./models/User.js')
var auth = require('./auth')

var books = [
  {isbn: 'abcdef', book_name: 'Data structures'},
  {isbn: 'abcdef', book_name: 'Advanced C++'}
]

// Google Book.
const GOOGLE_API = 'AIzaSyD41fpvX5zgAuYb2Y4ETOdcQKUVGYIj-Qg';
app.use(cors())
app.use(bodyParser.json())
app.use(cookieSession({
  name: 'session',
  keys: ['123'],
  maxAge: 24 * 60 * 60 * 1000
}));
app.use(cookieParser());

app.get('/', (req, res) => {
  if (req.session.token) {
    res.cookie('token', req.session.token);
    res.json({
      status: 'session cookie set'
    });
  } else {
    res.cookie('token', '')
    res.json({
      status: 'session cookie not set'
    });
  }
})

app.get('/logout', (req, res) => {
  req.logout();
  req.session = null;
  res.redirect('/');
});

app.get('/search-books', (req, res) => {
  var searchQuery = "";
  if (req.query.isbn != "") {
    searchQuery += "+isbn:" + req.query.isbn;
  }
  if (req.query.title != "") {
    searchQuery += "+intitle:" + req.query.title;
  }
  if (req.query.author != "") {
    searchQuery += "+inauthor:" + req.query.author;
  }

  https.get('https://www.googleapis.com/books/v1/volumes?q=' + searchQuery + '&maxResults=40&key=' + GOOGLE_API, (resp) => {
    let data = '';

    // A chunk of data has been received.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      res.send(data)
    });

  }).on("error", (err) => {
    res.send(err.message)
  });
})

// Get book inventory details.
app.get('/book/inventory/details', (req, res) => {
  console.log("req.bookId : "+req.query.bookId)
  // Find book with a matching bookId
  let query = dbschema.Book.findOne({ 'bookId': req.query.bookId });
  // selecting the `copies` and `bookId` fields.
  query.select('copies bookId');
  // execute the query at a later time.
  query.exec(function (err, book) {
    if (err)
      res.send(err.message)
    res.send(book)
  });
})

// Get all unique subjects from database.
app.get('/library/subjects', (req, res) => {
  let query = dbschema.Book.distinct("subjects.name");
  query.exec(function (err, subjects) {
    if (err)
      res.send(err.message)
    res.send(subjects)
  });
})

// Get all unique authors from database.
app.get('/library/authors', (req, res) => {
  let query = dbschema.Book.distinct("authors.name");
  query.exec(function (err, authors) {
    if (err)
      res.send(err.message)
    res.send(authors)
  });
})

// Get all books from application database.
app.get('/library/books', (req, res) => {
  let query = dbschema.Book.find();
  let filterBy = req.query.filterBy;
  let filterValue = req.query.filterValue;
  console.log("Outside if: " + filterBy);
  console.log("Outside if 2: " + filterValue);
  if (filterBy !== ""  && filterValue !== "") {
    console.log("Inside if");
    query = dbschema.Book.find()
      .where(filterBy + ".name").equals(filterValue);
  }
  query.exec(function (err, book) {
    if (err)
      res.send(err.message)
    res.send(book)
  });
})

// Add Book service.
app.post('/addbook', (req, res) => {

  var bookData = req.body

  bookData.subject = [{
    name: "French fiction",
    description: "This is desc about French fiction.",
    isActive: true
  }]

  console.log("In adding a book." + bookData.isbn + " / " + bookData.book_name)
  // res.sendStatus(200)
  var book = new dbschema.Book(bookData)
  book.save((err, result) => {
    if (err)
      console.log("Error in adding a book." + err)
    res.sendStatus(200)
  })
})

// Update Book details service.
app.post('/update-book-details', async (req, res) => {
  let bookDetails = req.body;
  let bookId = bookDetails.bookId;
  let book = new dbschema.Book()

  // Check if book details already exists.
  let whereClause = { 'bookId': bookId };
  let bookDoc = await dbschema.Book.findOne(whereClause)
  if (bookDoc !== null) {
    // Book already exists.
    book = bookDoc
    book.bookId = bookId;
  }
  // Prepare Book details.
  if (typeof bookDetails.authors !== "undefined") {
    let authors = []
    bookDetails.authors.forEach(function(element) {
      authors.push(new dbschema.Author(element))
    })
    book.authors = authors
  }

  if (typeof bookDetails.genre !== "undefined") {
    let subjects = []
    bookDetails.genre.forEach(function(element) {
      subjects.push(new dbschema.Subject(element))
    })
    book.subjects = subjects
  }

  book.copies = (typeof bookDetails.copies !== "undefined" && bookDetails.copies > 0 ) ? bookDetails.copies : 0;
  book.title = (typeof bookDetails.title !== "undefined") ? bookDetails.title : "";
  book.subtitle = (typeof bookDetails.subtitle !== "undefined") ? bookDetails.subtitle : "";
  book.publisher = (typeof bookDetails.publisher !== "undefined") ? bookDetails.publisher : "";
  book.publishedDate = (typeof bookDetails.publishedDate !== "undefined") ? bookDetails.publishedDate : "";
  book.description = (bookDetails.description !== "undefined") ? bookDetails.description : "";
  book.thumbnail = (typeof bookDetails.thumbnail !== "undefined") ? bookDetails.thumbnail : "";

  console.log("Src : " + JSON.stringify(bookDetails))
  console.log("Just before save : " + JSON.stringify(book))
  book.save((err, result) => {
    if (err) {
      res.send({ success: false, message: "Some error occurred " + err.message })
    }
    res.send({ success: true, message: "Successfully Saved !!", data: result })
  })
})


// Get list of users.
app.get('/users', async (req, res) => {
  try {
    var users = await User.find({}, '-password -__v')
    res.send(users)
  } catch (error) {
    console.log("Error in getting users")
    res.sendStatus(500)
  }
})


// Book issue register.
app.post('/issue-register', (req, res) => {
  var issueRegisterData = req.body;
  var issueRegister = new dbschema.IssueRegister(issueRegisterData);
  issueRegister.save((err, result) => {
    if (err)
      res.status(401).send({message: 'Could not able to issue, some error occurred : ' + err})
    res.status(200).send({message: 'Successfully Issue the Book !!'})
  })
})



//Set up mongoose connection
// var mongoDB = 'mongodb://admin:admin@cluster0-shard-00-00-r9ag9.mongodb.net:27017,cluster0-shard-00-01-r9ag9.mongodb.net:27017,cluster0-shard-00-02-r9ag9.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true';
var mongoDB = 'mongodb://127.0.0.1:27017/atldb';
// var mongoDB = 'mongodb://admin:hT7XfP6l6RGZkqEl@main-shard-00-00-03xkr.mongodb.net:27017,main-shard-00-01-03xkr.mongodb.net:27017,main-shard-00-02-03xkr.mongodb.net:27017/main?ssl=true&replicaSet=Main-shard-0&authSource=admin&retryWrites=true';
// var mongoDB =  'mongodb+srv://admin:admin@cluster0-ix1h1.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(mongoDB, {useNewUrlParser: true}, (err) => {
  console.log('attempt connected to mongo !!');
  if (!err) {
    console.log('connected to mongo !!');
  }
  else {
    console.log("Connection error:" + err);
  }
});
// mongoose.Promise = global.Promise;
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use('/auth', auth)
app.listen(3000)
