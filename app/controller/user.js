var User = require('../models/user')

// -------------  API  --------------------

// signUp
exports.signUp = function (req, res) {
    var userObj = req.body
    console.log('userObj', userObj)
    var _user = new User({
        name: userObj.username,
        password: userObj.password,
        role: userObj.role || 1,
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
                flag: 1 // success
            })
        }
    });
};

// signIn
// flag: 
// 0: user name or password is incorrect
// 1: sign in success
// 2: user name is not exit
exports.signIn = function(req, res) {
    var name = req.body.username
    var password = req.body.password

    User.findOne({name: name}, function(err, user) {
        if (err) {
            console.log(err)
        }

        // if (user) {
        //     return res.redirect('/')
        // }
        console.log('user: ', user)
        if (user) {
            user.comparePassword(password, function (err, isMatch) {
                if (err) {
                    console.log(err)
                }

                if (isMatch) {
                    console.log('password is matched')
                    req.session.user = user
                    res.send({
                        flag: 1
                    })
                } else {
                    console.log('password is not matched')
                    res.send({
                        flag: 0,
                        mes: 'password is incorrect!'
                    })
              
                }
            })
        } else {
            console.log('user name is not exits')
            res.send({
                flag: 2,
                mes: 'user name is not exit'
            })
        }
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

exports.adminPCRequired = function(req, res, next) {
    var user = req.session.user

    if (user.role < 10 ) {
        return res.redirect('/admin/login')
    }

    next()
}

// pc login API
exports.adminPCLogin = function(req, res) {
    var name = req.body.name
    var password = req.body.password

    User.findOne({name: name}, function(err, user) {
        if (err) {
            console.log(err)
        }
        
        console.log('user: ', user)
        if (user) {
            if (user.role >= 110) {
                user.comparePassword(password, function (err, isMatch) {
                    if (err) {
                        console.log(err)
                    }

                    if (isMatch) {
                        console.log('password is matched')
                        req.session.user = user
                        res.send({
                            flag: 1
                        })
                    } else {
                        console.log('password is not matched')
                        res.send({
                            flag: 0,
                            mes: 'password is incorrect!'
                        })
                
                    }
                })
            } else {
                console.log('user name is not exits')
                res.send({
                    flag: 3,
                    mes: 'user is required logined as admin'
                })
            }
        } else {
            console.log('user name is not exits')
            res.send({
                flag: 2,
                mes: 'user name is not exit'
            })
        }
    })
}

// ------------ page --------------

exports.userCenterPage = function(req, res) {
    res.render('userCenter', {
        title: 'user center',
        user: req.session.user
    })
}

exports.adminPCLoginPage = function(req, res) {
    res.render('pcAdmin/login', { layout: 'pcLayout' })
}