var StoryBoardHomeView = Backbone.View.extend({
    options: {
        templateUrl: '/assets/templates/story_board_object_display.html'
    },
    viewHelpers: {},
    currentHtml: '',
    events: {
        'click .more-info': 'showMoreInfo',
        'keyup #find-objects': 'callFindObjects',
        'search #find-objects': 'callFindObjects',
        'change input.toggle-stage': 'toggleStageCol'
    },
    initialize: function () {
        this.viewHelpers = new ViewHelpers();
        this.options.template = this.viewHelpers.getTemplate(this.options.templateUrl);
    },
    render: function () {
        var html = '';
        var stages = ['Current', 'Backlog', 'Test', 'Future', 'Done'];
        var cv = this;
        var stageObjs = {};

        $.each(stages, function (i, stage) {
            html = '<ul class="sbo-stage" id="' + stage + '-list" data-stage="' + stage + '">';
            stageObjs = _.where(cv.collection.toJSON(), {stage: stage});

            if (stageObjs.length > 0) {
                stageObjs = _.sortBy(stageObjs, 'obj_order');

                if (stageObjs && stageObjs.length > 0) {
                    $.each(stageObjs, function (i, model) {
                        model.title = cv.getDisplayTitle(model);
                        model.linked_tasks = cv.getLinkedTasks(model);
                        html += _.template(cv.options.template, model);
                    });
                }
            }
            html += '</ul>';
            cv.$el.find('#' + stage.toLowerCase()).html(html);
        });
        this.viewHelpers.resizeStageContainers();
        //$.foundation('buttons');

        this.setDraggableSortable();
    },
    showMoreInfo: function (e) {
        e.preventDefault();
        this.$el.find('.sbo-stage-row').removeClass('linked-task');
        this.$el.find('.sbo-edit-from').hide();
        var elemId = $(e.currentTarget).data('objid');
        this.$el.find('#more-info-' + elemId).toggle();
        this.viewHelpers.resizeStageContainers();
    },
    reorderSbObjects: function (event, ui) {
        var cv = this;
        var currentEl = ui.item;

        //get current model data
        var thisModelId = currentEl.data('objid');
        var thisModelOrder = currentEl.data('order');
        var model = this.collection.get(thisModelId);
        var thisModelStage = model.get('stage');

        //get next and prev element data
        var prevElements = currentEl.prevAll();
        var nextElements = currentEl.nextAll();
        var prevEl = $(prevElements[0])
        var nextEl = $(nextElements[0]);
        var prevOrder = prevEl.length > 0 ? prevEl.data('order') : null;
        var nextOrder = nextEl.length > 0 ? nextEl.data('order') : null;
        debugger
        //perform sorting up
        if (nextOrder > thisModelOrder) {
            this.changeElOrder(model, prevElements, 'down');
        } else if (nextOrder < thisModelOrder) { //perform sorting down
            this.changeElOrder(model, nextElements, 'up');
        }

        //save the order of the objects
        var stageModels = new StoryBoardCollection(this.collection.where({stage: thisModelStage}));
        this.saveOrderedCollection(stageModels);

        //navigate back to index page
        Backbone.history.navigate('index', {trigger: true});
        //Backbone.history.navigate('', {trigger: true});
    },
    changeElOrder: function (model, elements, direction) {
        var cv = this;
        var newOrder = elements.length + 1;

        $.each(elements, function (i, el) {
            debugger
            var newOrder = 0;
            var elId = $(el).data('objid');
            var modelToUpdate = cv.collection.get(elId);
            var curOrder = modelToUpdate.get('obj_order');

            if (direction == 'down') {
                modelToUpdate.set('obj_order', newOrder - (i + 1));
            }
            else if (direction == 'up') {
                modelToUpdate.set('obj_order', curOrder + (i + 1));
            }
        });
        model.set('obj_order', newOrder);
    },
    findNextModel: function (collection, currModelId, searchOptions) {
        var model = {};
        var models = collection.where(searchOptions);
        _.each(models, function (obj) {
            if (obj.id !== currModelId) {
                model = obj;
                return false;
            }
        });

        return model;
    },
    setDraggableSortable: function () {
        var cv = this;
        var originalDiv = '';
        _.bindAll(this, 'reorderSbObjects');
        this.$el.find('ul.sbo-stage').droppable({
            drop: function (e, ui) {
                debugger
                var draggableEl = ui.draggable;
                var el = $(this);
                if (el.attr('id') != draggableEl.parent().attr('id')) {
                    var stage = el.data('stage');
                    var modelId = draggableEl.data('objid');
                    var model = cv.collection.get(modelId);
                    var order = cv.$el.find('#' + stage).find('li.sbo-stage-row').length + 1;
                    model.set({
                        'obj_order': order,
                        'stage': stage
                    });
                    model.save({}, {
                        url: '/story_board/' + model.get('id'),
                        type: 'PUT',
                        success: function (data) {
                            Backbone.history.navigate('', {trigger: true});
                        }
                    });

                    return false;
                }
            }
        }).sortable({
                //revert: true
                stop: this.reorderSbObjects
            });

        this.$el.find("ul, li").disableSelection();
    },
    displayLinkedSbo: function (model_id) {
        var taskClass = 'li.' + model_id + '_hasparent';
        var taskEl = this.$el.find(taskClass);
        taskEl.toggleClass('linked-task');
        setTimeout(function () {
            taskEl.toggleClass('linked-task');
        }, 800)
    },
    saveOrderedCollection: function (collection) {
        Backbone.sync('update', collection, {
            url: '/story_board/reorder',
            success: function () {
                console.log('users story board objects synced!');
            },
            error: function () {
                console.log('error')
            }
        });
    },
    updateCollectionStages: function (collection) {
        Backbone.sync('update', collection, {
            url: '/story_board/update',
            success: function () {
                console.log('users story board objects synced!');
            },
            error: function () {
                console.log('error')
            }
        });
    },
    getDisplayTitle: function (model) {
        var typeLabel = '';

        _.each(this.options.formObjects.types, function (obj) {
            if (obj.value == model.type) {
                typeLabel = obj.label;
                return false;
            }
        });

        return model.title + ' (' + typeLabel + ')';
    },
    callFindObjects: function (e) {
        this.$el.find('.validation-errors').remove();
        var searchField = $(e.currentTarget);
        var searchCriteria = searchField.val();
        if (searchCriteria.length >= 3) {
            var foundObjects = this.findObjects(searchCriteria);
            if (foundObjects.length > 0)
                this.renderFoundObjects(foundObjects);
            else
                $('<span class="validation-errors">Nothing found</span>').insertAfter(searchField);
        } else {
            this.$el.find('li.sbo-stage-row').show();
            if (searchCriteria.length > 0) {
                $('<span class="validation-errors">Enter at least three characters</span>').insertAfter(searchField);
                console.log('Enter at least three characters to perform the search');
            }
        }
    },
    findObjects: function (searchCriteria) {
        var searchResult = [];
        //var ajaxRequest = this.makeFindObjectsRequest(searchCriteria);
        //ajaxRequest.done(this.renderFoundObjects);
        var title = '';
        _.each(this.collection.toJSON(), function (model) {
            title = model.title;
            if (title.indexOf(searchCriteria) != -1)
                searchResult.push(model.id);
        });

        return searchResult;
    },
    makeFindObjectsRequest: function (searchCriteria) {
        return $.ajax({
            url: 'story_board/search',
            data: {search_criteria: searchCriteria},
            type: 'POST'
        });
    },
    renderFoundObjects: function (colIds) {
        var cv = this;
        cv.$el.find('li.sbo-stage-row').hide();
        _.each(colIds, function (i) {
            cv.$el.find('#sbo_' + i).show();
        });
    },
    toggleStageCol: function (e) {
        var el = $(e.currentTarget);
        var elId = el.data('stageid');
        var stageEl = this.$el.find('#' + elId);
        stageEl.toggle(el.prop('checked'));
        this.viewHelpers.adjustStageColWidth();
        stageEl.height('100%');
        this.viewHelpers.resizeStageContainers();
    },
    showTask: function (modelId) {
        this.$el.find('.sbo-stage-row').removeClass('sbo-selected');
        var model = this.collection.get(modelId);

        if (model != null) {
            var el = this.$el.find('#sbo_' + modelId);
            el.addClass('sbo-selected');
            this.viewHelpers.scrollToElement(el);
        } else
            alert("This object does not exist");
    },
    deleteTask: function (modelId) {
        var cv = this;
        var currentModel = cv.collection.get(modelId);
        var confirmDelete = window.confirm("Are you sure you want to delete this object");

        if (confirmDelete) {
            $.ajax({
                url: '/story_board/' + modelId,
                method: 'DELETE',
                success: function (data) {
                    cv.collection.remove(currentModel);
                    Backbone.history.navigate('index', {trigger: true, replace: true});
                    Backbone.history.navigate('', {trigger: false, replace: true});
                }
            });
        }
    },
    getLinkedTasks: function (model) {
        var cv = this;
        var linkedTasks = _.where(this.collection.toJSON(), {'parent_task_id': model.id});
        if (linkedTasks.length > 0) {
            linkedTasks = $.map(linkedTasks, function (el) {
                el['title'] = cv.getDisplayTitle(el)
                return el;
            });
        }

        return linkedTasks;
    }
});
