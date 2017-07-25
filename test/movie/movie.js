var should = require('should')
var app = require('../../app')
var mongoose = require('mongoose')
var Movie = require('../../app/models/movie')

var movie

// test
describe('<Unit Test', function () {
	describe('Model Movie', function () {
		before(function (done) {
			movie = {
				doctor: 'a',
				title: 'b',
				language: 'en',
				country: 'en',
				summary: 'test'
			}

            done()
        })

		describe('Before Method save', function (done) {
			it('should begin without test movie', function (done) {
				Movie.find({ title: movie.title }, function (err, movies) {
					movies.should.have.length(0)

					done()
				})
			})
		})

		describe('Movie save', function () {
			it('should save without problem', function (done) {
				var _movie = new Movie(movie)
				_movie.save(function (err) {
					should.not.exist(err)
					_movie.remove(function(err) {
						should.not.exist(err)

						done()
					})
				})
			})

			
		})
	})
})