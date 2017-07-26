var User = require('../models/user')

// -------------  API  --------------------

// addUser
exports.addUser = function (req, res) {
    var userObj = req.body
    console.log('userObj', userObj)
    var _user = new User({
        name: userObj.username,
        password: userObj.password
    })
    _user.save(userObj, function (err, user) {
        if (err) {
            console.log(err.code)
            if (err.code === 11000) {// 用户已存在
                res.send({
                    flag: 0,
                    mes: 'user exist, please take an another user name'
                })
            }
        } else {
            console.log('redirect')
            // res.redirect('/userCenter');
            res.send({
                login: 1 // success
            })
        }
    });
};

exports.signUp = function(req, res) {
    var _user = req.body.user
    console.log(_user)

    User.find({name: _user.name}, function(err, user) {
        if (err) {
            console.log(err)
        }
        console.log(user)
        if (user.length) {
            res.redirect('/user/signUp')
        } else {
            var user = new User(_user)
            user.save(function(err, user) {
                if (err) {
                    console.log(err)
                }
                res.redirect('/admin/userList')
            })
        }
    })
}

// signIn
exports.signIn = function(req, res) {
    var name = req.body.name
    var password = req.body.password

    User.findOne({name: name}, function(err, user) {
        if (err) {
            console.log(err)
        }

        if (!user) {
            return res.redirect('/')
        }

        user.comparePassword(password, function (err, isMatch) {
            if (err) {
                console.log(err)
            }

            if (isMatch) {
                console.log('password is matched')
                req.session.user = user
                return res.redirect('/userCenter')
            } else {
                console.log('password is not matched')
            }
        })
    })
}

// ------------------- page ---------------------


// -----------  superAdmin manage page  --------------
exports.getUserList = function(req, res) {
    User.fetch(function(err, users) {
        if (err) {
            console.log(err)
        } else {
            res.render('userList', {
                title: 'user list page',
                users: users
            })
        }
    })
}

exports.signInPage = function(req, res) {
    res.render('signIn')
}

exports.logout = function(req, res, app) {
    delete req.session.user
    delete app.locals.user

    res.redirect('/userCenter')
}

exports.registPage = function(req, res) {
    res.render('regist')
}

exports.signInRequired = function(req, res, next) {
    var user = req.session.user

    if (!user) {
        return res.redirect('/')
    }

    next()
}

exports.adminRequired = function(req, res, next) {
    var user = req.session.user

    if (user.role < 10 ) {
        return res.redirect('/')
    }

    next()
}

// ------------ page --------------

exports.userCenterPage = function(req, res) {
    res.render('user/userCenter', {
        title: 'user center',
        user: req.session.user
    })
}