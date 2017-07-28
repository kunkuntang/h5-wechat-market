var Product = require('../models/product');

var fs = require('fs')
var path = require('path')
var _ = require('underscore')

// ---------  Page   --------------------

// user products list page
exports.productListPage = function(req, res) {
    Product.fetch(function(err, productList) {
        if (err) {
            console.log(err)
        } else {
            res.render('productsList', {
                title: 'Product List',
                productList: productList
            })
        }
    })
}

// user product detail page
exports.productDetailPage = function (req, res) {
    var id = req.params.id;
    console.log(id)
    Product.findById(id, function (err, product) {
        if (err) {
            console.error(err)
        } else {
            console.log('result', product)
            res.render('product/proDetail', {
                layout: 'noFooter',
                title: ' 详情页',
                product: product
            })
        }

    })
}


// admin manage products page
exports.adminProductList = function(req, res) {
    Product.fetch(function(err, productList) {
        console.log('productList', productList)
        if (err) {
            console.log(err)
        } else {
            res.render('product/adminProductsList', {
                title: 'Product List',
                products: productList
            })
        }
    })
}

// admin add product page
exports.addProductPage = function (req, res) {
    res.render('product/proUpdate', {
        layout: 'noFooter',
        title: '图书 后台录入页',
        product: {
            name: '',
            post: '',
            pic: '',
            price: '',
            discount: ''
        }
    })
};

// admin update product page
exports.updateProductPage = function (req, res) {
    var id = req.params.id;

    if (id) {
        Product.findById({_id: id}, function (err, product) {
            console.log('product', product)
            res.render('product/updateProduct', {
                title: '图书 后台更新页',
                product: product
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

// addd & update product
exports.updateProduct = function (req, res) {
    console.log(req.body)
    var id = req.body._id;
    var productObj = req.body

    var ftpAdd = 'http://125.216.145.57:9080/download?resource='
    var category = 'products/'
    var _product

    if (req.poster) {
        productObj.poster = req.poster
    }

    console.log(productObj.src)
    if (productObj.src && productObj.src.indexOf(category) === -1) {
        productObj.src = category + productObj.src
    }

    if (productObj.src && productObj.src.indexOf(ftpAdd) === -1) {
        productObj.src = ftpAdd + productObj.src
    }

    console.log(productObj.src)
    // productObj.video = ftpAdd + category + productObj.video

    if (id) {
        Product.findById(id, function (err, product) {
            if (err) {
                console.error(err)
            } else {
                _product = _.extend(product, productObj)
                _product.save(function (err, product) {
                    if (err) {
                        console.error(err)
                    } else {
                        res.redirect('/product/' + product.id)
                    }
                })
            }

        })
    } else {
        _product = new Product({
            name: productObj.proName,
            post: productObj.post,
            pic: [],
            price: productObj.price,
            discount: productObj.proDisc
        })
        _product.save(productObj, function (err, product) {
            if (err) {
                console.error(err)
            } else {
                res.redirect('/product/' + product.id);
            }
        });
    }
};

// delete product
exports.deletProduct = function (req, res) {
    var id = req.query.id;
    console.log(id)
    if (id) {
        console.log('deleting')
        Product.remove({_id: id}, function(err, product) {
            if (err) {
                console.log(err)
            } else {
                res.json({success: 1})
            }
        })
    }
}