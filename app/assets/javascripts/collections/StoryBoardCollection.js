var StoryBoardCollection = Backbone.Collection.extend({
    options: {
        updateUrl: '/story_board'
    },
    url: function(){
        return '/story_board/get_project_tasks/' + this.options.projectId
    },
    initialize: function(){

    },
    save: function(){

    },
    onAddObject: function(model){
        var linkedTasks = null;
        if(this.length > 0){
            linkedTasks = _.where(this.toJSON(), { 'parent_task_id': model.id});

            if(linkedTasks && linkedTasks.length > 0)
                model.set('linked_tasks', linkedTasks);
            else
                model.set('linked_tasks', null);
        }
    }
});
