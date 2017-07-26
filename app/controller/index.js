var Base64 = require('js-base64').Base64;

var Movie = require('../models/movie');
var Book = require('../models/book')
var Software = require('../models/software')

exports.index = function (req, res) {
    console.log('user in session: ')
    console.log(req.session.user)

    var indexData = {}

    getMovieData(function (data) {
        indexData.movies = data
        getBookData(function (data) {
            indexData.books = data
            getSoftwareData(function (data) {
                indexData.softwares = data

                renderPage(res, indexData)
            })
        })
    })
}

function renderPage (res, indexData) {
    res.render('index', {
        title: 'xingkong 首页',
        data: indexData
    })
}

function getMovieData (cb) {
    Movie.fetch(function (err, movies) {
        // console.log(movies)
        if (err) {
            console.error(err)
        } else {
            // movies.forEach(function (item) {
            //     item.video = 'thunder://' + Base64.encode('AA' + item.video + 'ZZ')
            // })
            cb(movies)
        }
    });
}

function getBookData (cb) {
    Book.fetch(function (err, books) {
        if (err) {
            console.error(err)
        } else {
            cb(books)
        }
    });
}

function getSoftwareData (cb) {
    Software.fetch(function (err, softwares) {
        if (err) {
            console.error(err)
        } else {
            cb(softwares)
        }
    });
}