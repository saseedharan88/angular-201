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

app.get('/search-books', (req, res) => {
  try {
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
    });  }
  catch (error) {
    res.sendStatus(500)
  }
})

// Get book inventory details.
app.get('/book/inventory/details', (req, res) => {
  try {
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
  }
  catch (error) {
    res.sendStatus(500)
  }
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
  try {
    let query = dbschema.Book.distinct("authors.name");
    query.exec(function (err, authors) {
      if (err)
        res.send(err.message)
      res.send(authors)
    });
  }
  catch (error) {
    res.sendStatus(500)
  }
})

// Get all books from application database.
app.get('/library/books', (req, res) => {
  try {
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
  }
  catch (error) {
    res.sendStatus(500)
  }
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
  try {

    console.log("Req user from cc: " + req.userId)

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
  }
  catch (error) {
    res.sendStatus(500)
  }
})

// Get current Logged in user data.
app.get('/current_user', auth.checkAuthenticated, async (req, res) => {
  try {
    var user_id = req.userId
    var user = await User.findOne({_id: user_id});
    if (!user)
      return res.status(401).send({message: 'Sorry, You are not allowed to access this page.'})
    return res.status(200).send(user)
  }
  catch(error) {
    return res.sendStatus(500)
  }
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
app.post('/issue-register', auth.checkAuthenticated, (req, res) => {
  try {
    let issueRegisterData = req.body
    let issuedStatus
    if (issueRegisterData.issueStatus == "issued") {
      // Update Issued date & time.
      issueRegisterData.issueDate = Date.now()
      issuedStatus = "Issued"
    }
    else if (issueRegisterData.issueStatus == "returned") {
      // Update Returned date & time.
      issueRegisterData.returnDate = Date.now()
      issuedStatus = "Returned"
    }
    issueRegisterData.borrower = req.userId
    let issueRegister = new dbschema.IssueRegister(issueRegisterData)
    issueRegister.save((err, result) => {
      if (err)
        res.status(401).send({message: 'Could not able to update, some error occurred : ' + err})
      // Update the master book schema copiesissued value.
      let bookDoc = updateBookCopiesIssued(issueRegisterData.bookId,issueRegisterData.copies,issueRegisterData.issueStatus)
      res.status(200).send({message: 'Successfully ' + issuedStatus + ' the Book !!'})
    })
  }
  catch (error) {
    res.sendStatus(500)
  }
})

app.get('/issue-log', async (req, res) => {
  try {
    await dbschema.IssueRegister.aggregate([{
      $lookup: {
        from: "books", // collection name in db
        localField: "bookId",
        foreignField: "bookId",
        as: "bookDetails"
      }
    },
    {
      $lookup: {
      from: "users", // collection name in db
        localField: "borrower",
        foreignField: "_id",
        as: "userDetails"
    }}]).exec(function(err, resultSet) {
      return res.status(200).send(resultSet)
    });
  }
  catch (error) {
    res.sendStatus(500)
  }
})

var updateBookCopiesIssued = async function (bookId, copies, issueStatus) {
  try {
    const filter = { bookId: bookId };
    let doc = await dbschema.Book.findOne(filter)
    if (issueStatus == "issued") {
      doc.copiesIssued = (typeof doc.copiesIssued !== "undefined") ? (parseFloat(doc.copiesIssued) + parseFloat(copies)) : parseFloat(copies)
    }
    else if (issueStatus == "returned") {
      doc.copiesIssued =  parseFloat(doc.copiesIssued) - parseFloat(copies)
    }
    await doc.save();
  }
  catch (error) {
    return error
  }
}


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
