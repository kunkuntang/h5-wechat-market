var multipart = require('connect-multiparty')
var multipartMiddleware = multipart()

var Index = require('../controller/index')
var AdminIndex = require('../controller/adminIndex')
var Movie = require('../controller/movie')
var Book = require('../controller/book')
var User = require('../controller/user')
var Software = require('../controller/software')
var Download = require('../controller/download')
var Product = require('../controller/product')
var Order = require('../controller/order')

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

    // product add & update
    app.post('/v1/product/updateProduct', multipartMiddleware, Product.preSave, Product.updateProduct);

    // place order 
    app.post('/v1/order/placeOrder', Order.placeOrder)

    // user signIn
    app.post('/v1/user/signIn', User.signIn)

    app.post('/v1/user/regist', User.signUp)

    // user logout
    app.get('/logout', function (req, res) {
        User.logout(req, res, app)
    })

    // ---------  user view page   --------------------

    // //index page
    app.get('/', Index.index);

    // product list
    app.get('/productList', Product.productListPage)

    // product detail page
    app.get('/product/:id', Product.productDetailPage)

    // user center page 
    app.get('/userCenter', User.userCenterPage)

    // user orderList page
    app.get('/orderList', Order.orderListPage)

    // user order detail page
    app.get('/order/orderDetail/:id', Order.orderDetailPage)

    app.get('/signIn', User.signInPage)

    app.get('/regist', User.registPage)

    // ----------- admin manage page ------------------


    // product admin add page
    app.get('/admin/addProduct', Product.addProductPage)

    // product admin list page
    

    // user signUp page
    app.get('/user/signUp', User.signUp)


    // ----------- PC superAdmin api  --------------
    app.post('/v1/admin/userLogin', User.adminPCLogin)

    // ----------- PC superAdmin manage page  --------------
    app.get('/admin/PC/:page', User.signInRequired, User.adminRequired, AdminIndex.adminPCIndex)

    // app.get('/admin/mangerUserPC', User.signInRequired, User.adminRequired, AdminIndex.adminPCUser)

    app.get('/admin/login', User.adminPCLoginPage)

    app.get('/admin/userList', User.signInRequired, User.adminRequired, User.getUserList)

}