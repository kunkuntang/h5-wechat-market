var should = require('should')
var app = require('../../app')
var mongoose = require('mongoose')
var Book = require('../../app/models/book')

var book

// test
describe('<Unit Test', function () {
	describe('Model Book', function () {
		before(function (done) {
			book = {
				author: 'a',
				name: 'b',
				poster: 'en',
				publisher: 'en',
				summary: 'test',
				src: 'test',
			}

            done()
        })

		describe('Before Method save', function (done) {
			it('should begin without test book', function (done) {
				Book.find({ name: book.name }, function (err, books) {
					books.should.have.length(0)

					done()
				})
			})
		})

		describe('Book save', function () {
			it('should save without problem', function (done) {
				var _book = new Book(book)
				_book.save(function (err) {
					should.not.exist(err)
					_book.remove(function(err) {
						should.not.exist(err)

						done()
					})
				})
			})

			
		})
	})
})