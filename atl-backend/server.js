var express = require('express')
var app = express()
var cors = require('cors')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var https = require('https')
var cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')
var session = require('express-session')
var Book = require('./models/Book.js')
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

app.get('/books', (req, res) => {
  res.send(books)
})

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
  // console.log("req.bookId : "+req.query.bookId)
  // Find book with a matching bookId
  let query = Book.findOne({ 'bookId': req.query.bookId });
  // selecting the `copies` and `bookId` fields.
  query.select('copies bookId');
  // execute the query at a later time.
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
  var book = new Book(bookData)
  book.save((err, result) => {
    if (err)
      console.log("Error in adding a book." + err)
    res.sendStatus(200)
  })
})

// Update Book details service.
app.post('/update-book-details', (req, res) => {
  let bookDetails = req.body;
  let query = Book.findOne({ 'bookId': bookDetails.bookId });
  query.select('bookId');
  query.exec(function (err, book) {
    if (err) {
      res.send(res.send({ success: false, message: "Some error occurred " + err.message }))
    }
    else {
      if (book !== null) {
        // Book details already exists.
        let query = { 'bookId': bookDetails.bookId };
        let options = {new: true};
        Book.findOneAndUpdate(query, bookDetails, options, function(err, book) {
          if (err) {
            res.send({ success: false, message: "Some error occurred " + err.message })
          }
          res.send({ success: true, message: "Successfully Saved !!", data: book })
        });
      }
      else {
        // Insert new book details.
        let book = new Book(bookDetails)
        book.save((err, result) => {
          if (err) {
            res.send({ success: false, message: "Some error occurred " + err.message })
          }
          res.send({ success: true, message: "Successfully Saved !!", data: result })
        })

        // Get the subject data from google API.


        // Get the author data from google API.
      }
    }
  });
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


//Set up mongoose connection
//var mongoDB = 'mongodb://atluser:jKiRsnG4rdvkFU0m@cluster0-shard-00-00-r9ag9.mongodb.net:27017,cluster0-shard-00-01-r9ag9.mongodb.net:27017,cluster0-shard-00-02-r9ag9.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true';

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
// mongoose.Promise = global.Promise;
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use('/auth', auth)
app.listen(3000)
