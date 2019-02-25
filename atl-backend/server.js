var express = require('express')
var cors = require('cors')
var app = express()

var books = [
  { isbn: 'abcdef', book_name: 'Data structures' },
  { isbn: 'abcdef', book_name: 'Advanced C++' }
]

app.use(cors())

app.get('/', (req, res) => {
  res.send('This is any time library..')
})

app.get('/books', (req, res) => {
  res.send(books)
})

app.listen(3000)

