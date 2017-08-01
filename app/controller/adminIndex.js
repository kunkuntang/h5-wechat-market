var User = require('../models/user')
var Product = require('../models/product')

exports.adminPCIndex = function(req, res){
    var page = req.params.page
    console.log(page)
    
    renderPage(page, function(pageData) {
        console.log(pageData)
        res.render('pcAdmin/' + page, {
            layout: 'pcLayout',
            // data: getPageData(page)
            data: pageData
        })
    })
    
    
}

function renderPage(page, fn) {
    switch (page) {
        case 'index': {
            fn()
            break;
        }
        case 'userManger': {
            User.fetch(function(err, users) {
                if (err) {
                    console.log(err)
                } else {
                    fn(users)
                }
            })
            break;
        }
        case 'productManger': {
            Product.fetch(function(err, products) {
                if (err) {
                    console.log(err)
                } else {
                    fn(products)
                }
            })
            break;
        }
        case 'productAdd': {
            fn()
        }
    }
}

exports.adminPCUser = function(req, res) {
    res.render('pcAdmin/index', {
        layout: 'pcLayout',
        productData: 'jj'
    })
}
