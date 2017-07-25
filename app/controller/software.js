var Software = require('../models/software');

var fs = require('fs')
var path = require('path')
var _ = require('underscore')

// ---------  Page   --------------------

// user softwares list page
exports.softwareListPage = function(req, res) {
    Software.fetch(function(err, softwareList) {
        if (err) {
            console.log(err)
        } else {
            res.render('software/softwaresList', {
                title: 'Software List',
                softwares: softwareList
            })
        }
    })
}

// user software detail page
exports.softwareDetailPage = function (req, res) {
    var id = req.params.id;
    console.log(id)
    Software.findById(id, function (err, software) {
        if (err) {
            console.error(err)
        } else {
            console.log('result', software)
            res.render('software/softwareDetail', {
                title: '图书 详情页',
                software: software
            })
        }

    })
}

// admin manage softwares page
exports.adminSoftwareList = function(req, res) {
    Software.fetch(function(err, softwareList) {
        console.log('softwareList', softwareList)
        if (err) {
            console.log(err)
        } else {
            res.render('software/adminSoftwaresList', {
                title: 'Software List',
                softwares: softwareList
            })
        }
    })
}

// admin add software page
exports.addSoftwarePage = function (req, res) {
    res.render('software/updateSoftware', {
        title: '图书 后台录入页',
        software: {
            name: '',
            company: '',
            year: '',
            poster: '',
            src: ''
        }
    })
};

// admin update software page
exports.updateSoftwarePage = function (req, res) {
    var id = req.params.id;

    if (id) {
        Software.findById({_id: id}, function (err, software) {
            console.log('software', software)
            res.render('software/updateSoftware', {
                title: '图书 后台更新页',
                software: software
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

// addd & update software
exports.updateSoftware = function (req, res) {
    console.log(req.body)
    var id = req.body.software._id;
    var softwareObj = req.body.software

    // var ftpAdd = 'ftp://10.3.5.110/xkFTP/softwares'
    var ftpAdd = 'http://125.216.145.57:9080/download?resource='
    var category = 'softwares/'
    var _software

    if (req.poster) {
        softwareObj.poster = req.poster
    }

    console.log(softwareObj.src)
    if (softwareObj.src && softwareObj.src.indexOf(category) === -1) {
        softwareObj.src = category + softwareObj.src
    }

    if (softwareObj.src && softwareObj.src.indexOf(ftpAdd) === -1) {
        softwareObj.src = ftpAdd + softwareObj.src
    }

    console.log(softwareObj.src)
    // softwareObj.video = ftpAdd + category + softwareObj.video

    if (id !== 'undefined') {
        Software.findById(id, function (err, software) {
            if (err) {
                console.error(err)
            } else {
                _software = _.extend(software, softwareObj)
                _software.save(function (err, software) {
                    if (err) {
                        console.error(err)
                    } else {
                        res.redirect('/software/' + software.id)
                    }
                })
            }

        })
    } else {
        _software = new Software({
            company: softwareObj.company,
            name: softwareObj.name,
            year: softwareObj.year,
            poster: softwareObj.poster,
            src: softwareObj.src
        })
        _software.save(softwareObj, function (err, software) {
            if (err) {
                console.error(err)
            } else {
                res.redirect('/software/' + software.id);
            }
        });
    }
};

// delete software
exports.deletSoftware = function (req, res) {
    var id = req.query.id;
    console.log(id)
    if (id) {
        console.log('deleting')
        Software.remove({_id: id}, function(err, software) {
            if (err) {
                console.log(err)
            } else {
                res.json({success: 1})
            }
        })
    }
}