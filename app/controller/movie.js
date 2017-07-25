var Movie = require('../models/movie');

var fs = require('fs')
var path = require('path')
var _ = require('underscore')

// ---------  Page   --------------------

// user movies list page
exports.movieListPage = function(req, res) {
    Movie.fetch(function(err, movieList) {
        console.log('movieList', movieList)
        if (err) {
            console.log(err)
        } else {
            res.render('movie/moviesList', {
                title: 'Movie List',
                movies: movieList
            })
        }
    })
}

// user movie detail page
exports.movieDetailPage = function (req, res) {
    var id = req.params.id;
    console.log(id)
    Movie.findById(id, function (err, movie) {
        if (err) {
            console.error(err)
        } else {
            console.log('result', movie)
            res.render('movie/movieDetail', {
                title: 'xingkong 详情页',
                movie: movie
            })
        }

    })
}

// admin manage movies page
exports.adminMovieList = function(req, res) {
    Movie.fetch(function(err, movieList) {
        console.log('movieList', movieList)
        if (err) {
            console.log(err)
        } else {
            res.render('movie/adminMoviesList', {
                title: 'Movie List',
                movies: movieList
            })
        }
    })
}

// admin add movie page
exports.addMoviePage = function (req, res) {
    res.render('movie/updateMovie', {
        title: 'imooc 后台录入页',
        movie: {
            title: '',
            doctor: '',
            city: '',
            country: '',
            year: '',
            poster: '',
            video: '',
            summary: '',
            language: ''
        }
    })
};

// admin update movie page
exports.updateMoviePage = function (req, res) {
    var id = req.params.id;

    if (id) {
        Movie.findById({_id: id}, function (err, movie) {
            console.log('movie', movie)
            res.render('movie/updateMovie', {
                title: 'xingkong 后台更新页',
                movie: movie
            })
        })
    }
};

// -------------  API  --------------------

// addMovie
exports.addMovie = function (req, res) {
    var movieObj = req.body
    console.log('movieObj', movieObj)
    var _movie = new Movie({
        doctor: movieObj.doctor,
        title: movieObj.title,
        country: movieObj.country,
        language: movieObj.language,
        country: movieObj.country,
        summary: movieObj.summary,
        flash: movieObj.flash,
        year: movieObj.year,
        poster: movieObj.poster
    })
    _movie.save(movieObj, function (err, movie) {
        if (err) {
            console.error(err)
        } else {
            res.redirect('/movie/' + movie.id);
        }
    });
};

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

// addd & update movie
exports.updateMovie = function (req, res) {
    console.log(req.body)
    var id = req.body.movie._id;
    var movieObj = req.body.movie

    // var ftpAdd = 'ftp://10.3.5.110/xkFTP/movies'
    var ftpAdd = 'http://125.216.145.57:9080/download?resource='
    var category = 'movies/'
    var _movie

    if (req.poster) {
        movieObj.poster = req.poster
    }

    console.log(movieObj.video)
    if (movieObj.video && movieObj.video.indexOf(category) === -1) {
        movieObj.video = category + movieObj.video
    }

    if (movieObj.video && movieObj.video.indexOf(ftpAdd) === -1) {
        movieObj.video = ftpAdd + movieObj.video
    }
    // movieObj.video = ftpAdd + category + movieObj.video

    if (id !== 'undefined') {
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.error(err)
            } else {
                _movie = _.extend(movie, movieObj)
                _movie.save(function (err, movie) {
                    if (err) {
                        console.error(err)
                    } else {
                        res.redirect('/movie/' + movie.id)
                    }
                })
            }

        })
    } else {
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            country: movieObj.country,
            summary: movieObj.summary,
            video: movieObj.video,
            year: movieObj.year,
            poster: movieObj.poster
        })
        _movie.save(movieObj, function (err, movie) {
            if (err) {
                console.error(err)
            } else {
                res.redirect('/movie/' + movie.id);
            }
        });
    }
};

// delete movie
exports.deletMovie = function (req, res) {
    var id = req.query.id;
    console.log(id)
    if (id) {
        console.log('deleting')
        Movie.remove({_id: id}, function(err, movie) {
            if (err) {
                console.log(err)
            } else {
                res.json({success: 1})
            }
        })
    }
}