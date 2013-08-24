describe("StoryBoard Edit Object View", function () {
    var updateView = null;
    var updateTemplate = "";

    beforeEach(function(){
        updateTemplate = this.fixtures.StoryBoardUpdateObjTemplate;
        spyOn(ViewHelpers.prototype, 'getTemplate').andReturn(updateTemplate);

        //create the fake view container
        setFixtures('<div id="sbo-edit-form"><div id="sbo-edit-form-1"></div></div>');
        updateView = new StoryBoardEditObjView({
            el: '#sbo-edit-form',
            formObjects: this.fixtures.FormObjects,
            model: new StoryBoardObject( this.fixtures.StoryBoardObject)
        });
    });

    it("Has the model of a StoryBoardObject", function(){
        expect(updateView.model).toBeDefined();
    });

    describe("Initialise the view", function(){

        it("Gets the 'edit_story_board_object' template", function () {
            updateView.initialize();
            expect(ViewHelpers.prototype.getTemplate).toHaveBeenCalledWith('/assets/templates/story_board_object_form.html');
            expect(updateView.template).toBe(updateTemplate);
        });

    });

    describe("Render the view", function(){
        it("Parses the template with the model data", function(){
            var templateSpy = spyOn(_, 'template').andReturn(updateTemplate);
            updateView.render();

            expect(templateSpy).toHaveBeenCalledWith(updateTemplate, {
                formObjects: jasmine.any(Object),
                model: updateView.model,
                controls: jasmine.any(String)
            })
        });

        it("Populates the relevant view el with the template html", function () {
            updateView.render();
            expect(updateView.$el.find('#sbo-edit-form-' + updateView.model.get('id'))).toHaveHtml(updateView.template);
        });

        describe("Show edit form", function(){});
    });

    describe("Update Story Board Object", function(){
        var saveRequestSpy = null;
        var ajaxSpy = null;
        var routerSpy = null;

        beforeEach(function(){
            saveRequestSpy = spyOn(Backbone.Model.prototype, 'save').andCallThrough();
            routerSpy = spyOn(Backbone.History.prototype, 'navigate');
            ajaxSpy = spyOn($, 'ajax');
        });

        it("issues a valid request to update existing story board object model", function () {
            updateView.updateObject();
            expect(saveRequestSpy).toHaveBeenCalled();
            expect(saveRequestSpy.mostRecentCall.args[1].url).toBe('/story_board/' + updateView.model.get('id'))
        });

        it("Refreshes the StoryBoardObject view on success", function(){
            ajaxSpy.andCallFake(function(params){
                params.success();
            });
            updateView.updateObject();

            expect(routerSpy).toHaveBeenCalledWith('', {trigger: true});
        });
        it("returns a pop-up error messages on failed update", function(){
            spyOn(window, 'alert');
            ajaxSpy.andCallFake(function(params){
                params.error({error: 'Error'});
            });

            updateView.updateObject();

            expect(window.alert).toHaveBeenCalled();
        });
    });

    describe("Update StoryBoardObject order", function(){
       it("Updates the order Up", function(){
           var currentOrder = parseInt(updateView.model.get('obj_order'));
           updateView.updateOrder("up", 1);
           expect(parseInt(updateView.model.get('obj_order'))).toBe(currentOrder + 1)
       });

        it("Updates the order Down", function(){
            var currentOrder = parseInt(updateView.model.get('obj_order'));
            updateView.updateOrder("down", 1);
            expect(parseInt(updateView.model.get('obj_order'))).toBe(currentOrder - 1)
        });

        it("Does not allow negative order", function(){
            var currentOrder = parseInt(updateView.model.set('obj_order', 0));
            updateView.updateOrder("down", 1);
            expect(parseInt(updateView.model.get('obj_order'))).toBe(0)
        });
    });
});