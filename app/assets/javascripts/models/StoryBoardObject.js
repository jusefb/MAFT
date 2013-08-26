var StoryBoardObject = Backbone.Model.extend({
    default: {
        'type': '',
        'parent_title': null
    },
//     url: function(projectId){
//         var mainUrl = '/story_board/get_project_tasks/';
//         return mainUrl + projectId;
//     }
    initialize: function(){
        var currentModel = this;
        this.on('change', function(){
            currentModel.onModelChanged();
        });
    },
    events: {
        'change': 'onModelChanged'
    },
    url: '/story_board',
    onModelChanged: function(){
    }
});
