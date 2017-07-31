var Base64 = require('js-base64').Base64;

var Movie = require('../models/movie');

exports.index = function (req, res) {
    console.log('user in session: ')
    console.log(req.session.user)

    renderPage(res)
}

function renderPage (res) {
    res.render('index', {
        title: 'xingkong 首页'
    })
}
