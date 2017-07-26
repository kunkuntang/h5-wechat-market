var multipart = require('connect-multiparty')
var multipartMiddleware = multipart()

var Index = require('../controller/index')
var Movie = require('../controller/movie')
var Book = require('../controller/book')
var User = require('../controller/user')
var Software = require('../controller/software')
var Download = require('../controller/download')
var Product = require('../controller/product')

// var Movie = require('../models/movie');
var _ = require('underscore');

module.exports = function (app) {

    // pre handle user
    app.use(function (req, res, next) {

        var _user = req.session.user

        if (_user) {
            app.locals.user = _user
        }

        return next()
    })

    // -------------  API  --------------------

    // movie addMovie
    app.post('/v1/movies/addMovie', Movie.preSave, Movie.addMovie);

    // movie add & update 
    app.post('/v1/movies/updateMovie', multipartMiddleware, Movie.preSave, Movie.updateMovie);

    // movie delete 
    app.delete('/v1/movies/deletMovie', Movie.deletMovie)

    // book addd & update 
    app.post('/v1/books/updateBook', multipartMiddleware, Book.preSave, Book.updateBook);

    // book delete 
    app.delete('/v1/books/deletBook', Book.deletBook)
 
    // software add & update 
    app.post('/v1/softwares/updateSoftware', multipartMiddleware, Software.preSave, Software.updateSoftware);

    // software delete 
    app.delete('/v1/softwares/deletSoftware', Software.deletSoftware);

    // product add & update
    app.post('/v1/product/updateProduct', multipartMiddleware, Product.preSave, Product.updateProduct);

    // user signIn
    app.post('/v1/user/signIn', User.signIn)

    app.post('/v1/user/regist', User.addUser)

    // user logout
    app.get('/logout', function (req, res) {
        User.logout(req, res, app)
    })

    // ---------  user view page   --------------------

    // //index page
    app.get('/', Index.index);

    // movies list
    app.get('/moviesList', Movie.movieListPage)

    // movie detail page
    app.get('/movie/:id', Movie.movieDetailPage)

    // books list
    app.get('/booksList', Book.bookListPage)

    // book detail page
    app.get('/book/:id', Book.bookDetailPage)

    // softwares list
    app.get('/softwaresList', Software.softwareListPage)

    // software detail page
    app.get('/software/:id', Software.softwareDetailPage)

    // product list
    app.get('/productList', Product.productListPage)

    // product detail page
    app.get('/product/:id', Product.productDetailPage)

    // user center page 
    app.get('/userCenter', User.userCenterPage)

    app.get('/signIn', User.signInPage)

    app.get('/regist', User.registPage)

    // ----------- admin manage page ------------------

    // movie admin add page
    app.get('/admin/addMovie', User.signInRequired, User.adminRequired, Movie.addMoviePage);

    // movie admin update movie page
    app.get('/admin/updateMovie/:id', User.signInRequired, User.adminRequired, Movie.updateMoviePage);

    // movie admin list page
    app.get('/admin/moviesList', User.signInRequired, User.adminRequired, Movie.adminMovieList)

    // book admin add page
    app.get('/admin/addBook', User.signInRequired, User.adminRequired, Book.addBookPage);

    // book admin update book page
    app.get('/admin/updateBook/:id', User.signInRequired, User.adminRequired, Book.updateBookPage);

    // book admin list page
    app.get('/admin/booksList', User.signInRequired, User.adminRequired, Book.adminBookList)

    // software admin add page
    app.get('/admin/addSoftware', User.signInRequired, User.adminRequired, Software.addSoftwarePage);

    // software admin update software page
    app.get('/admin/updateSoftware/:id', User.signInRequired, User.adminRequired, Software.updateSoftwarePage);

    // software admin list page
    app.get('/admin/softwaresList', User.signInRequired, User.adminRequired, Software.adminSoftwareList)

    // product admin add page
    app.get('/admin/addProduct', Product.addProductPage)

    // product admin list page
    

    // user signUp page
    app.get('/user/signUp', User.signUp)

    // -----------  superAdmin manage page  --------------
    app.get('/admin/userList', User.signInRequired, User.adminRequired, User.getUserList)

    // ----------- function ---------------
    app.get('/download', Download.download)

}