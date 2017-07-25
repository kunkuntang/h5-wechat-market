var fs = require('fs')
var path = require('path')

exports.download = function (req, res, next) {
    var movie = req.query.movie
    var name = req.query.name
    var type = movie.split('.')
    type = type[type.length-1]
    var address = 'D:/ftp/xkFTP/'
    console.log(movie)
    if (movie) {
        res.download(address + movie, name + '.' + type);
    }
}