var StoryB = {};

StoryB.init = function(){
    this.Router =  new StoryBoardRoute();
    this.Router.sb = this;
    this.projectId = $('#project-id').val();
    this.views = [];

    $(document).on('click','#sb-content a', function(ev){
        ev.preventDefault();
        var elem = $(this);
        var href = elem.attr('href');
        Backbone.history.navigate(href,{trigger: true});
    });

    $(window).on('resize', function(){
        var viewHelpers = new ViewHelpers();
        viewHelpers.adjustStageColWidth();
    });

    try{
        Backbone.history.start({pushState: true, root: '/story_board/index/' + this.projectId});
    }catch(ex){}


    return this;
};

$(function(){
  //get the list of tasks for the current project
  var storyBoard = StoryB.init();

});