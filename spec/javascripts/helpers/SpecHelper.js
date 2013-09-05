beforeEach(function () {
    this.addMatchers({
        toBePlaying: function (expectedSong) {
            var player = this.actual;
            return player.currentlyPlayingSong === expectedSong
                && player.isPlaying;
        }
    });

    this.validResponse = function (responseText) {
        return [
            200,
            {"Content-Type": "application/json"},
            JSON.stringify(responseText)
        ];
    };

    /* This will mark the test as unimplemented */
    this.unimplementedTest = function(){
        var description = this.description;
        this.finish(function(){
            $('a.description:contains(' + description + ')').css('color', '#FFBF00');
        });
    };

    this.getJQuerySpySelector = function(spyObj){
        return spyObj.mostRecentCall.object.selector;
    };
});

//$(function(){
//    var jsFilesToCover = ['StoryBoardCollection', 'StoryBoardRoute', 'StoryBoardNewObjView', 'StoryBoardEditObjView', 'StoryBoardHomeView'];
//    //var jsFilesToCover = ['StoryBoardHomeView'];
//    var headlast = $('head').children().last();
//    $('script[src*="blanket.min.js"]').remove();
//
//    $('<script src="/__spec__/helpers/blanket.min.js" data-cover-adapter="/__spec__/helpers/jasmine-blanket.js"></script>');
//    _.each(jsFilesToCover, function(file){
//        var el = $('script[src*="' + file + '.js"]');
//        var src = el.attr('src');
//        el.remove();
//
//        $('<script type="text/javascript" src="' + src + '" data-cover></script>').insertAfter(headlast);
//    });
//});
