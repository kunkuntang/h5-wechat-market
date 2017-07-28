var Order = require('../models/order');

var fs = require('fs')
var path = require('path')
var _ = require('underscore')

// ----------- page ------------

// orderList page
exports.orderListPage = function(req, res) {
    Order.fetch(function(err, orderList) {
        if (err) {
            console.log(err)
        } else {
            res.render('order/orderList', {
                layout: 'noFooter',
                orderList: orderList
            })
        }
    })
}

// order detail page
exports.orderDetailPage = function(req, res) {
    var id = req.params.id;
    console.log(id)
    Order.findById(id, function(err, orderItem) {
        if (err) {
            console.error(err)
        } else {
            console.log('result', orderItem)
            res.render('order/orderDetail', {
                layout: 'noFooter',
                order: orderItem
            })
        }
    })
}

// -------------  API  --------------------

// place an order 
exports.placeOrder = function(req, res, next) {
    console.log(req.body)
    var orderObj = req.body
    var user = req.session.user

    var _order
    _order = new Order({
        userId: user.id,
        productId: orderObj.productId,
        productName: orderObj.productName,
        productNum: orderObj.productNum,
        prodcutCate: orderObj.cate,
        address: orderObj.address,
        remark: orderObj.remark,
        status: 0
    })
    _order.save(orderObj, function (err, order) {
        if (err) {
            console.error(err)
        } else {
            res.redirect('/order/orderDetail/' + order.id);
        }
    });
}