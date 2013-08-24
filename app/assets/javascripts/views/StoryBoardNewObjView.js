var StoryBoardNewObjView = Backbone.View.extend({
    options: {
        template: '',
        templateUrl: '/assets/templates/story_board_object_form.html'
    },
    events: {
        'click #sbo-form-save': 'createObject',
        'click #sbo-form-cancel': 'closeForm'
    },
    initialize: function(){
        this.viewHelpers = new ViewHelpers();
        this.options.template = this.viewHelpers.getTemplate(this.options.templateUrl);
    },
    render: function(){
        var formControls = '<input id="sbo-form-save" type="submit" value="Save"/>' +
            '<input id="sbo-form-cancel" type="reset" value="Cancel"/>';
        var newModel = new StoryBoardObject({
            project_id: this.options.project_id
        });

        this.model = newModel;

        var html = _.template(this.options.template, {
            controls: formControls,
            formObjects: this.options.formObjects,
            model: this.model
        });
        this.$el.html(html).fadeIn();
        this.delegateEvents();
     },
    createObject: function(){
        var cv = this;
        var newObjectForm = this.$el.find('form[name="sbo-new-form"]');
        var newObject = newObjectForm.serializeArray();

        //TODO: put this into a celebrate function under ModelHelpers
        $.map(newObject, function(n, i){
            cv.model.set(n['name'], n['value']);
        });

        //we need to set the order based on the maximum value of the current order
        var stage = this.model.get('stage');
        var orderValue = this.viewHelpers.getMaxOrderForStage(stage) + 1;
        this.model.set('obj_order', orderValue);

        //we need to link the parent task if it has been provided
        if(this.options.parentTaskId)
            this.model.set('parent_task_id', this.options.parentTaskId);

        var saveRequest = this.model.save({}, {
            success: function(data){
                if(data.get('error'))
                    cv.displayErrors(data.get('messages'));
                else{
                    cv.collection.add(cv.model);
                    cv.$el.hide();
                    Backbone.history.navigate('index', {trigger: true});
                    Backbone.history.navigate('', {trigger: true});
                    cv.viewHelpers.resizeStageContainers();
                }
                return false;
            },
            error: function(data){
                console.log('Could not send request');
                return false;
            }
        });
        return false;
    },
    displayErrors: function(errors){
        var cv = this;
        cv.$el.find('.form-error').remove();
        _.each(errors, function(value, key){
            $('<span class="form-error">' + key + ' ' + value + '</span>').insertAfter(cv.$el.find('input[name="'+ key + '"]'));
        });
    },
    closeForm: function(){
        this.$el.hide();
        Backbone.history.navigate('', {trigger: true});
    }
});