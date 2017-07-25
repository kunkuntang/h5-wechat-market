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
            console.error(err)
        } else {
            res.redirect('/signIn');
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
                return res.redirect('/')
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
    res.render('login', {
        layout: null
    })
}

exports.logout = function(req, res, app) {
    delete req.session.user
    delete app.locals.user

    res.redirect('/')
}

exports.registPage = function(req, res) {
    res.render('regist', { layout: null })
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