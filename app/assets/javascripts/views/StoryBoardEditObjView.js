var StoryBoardEditObjView = Backbone.View.extend({
    options: {
        templateUrl: '/assets/templates/story_board_object_form.html',
        updateUrl: '/story_board',
        formObjects: {}
    },
    viewHelpers: {},
    colHeights: {}, //object collecting the information about contianer heights to allow resizing
    events: {
        'click .hide-edit-form': 'hideView',
        'click .sbo-edit-save': 'updateObject',
        'change .change_status': 'updateObject'
    },
    initialize: function(){
        this.viewHelpers = new ViewHelpers();
        this.template =  this.viewHelpers.getTemplate(this.options.templateUrl);
        this.origStageConHeight = this.$el.find('#sbo-container > div').height();
    },
    setStageContainer: function(){
        var stageName = (this.model.get('stage')) ? this.model.get('stage') : 'current';
        this.stageContainer =  this.$el.find('#' + stageName.toLowerCase());
    },
    render: function(){
        this.setStageContainer();
        var formControls = '<input id="sbo-edit-save-' + this.model.get('id') + '" class="sbo-edit-save button small secondary radius" type="submit" value="Save" />&nbsp;' +
            '<input id="sbo-edit-cancel-' + this.model.get('id') + '" class="hide-edit-form button small secondary radius" type="reset" value="Cancel"/>';
        var html = _.template(this.template, {
            model: this.model,
            formObjects: this.options.formObjects,
            controls: formControls
        });
        this.showView(html);
    },
    renderChangeStatus: function(){
        //this.setStageContainer();

        var show = this.$el.find('#sbo-edit-form-' + this.model.get('id')).is(':visible');
        if(!show){
            this.statusTemplate =  this.viewHelpers.getTemplate('/assets/templates/story_board_object_change_status.html');
            var html = _.template(this.statusTemplate, {
                model: this.model,
                formObjects: this.options.formObjects
            });
            this.showView(html);
        }else
            this.hideView();
    },
    hideView: function(){
        this.$el.find('#sbo-edit-form-' + this.model.get('id')).hide();
        Backbone.history.navigate('', {trigger: true});

        this.viewHelpers.resizeStageContainers();
    },
    showView: function(html){

        this.$el.find('.more-info-pt').hide();
        this.$el.find('.sbo-stage-row').removeClass('linked-task');
        this.$el.find('div.edit-form').unbind().remove();

        var form = this.$el.find('#sbo-edit-form-' + this.model.get('id'));
        form.html(html);
        form.foundation('forms');
        form.fadeIn();

        this.viewHelpers.resizeStageContainers();
        this.viewHelpers.renderDates();
    },
    updateObject: function(){
        var cv = this;

        var updateObjectForm = this.$el.find('form');
        var updateObject = updateObjectForm.serializeArray();

        //TODO: put this into a celebrate function under ModelHelpers
        $.map(updateObject, function(n, i){
            cv.model.set(n['name'], n['value']);
        });

        this.model.save({},{
            url: this.options.updateUrl + '/' + this.model.get('id'),
            type: 'PUT',
            success: function(data){
                cv.hideView();
                Backbone.history.navigate('index', {trigger: true, replace: true});
                Backbone.history.navigate('', {replace: true});
                cv.viewHelpers.resizeStageContainers();
            },
            error: function(errors){
                alert('Could not update');
                cv.displayErrors(errors);
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
    updateOrder: function(direction, nOfSteps){
        var currentOrder = this.model.get('obj_order')
        switch(direction){
            case "up":
                this.model.set('obj_order', currentOrder + nOfSteps);
                break;

            case "down":
                if((currentOrder) >= nOfSteps)
                    this.model.set('obj_order', currentOrder - nOfSteps);
                break;
        }
    }
});