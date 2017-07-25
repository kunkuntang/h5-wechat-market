var mongoose = require('mongoose')
var SoftwareSchema = require('../schemas/software')
var Software = mongoose.model('Software', SoftwareSchema)

module.exports = Software