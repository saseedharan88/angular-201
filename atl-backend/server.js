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
var fs = require('fs')
var request = require('request')
var jwt = require('jwt-simple')

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

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
app.use(express.static('public'))

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
  // Find book with a matching bookId
  let query = dbschema.Book.findOne({ 'bookId': req.query.bookId });
  // selecting the `copies` and `bookId` fields.
  // query.select('copies bookId');
  // execute the query at a later time.
  query.exec(function (err, book) {
    if (err)
      res.send(err.message)
    res.send(book)
  });
})

// Get all unique subjects from database.
app.get('/library/subjects', async (req, res) => {
  try {
    let query = dbschema.Book.distinct("subjects.name");
    query.exec(function (err, subjects) {
      if (err)
        res.send(err.message)
      res.send(subjects)
    });
  }
  catch (error) {
    res.sendStatus(500)
  }
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
  if (filterBy !== ""  && filterValue !== "") {
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
app.post('/update-book-details', auth.checkAuthenticated, async (req, res) => {
  let bookDetails = req.body;
  let bookId = bookDetails.bookId;
  let book = new dbschema.Book()
  // Check if book details already exists.
  let whereClause = { 'bookId': bookId };
  let bookDoc = await dbschema.Book.findOne(whereClause)
  if (bookDoc) {
    // Book exists.
    book = bookDoc
  }
  else {
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

  // Download the image.
  if ((typeof bookDetails.thumbnail !== "undefined")) {
    book.thumbnail = bookId + '.png';
    download(bookDetails.thumbnail, 'public/' + bookId + '.png', function(){
    });
  }
  else {
    book.thumbnail = 'sample.png';
  }

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

// Set up mongoose connection.
var mongoDB = 'mongodb://127.0.0.1:27017/atldb';
mongoose.connect(mongoDB, {useNewUrlParser: true}, (err) => {
  console.log('attempt connected to mongo !!');
  if (!err) {
    console.log('connected to mongo !!');
  }
  else {
    console.log("Connection error:" + err);
  }
});
app.use('/auth', auth.router)
app.listen(3000)
