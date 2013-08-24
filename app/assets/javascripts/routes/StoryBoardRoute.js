var StoryBoardRoute = Backbone.Router.extend({
    sb: {
        views: [],
        projectId: ''
    },
    routes:{
        '': 'initRoute',
        'index': 'index',
        'new': 'newObject',
        'new/:object_id': 'newObject',
        'update/:model_id': 'updateObject',
        'view_linked_tasks/:model_id' :'viewLinkedTasks',
        'change_status/:model_id': 'changeStatus',
        'search/:search_criteria': 'searchObjects',
        'show_task/:model_id': 'showTask',
        'delete_sbo/:model_id': 'deleteTask',
        'init_route/:render_index': 'initRoute'
    },
    //this functiona is using for intialising the global collection and it events
    initRoute: function(renderIndex){
        var cv = this;
        this.sb.projectId = $('#project-id').val();

        $.ajax({
            async: false,
            url: '/story_board/get_form_objects',
            type: 'POST',
            success: function(data){
                cv.sb.sboFormObjects = data;
                cv.sb.allowEdit = true;
            }
        });

        this.sb.SbObjectCollection = new StoryBoardCollection();
        this.sb.SbObjectCollection.options = {
            projectId: this.sb.projectId,
            model: StoryBoardObject
        };
        this.sb.SbObjectCollection.fetch({
            async: false,
            success: function(){
                //StoryB.Router.index();
            },
            error: function(error){
                console.log(error);
            }
        });

        //bind events
        this.sb.SbObjectCollection.bind('add', this.addObjectToStage);
        this.sb.SbObjectCollection.bind('add', this.sb.SbObjectCollection.onAddObject);
        this.sb.SbObjectCollection.bind('change:[order]', this.triggerReorderSbo);

        this.index();
    },
    index: function(){
        var view = this.getView("StoryBoardHomeView", {
            el: '#main-content',
            project_id: this.sb.projectId,
            formObjects: this.sb.sboFormObjects,
            collection: this.sb.SbObjectCollection
        });
        view.render();
    },
    newObject: function(object_id){
        var newObjView = this.getView("StoryBoardNewObjView", {
            el: '#sbo-form-container',
            project_id: this.sb.projectId,
            formObjects: this.sb.sboFormObjects,
            collection: this.sb.SbObjectCollection
        });

        newObjView.options.parentTaskId = object_id;
        newObjView.render();

        return newObjView;
    },
    updateObject: function(model_id){
        var thisModel = this.sb.SbObjectCollection.get(model_id);
        var view = this.getView("StoryBoardEditObjView", {
            el: '#main-content',
            formObjects: this.sb.sboFormObjects,
            model: thisModel
        });
        view.model = thisModel;
        view.render();
        Backbone.history.navigate('', {trigger: false, replace: true});
    },
    changeStatus: function(model_id){
        var thisModel = this.sb.SbObjectCollection.get(model_id);
        var view = this.getView("StoryBoardEditObjView", {
            el: '#main-content',
            formObjects: this.sb.sboFormObjects,
            model: thisModel
        });
        view.model = thisModel;
        view.renderChangeStatus();
        Backbone.history.navigate('', {trigger: false, replace: true});
    },
    getView: function(viewName, options){
        try{
            var view = null;
            if(this.sb.views[viewName]){
                view = this.sb.views[viewName];
            }else{
                view = new window[viewName](options);
                this.sb.views[viewName] = view;
            }

            return view;
        }
        catch(e){
            var errorMessage = "The view " + viewName + " does not exist";
            console.log(errorMessage);
            return errorMessage;
        }
    },
    triggerReorderSbo: function(model, value, options){
        var view = this.sb.views["StoryBoardHomeView"];
        view.reorderSbObjects(model, value);
    },
    viewLinkedTasks: function(sbo_id){
        var view = this.sb.views["StoryBoardHomeView"];
        view.displayLinkedSbo(sbo_id);
        Backbone.history.navigate('', {trigger: false});
    },
    searchObjects: function(search_criteria){
        var view = this.sb.views['StoryBoardHomeView'];
        view.findObjects(search_criteria);
    },
    showTask: function(model_id){
        var view = this.sb.views["StoryBoardHomeView"];

        if(view == null){
            this.initRoute();
            view = this.sb.views["StoryBoardHomeView"];
            view.showTask(model_id);
        }else
            view.showTask(model_id);
    },
    deleteTask: function(model_id){
        var view = this.sb.views['StoryBoardHomeView'];
        view.deleteTask(model_id);
    }
});