var mongoose = require('mongoose')

var OrderSchema = new mongoose.Schema({
    userId: String,
	productId: String,
	productName: String,
    productNum: Number,
	prodcutCate: Number,
	remark: String,
    status: Number,
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

OrderSchema.pre('save', function(next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now()
	} else {
		this.meta.updateAt = Date.now()
	}
	next()
})

OrderSchema.statics = {
	fetch: function(cb) {
		return this.find({}).sort('meta.updateAt').exec(cb)
	},
	findById: function(id, cb) {
		return this.findOne({_id: id}).sort('meta.updateAt').exec(cb)
	}
}

module.exports = OrderSchema