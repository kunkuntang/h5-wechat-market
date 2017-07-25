var mongoose = require('mongoose')

var BookSchema = new mongoose.Schema({
	author: String,
	name: String,
	poster: String,
	summary: String,
	publisher: String,
	year: String,
	src: String,
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
})

BookSchema.pre('save', function(next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now()
	} else {
		this.meta.updateAt = Date.now()
	}
	next()
})

BookSchema.statics = {
	fetch: function(cb) {
		return this.find({}).sort('meta.updateAt').exec(cb)
	},
	findById: function(id, cb) {
		return this.findOne({_id: id}).sort('meta.updateAt').exec(cb)
	}
}

module.exports = BookSchema