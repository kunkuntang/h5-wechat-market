$(function() {
    $('.del').click(function(e) {
        var target = $(e.target)
        var id = target.data('id')
        var tr = $('.item-id-' + id)

        $.ajax({
            type: 'DELETE',
            url: '/v1/movies/deletMovie?id=' + id
        }).done(function(res) {
            if (res.success === 1) {
                if (tr.length > 0) {
                    tr.remove()
                }
            }
        })
    })

    $('#syncDouBan').click(function(e) {
        var id = $('#DouBanInput').val()

        if (id) {
            $.ajax({
                url: 'https://api.douban.com/v2/movie/subject/' + id,
                cache: true,
                type: 'GET',
                dataType: 'jsonp',
                crossDomain: true,
                jsonp: 'callback',
                success: function(data) {
                    $('#inputTitle').val(data.title)
                    $('#inputDoctor').val(data.directors[0].name)
                    $('#inputCity').val(data.countries[0])
                    $('#inputYear').val(data.year)
                    $('#inputPoster').val(data.images.large)
                    $('#inputSummary').val(data.summary)
                    $('#inputLanguage').val(data.languages)
                }
            })
        }
        
    })


    $('#selectVideo').change(function () {
        console.log('change')
        console.log(this.files)
        var files = this.files
        if (files.length) {
            var file = files[0]
            $('#inputVideo').val(file.name)
        }
    })

    // book

    $('.delBook').click(function(e) {
        var target = $(e.target)
        var id = target.data('id')
        var tr = $('.item-id-' + id)

        $.ajax({
            type: 'DELETE',
            url: '/v1/books/deletBook?id=' + id
        }).done(function(res) {
            if (res.success === 1) {
                if (tr.length > 0) {
                    tr.remove()
                }
            }
        })
    })

    $('#syncDouBanBook').click(function(e) {
        var id = $('#DouBanInput').val()

        if (id) {
            $.ajax({
                url: 'https://api.douban.com/v2/book/' + id,
                cache: true,
                type: 'GET',
                dataType: 'jsonp',
                crossDomain: true,
                jsonp: 'callback',
                success: function(data) {
                    $('#inputName').val(data.title)
                    $('#inputAuthor').val(data.author[0])
                    $('#inputPublisher').val(data.publisher)
                    $('#inputYear').val(data.pubdate)
                    $('#inputPoster').val(data.images.large)
                    $('#inputSummary').val(data.summary)
                }
            })
        }
        
    })


    $('#selectBook').change(function () {
        console.log('change')
        console.log(this.files)
        var files = this.files
        if (files.length) {
            var file = files[0]
            $('#inputBook').val(file.name)
        }
    })

    $('.delSoftware').click(function(e) {
        var target = $(e.target)
        var id = target.data('id')
        var tr = $('.item-id-' + id)

        $.ajax({
            type: 'DELETE',
            url: '/v1/softwares/deletSoftware?id=' + id
        }).done(function(res) {
            if (res.success === 1) {
                if (tr.length > 0) {
                    tr.remove()
                }
            }
        })
    })
})