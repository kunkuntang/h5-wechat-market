var fs = require('fs')
var path = require('path')
var Product = require('../models/product');

exports.imgUpload = function(req, res) {
    var imgData = req.body.imgData
    var isNew = req.body.isNew
    var posterData = req.files.imgData

    if (!posterData) return

    console.log('imgData', imgData)
    console.log('posterData', posterData)
    console.log('posterData.length;', posterData.length)

    var posterLength = posterData.length || 1
    var posterArr = []

    for(i = 0; i < posterLength; i++) {
        var item = posterData[i] || posterData
        console.log(item)
        var originalFilename = item.originalFilename
        var filePath = item.path
        if (originalFilename) {
            console.log(filePath)
            var data = fs.readFileSync(filePath)
            var timeStamp = Date.now()
            var type = item.type.split('/')[1]
            var poster = timeStamp + '.' + type
            posterArr.push(poster)
            var imgPath = path.join(__dirname + '/../../public/uploadPoster/' + poster)

            console.log(i)
            console.log(posterLength)

            try {
                fs.writeFile(imgPath, data)
                if ( i === (posterLength - 1)) {
                    console.log('fellback')
                    res.send({
                        code: 1,
                        posterArr: posterArr,
                        mes: 'upload success!'
                    })
                }
            } catch (error) {
                res.send({
                    code: 0,
                    mes: 'upload fail!'
                })
            }
                
        }
    }

    // posterData.forEach(function(item, idx) {
    //     var originalFilename = item.originalFilename
    //     var filePath = item.path
    //     if (originalFilename) {
    //         console.log(filePath)
    //         fs.readFile(filePath, function(err, data) {
    //             var timeStamp = Date.now()
    //             var type = item.type.split('/')[1]
    //             var poster = timeStamp + '.' + type
    //             var imgPath = path.join(__dirname + '/../../public/uploadPoster/' + poster)

    //             fs.writeFile(imgPath, data, function(err) {
    //                 if (err) {
    //                     console.log(err)
    //                     req.poster = '/public/img/poster.jpg'
    //                 } else {
    //                     if ( idx === (posterData.length - 1) ) {
    //                         res.send({
    //                             flag: 1,
    //                             mes: 'upload success!'
    //                         })
    //                     }
    //                 }
    //             })
    //         })
    //     }
    // })
        

    // imgData.forEach(function(item, idx) {
    //     //过滤data:URL
    //     var base64Data = item.replace(/^data:image\/\w+;base64,/, "");
    //     var dataBuffer = Buffer.from(base64Data, 'base64');
    //     var imgPath = path.join(__dirname + '/../../public/uploadPoster/')
    //     var imgName = Date.now() + '.png'

    //     fs.writeFileSync(imgPath + imgName, dataBuffer);
    //     if ( idx === imgData.length ) {
    //         res.send({
    //             flag: 1,
    //             mes: 'upload success!'
    //         })
    //     }
    // })
}
