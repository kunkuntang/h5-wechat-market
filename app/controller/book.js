var Book = require('../models/book');

var fs = require('fs')
var path = require('path')
var _ = require('underscore')

// ---------  Page   --------------------

// user books list page
exports.bookListPage = function(req, res) {
    Book.fetch(function(err, bookList) {
        if (err) {
            console.log(err)
        } else {
            res.render('book/booksList', {
                title: 'Book List',
                books: bookList
            })
        }
    })
}

// user book detail page
exports.bookDetailPage = function (req, res) {
    var id = req.params.id;
    console.log(id)
    Book.findById(id, function (err, book) {
        if (err) {
            console.error(err)
        } else {
            console.log('result', book)
            res.render('book/bookDetail', {
                title: '图书 详情页',
                book: book
            })
        }

    })
}

// admin manage books page
exports.adminBookList = function(req, res) {
    Book.fetch(function(err, bookList) {
        console.log('bookList', bookList)
        if (err) {
            console.log(err)
        } else {
            res.render('book/adminBooksList', {
                title: 'Book List',
                books: bookList
            })
        }
    })
}

// admin add book page
exports.addBookPage = function (req, res) {
    res.render('book/updateBook', {
        title: '图书 后台录入页',
        book: {
            name: '',
            author: '',
            publisher: '',
            year: '',
            poster: '',
            src: '',
            summary: '',
        }
    })
};

// admin update book page
exports.updateBookPage = function (req, res) {
    var id = req.params.id;

    if (id) {
        Book.findById({_id: id}, function (err, book) {
            console.log('book', book)
            res.render('book/updateBook', {
                title: '图书 后台更新页',
                book: book
            })
        })
    }
};

// -------------  API  --------------------

exports.preSave = function(req, res, next) {
    console.log('req files', req.files)
    var posterData = req.files.uploadPoster
    console.log('posterData', posterData)
    var filePath = posterData.path
    var originalFilename = posterData.originalFilename

    if(originalFilename) {
        fs.readFile(filePath, function(err, data) {
            var timeStamp = Date.now()
            var type = posterData.type.split('/')[1]
            var poster = timeStamp + '.' + type
            var newPath = path.join(__dirname, '../../', '/public/uploadPoster/' + poster)

            fs.writeFile(newPath, data, function(err) {
                if (err) {
                    console.log(err)
                    req.poster = '/public/img/poster.jpg'
                } else {
                    req.poster = poster
                    console.log('req poster', req.poster)
                    console.log('\n')
                }
                next()
            })
        })
    } else {
        next()
    }
}

// addd & update book
exports.updateBook = function (req, res) {
    console.log(req.body)
    var id = req.body.book._id;
    var bookObj = req.body.book

    // var ftpAdd = 'ftp://10.3.5.110/xkFTP/books'
    var ftpAdd = 'http://125.216.145.57:9080/download?resource='
    var category = 'books/'
    var _book

    if (req.poster) {
        bookObj.poster = req.poster
    }

    console.log(bookObj.src)
    if (bookObj.src && bookObj.src.indexOf(category) === -1) {
        bookObj.src = category + bookObj.src
    }

    if (bookObj.src && bookObj.src.indexOf(ftpAdd) === -1) {
        bookObj.src = ftpAdd + bookObj.src
    }

    console.log(bookObj.src)
    // bookObj.video = ftpAdd + category + bookObj.video

    if (id !== 'undefined') {
        Book.findById(id, function (err, book) {
            if (err) {
                console.error(err)
            } else {
                _book = _.extend(book, bookObj)
                _book.save(function (err, book) {
                    if (err) {
                        console.error(err)
                    } else {
                        res.redirect('/book/' + book.id)
                    }
                })
            }

        })
    } else {
        _book = new Book({
            author: bookObj.author,
            name: bookObj.name,
            year: bookObj.year,
            publisher: bookObj.publisher,
            summary: bookObj.summary,
            poster: bookObj.poster,
            src: bookObj.src
        })
        _book.save(bookObj, function (err, book) {
            if (err) {
                console.error(err)
            } else {
                res.redirect('/book/' + book.id);
            }
        });
    }
};

// delete book
exports.deletBook = function (req, res) {
    var id = req.query.id;
    console.log(id)
    if (id) {
        console.log('deleting')
        Book.remove({_id: id}, function(err, book) {
            if (err) {
                console.log(err)
            } else {
                res.json({success: 1})
            }
        })
    }
}