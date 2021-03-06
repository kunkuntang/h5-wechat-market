var mongoose = require('mongoose')
var bcrypt =  require('bcrypt')

var SALT_WORK_FACTOR = 10

var UserSchema = new mongoose.Schema({
	name: {
		unique: true,
		type: String
	},
	password: String,
	// 1 normal user
	// 10 admin user
	// 110 super user
	role: {
		type: Number,
		default: 1
	},
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

UserSchema.pre('save', function(next) {
	var user = this
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now()
	} else {
		this.meta.updateAt = Date.now()
	}

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) return next(err)

		console.log('salt', salt)
		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return next(err)

			console.log('hash: ', hash)
			console.log('user: ', user)
			user.password = hash
			console.log('user: ', user)
			
			next()
		})
	})

	// next()
})

UserSchema.methods = {
	comparePassword: function(_password, cb) {
		bcrypt.compare(_password, this.password, function(err, isMatch) {
			if (err) return cb(err)
			
			console.log('isMatch: ', isMatch)
			cb(null, isMatch)
		})
		// cb(null, _password === this.password)
	}
}

UserSchema.statics = {
	fetch: function(cb) {
		return this.find({}).sort('meta.updateAt').exec(cb)
	},
	findById: function(id, cb) {
		return this.findOne({_id: id}).sort('meta.updateAt').exec(cb)
	}
}

module.exports = UserSchema