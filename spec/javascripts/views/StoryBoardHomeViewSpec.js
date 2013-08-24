describe("Story Board Home View", function () {
    var storyBoard = null;
    var testTemplate = '';
    var getTemplateSpy = {};

    beforeEach(function () {
        //set-up data fixtures
        testTemplate = this.fixtures.StoryBoardHomeObjectTemplate;

        //setup the spies
        getTemplateSpy = spyOn(ViewHelpers.prototype, 'getTemplate').andReturn(testTemplate);

        //set-up html fixtures for the view (essentially a fake container for the actual view)
        setFixtures('<div id="main-content">' +
            '<input id="find-objects" type="search" />' +
            '<div id="current"></div>' +
            '<div id="backlog"></div>' +
            '<div id="future"></div>' +
            '</div>');

        storyBoard = new StoryBoardHomeView({
            el: '#main-content',
            collection: new StoryBoardCollection(this.fixtures.StoryBoardCollection)
        });
        storyBoard.options.formObjects = this.fixtures.FormObjects;

    });

    describe("Initialise the StoryBoard", function () {
        it("Gets the individual StoryBoardObject template", function () {
            storyBoard.initialize();
            expect(getTemplateSpy).toHaveBeenCalled();
            expect(storyBoard.options.template).toBe(testTemplate);
        });
    })

    describe("Render StoryBoard View", function () {
        var _templateSpy = null;

        beforeEach(function () {
            _templateSpy = spyOn(_, 'template').andReturn(testTemplate);
            storyBoard.options.template = testTemplate;
            storyBoard.options.formObjects = this.fixtures.FormObjects;
        })

        it("Sorts the list by order", function () {
            var sortSpy = spyOn(_, 'sortBy');

            storyBoard.render();
            expect(sortSpy).toHaveBeenCalled();
        });

        it("Populates the template for each StoryBoardObject stage", function () {
            storyBoard.render();
            expect(_templateSpy.callCount).toBe(storyBoard.collection.models.length);
        });

        it("Fills the 'current' div with the Current StoryBoardObjects", function () {
            storyBoard.render();

            expect(storyBoard.$el.find('#current').length).toBeGreaterThan(0);

        });

        it("Fills the 'backlog' div with the Backlog StoryBoardObjects", function () {
            storyBoard.render();

            expect(storyBoard.$el.find('#backlog').length).toBeGreaterThan(0);
        });

        it("Fills the 'future' div with the Future StoryBoardObjects", function () {
            storyBoard.render();

            expect(storyBoard.$el.find('#future').length).toBeGreaterThan(0);
        });

        it("It resises the stage columns to the size of the heighest column", function () {
            spyOn(ViewHelpers.prototype, 'resizeColumnsToTheHighest');

            storyBoard.render();

            expect(ViewHelpers.prototype.resizeColumnsToTheHighest).toHaveBeenCalled();
        });
    });

    describe("Search StoryBoard", function () {
        var searchField = null;

        beforeEach(function () {
            searchField = storyBoard.$el.find('#find-objects');
        });

        it("Makes a server request to get the ids of StoryBoardObjects based on a search criteria", function () {
            spyOn($, 'ajax');
            var searchCriteria = 'test';
            storyBoard.makeFindObjectsRequest(searchCriteria);
            expect($.ajax).toHaveBeenCalledWith({
                url: 'story_board/search',
                data: {search_criteria: searchCriteria},
                type: 'POST'
            })
        });

        describe("Searches only if more then three characters are entered", function () {
            var makeFindObjectsRequestSpy = {};

            beforeEach(function () {
                spyOn(storyBoard, 'renderFoundObjects');
            });

            it("Calls the search function on change of the search field", function () {
                spyOn(storyBoard, 'callFindObjects');
                storyBoard.render();
                storyBoard.delegateEvents();
                searchField.trigger('keyup');
                expect(storyBoard.callFindObjects).toHaveBeenCalled();

            });

            it("Tries a search if three characters have been entered as search criteria", function () {
                spyOn(storyBoard, 'findObjects').andReturn([]);
                var searchCriteria = 'test';
                searchField.val(searchCriteria);
                searchField.trigger('keyup');

                expect(storyBoard.findObjects).toHaveBeenCalled();
            });

            it("Does not search if less then three characters submitted for search", function () {
                spyOn(storyBoard, 'findObjects').andReturn([]);
                var searchCriteria = 'te';
                searchField.val(searchCriteria);
                searchField.trigger('keyup');

                expect(storyBoard.findObjects).not.toHaveBeenCalled();
            });
        });

        describe("Highlights the StoryBoard objects searched", function () {
            var searchCriteria = 'titl';
            var objectsFound = [
                {},
                {}
            ];

            it("Calls the renderFoundObjects method", function () {
                spyOn(storyBoard, 'findObjects').andReturn(objectsFound);
                spyOn(storyBoard, 'renderFoundObjects');

                searchField.val(searchCriteria);
                searchField.trigger('keyup')

                expect(storyBoard.renderFoundObjects).toHaveBeenCalled();
            });

            it("Highlights the text found", function () {

            });
        });
    });

    xdescribe("Update Story Board Object order", function () {
        var updateModel = null;
        var updateModelOrder = null;

        beforeEach(function () {
            updateModel = storyBoard.collection.models[0];
            updateModelOrder = updateModel.get('obj_order');
        });

        it("Filters the collection by the stage of the current model", function () {
            spyOn(storyBoard, 'findNextModel');
            updateModel.set('obj_order', updateModelOrder + 1);
            storyBoard.reorderSbObjects(updateModel, updateModelOrder + 1);
            expect(storyBoard.findNextModel).toHaveBeenCalled();
        });

        it("Updates the order of story board objects in a specific stage", function () {
            var nextModel = storyBoard.collection.findWhere({'obj_order': updateModelOrder + 1});
            var nextModelId = nextModel.get('id');
            var preNextModelOrder = nextModel.get('obj_order');

            var modelChange = spyOn(Backbone.Model.prototype, 'set').andCallThrough();
            updateModel.set('obj_order', updateModelOrder + 1);

            storyBoard.reorderSbObjects(null, null);
            var nextModel = storyBoard.collection.get(nextModelId);
            var nextModelOrder = nextModel.get('obj_order');

            expect(nextModelOrder).toBe(preNextModelOrder - 1);

        });

        it("Syncs the collection with the database", function () {
            spyOn(Backbone.Collection.prototype, 'sync');
            expect(Backbone.Collection.prototype.sync).toHaveBeenCalled();
        });
    });

    describe("Show task on the story board", function () {
        var getSpy = null;
        var validSBO = null;

        beforeEach(function () {
            getSpy = spyOn(Backbone.Collection.prototype, 'get');
            setFixtures('<div id="main-content">' +
                '<ul>' +
                '<li id="sbo_1"></li>' +
                '</ul>' +
                '</div>');
            storyBoard.$el = $('#main-content');

            validSBO = new StoryBoardObject({id: 1});
        });

        it("Removes previously selected objects", function () {
            getSpy.andReturn(validSBO);
            var rClassSpy = spyOn($.fn, 'removeClass');

            storyBoard.showTask(1);

            expect(this.getJQuerySpySelector(rClassSpy)).toEqual('#main-content .sbo-stage-row');
            expect($.fn.removeClass).toHaveBeenCalledWith('sbo-selected');
        });

        it("Finds the model in the collection", function () {
            getSpy.andReturn(validSBO);
            storyBoard.showTask(1);
            expect(getSpy).toHaveBeenCalledWith(1)
        });

        it("Highlights the task if the model was found", function () {
            getSpy.andReturn(validSBO);
            var addClassSpy = spyOn($.fn, 'addClass');
            storyBoard.showTask(1);

            expect(this.getJQuerySpySelector(addClassSpy)).toEqual('#main-content #sbo_1');
            expect($.fn.addClass).toHaveBeenCalled();
        });

        it("Displays a JavaScript alert if the model was not found", function () {
            spyOn(window, 'alert');
            getSpy.andReturn(null);

            storyBoard.showTask(1);

            expect(window.alert).toHaveBeenCalled();
        });

        it("Scrolls to the task", function () {
            getSpy.andReturn(validSBO);
            spyOn(ViewHelpers.prototype, 'scrollToElement');
            storyBoard.showTask(1);

            expect(ViewHelpers.prototype.scrollToElement).toHaveBeenCalled();

        });
    });

    describe("Delete task", function () {
        beforeEach(function () {
            this.deleteCallSpy = spyOn($, 'ajax');
            this.confirmSpy = spyOn(window, 'confirm');
        });

        it("makes the delete request if confirmed", function () {
            this.confirmSpy.andReturn(true);
            storyBoard.deleteTask(1);
            expect(this.deleteCallSpy).toHaveBeenCalled();
            expect(this.deleteCallSpy.mostRecentCall.args[0].url).toBe('/story_board/1');
        });

        it("does not make the delete request if not confirmed", function () {
            this.confirmSpy.andReturn(false);
            storyBoard.deleteTask(1);
            expect(this.deleteCallSpy).not.toHaveBeenCalled();
        });

        it("removes the object from the collection", function () {
            this.confirmSpy.andReturn(true);
            var prevCollectionLength = storyBoard.collection.length;
            this.deleteCallSpy.andCallFake(function (params) {
                params.success();
            });
            storyBoard.deleteTask(1);
            expect(storyBoard.collection.length).toBe(prevCollectionLength - 1);
        });

        it("refreshes the storyboard", function () {
            spyOn(Backbone.History.prototype, 'navigate')
            this.confirmSpy.andReturn(true);
            this.deleteCallSpy.andCallFake(function (params) {
                params.success();
            });
            storyBoard.deleteTask(1);
            //TODO: need to test the call to the other navigate function
            expect(Backbone.History.prototype.navigate).toHaveBeenCalledWith('index', {trigger: true, replace: true});
        });

        it("asks for user confirmation to delete the object", function () {
            this.confirmSpy.andReturn(true);
            storyBoard.deleteTask(1);
            expect(this.confirmSpy).toHaveBeenCalled();
        });
    });

    describe("show more information method", function () {
        beforeEach(function () {
            this.e = new $.Event('click');
            this.findStub = sinon.stub($, 'find').returns($('<span class="sbo-stage-row"></span>'));
            this.removeSpy = sinon.spy($.fn, 'removeClass');
            this.toggleSpy = sinon.spy($.fn, 'toggle');
            this.hideSpy = sinon.spy($.fn, 'hide');

        });

        afterEach(function () {
            $.find.restore();
            $.fn.removeClass.restore();
            $.fn.toggle.restore();
            $.fn.hide.restore();
        });

        it("removes the linked-task class from the sbo-stage-row", function () {
            storyBoard.showMoreInfo(this.e);
            expect(this.findStub.calledWith('.sbo-stage-row')).toBeTruthy();
            expect(this.removeSpy.calledWith('linked-task')).toBeTruthy();
        });

        it("hides the edit form", function () {
            storyBoard.showMoreInfo(this.e);
            expect(this.hideSpy.calledOn(this.findStub.secondCall));
        });

        it("toggles the more inormation container form", function () {
            this.e.currentTarget = '<span data-objid="1"></span>';
            storyBoard.showMoreInfo(this.e);

            expect(this.findStub.thirdCall.args[0]).toBe('#more-info-1');
            expect(this.toggleSpy.calledOn(this.findStub.thirdCall));
        });

        it("should call the resize columns method of the view helpers", function () {
            this.vhResizeColumns = sinon.stub(storyBoard.viewHelpers, 'resizeColumnsToTheHighest');
            storyBoard.showMoreInfo(this.e);
            this.vhResizeColumns.restore();

            expect(this.vhResizeColumns.calledOnce).toBeTruthy();
        });
    });

    describe("reorder story board objects", function () {
        beforeEach(function () {
            this.dataSpy = sinon.spy($.fn, 'data');
            this.changeElOrderSpy = sinon.spy(storyBoard, 'changeElOrder');

            setFixtures('<ul>' +
                '<li id="prev-el" data-objid="2" data-obj_order="1"></li>' +
                '<li id="current-el" data-objid="1" data-obj_order="2"></li>' +
                '<li id="next-el" data-objid="3" data-obj_order="3"></li>' +
                '</ul>');

            this.currentEl = $('#current-el');
            this.ui = {};
            this.ui.item = this.currentEl;
            this.ev = new $.Event('click');
        });

        afterEach(function () {
            this.dataSpy.restore();
            this.changeElOrderSpy.restore();
        });

        it("sets the current model data", function () {
            debugger
            storyBoard.reorderSbObjects(this.ev, this.ui);

            expect(this.dataSpy.calledOn(this.currentEl)).toBeTruthy();
            expect(this.dataSpy.firstCall.args[0]).toBe('objid');
            expect(this.dataSpy.secondCall.args[0]).toBe('obj_order');
        });

        it("gets the next and previous elements", function () {
            var prevAll = sinon.spy($.fn, 'prevAll');
            var nextAll = sinon.spy($.fn, 'nextAll');

            storyBoard.reorderSbObjects(this.ev, this.ui);

            prevAll.restore();
            nextAll.restore();

            expect(prevAll.calledOn(this.currentEl)).toBeTruthy();
            expect(nextAll.calledOn(this.currentEl)).toBeTruthy();

        });

        it("changes the order up if next order is less than this el order", function(){
            this.currentEl.next().data('obj_order', 1);
            debugger
            storyBoard.reorderSbObjects(this.ev, this.ui);

            expect(this.changeElOrderSpy.args[0][2]).toBe('up');
        });

        it("changes the order down if next order is greater than this el order", function(){
            this.currentEl.next().data('obj_order', 4);

            storyBoard.reorderSbObjects(this.ev, this.ui);

            expect(this.changeElOrderSpy.args[0][2]).toBe('down');
        });
    });

    describe("Display linked story board objects", function(){
        beforeEach(function(){
           this.findSpy = sinon.spy($.fn, 'find');
           this.clock = sinon.useFakeTimers();
        });

        afterEach(function(){
           this.findSpy.restore();
           this.clock.restore();
        });

        it("finds the child story board object elements", function(){
           storyBoard.displayLinkedSbo(1);
           expect(this.findSpy).toHaveBeenCalledWith('li.1_hasparent');
       });

        it("removes the linked tasks highlighting in 8 s", function(){
            var toggleSpy = sinon.spy($.fn, 'toggleClass');

            storyBoard.displayLinkedSbo(1);
            this.clock.tick(800);

            toggleSpy.restore();

            expect(toggleSpy.secondCall.args[0]).toBe('linked-task');
        });
    });
});
