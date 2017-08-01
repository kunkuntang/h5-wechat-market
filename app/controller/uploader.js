var fs = require('fs')
var path = require('path')
var Product = require('../models/product');

exports.imgUpload = function(req, res) {
    var imgData = req.body.imgData
    var isNew = req.body.isNew
    var posterData = req.files.imgData

    console.log(imgData)
    console.log(posterData)

    // imgData.forEach(function(item, idx) {
    //     //过滤data:URL
    //     var base64Data = item.replace(/^data:image\/\w+;base64,/, "");
    //     var dataBuffer = Buffer.from(base64Data, 'base64');
    //     var imgPath = path.join(__dirname + '/../../public/uploadPoster/')
    //     var imgName = Date.now() + '.png'

    //     Product.save
    //     fs.writeFileSync(imgPath + imgName, dataBuffer);
    // })
}
