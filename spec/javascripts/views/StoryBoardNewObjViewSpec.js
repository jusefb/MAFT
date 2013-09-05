describe("StoryBoard new object view", function () {
    var validTemplateUrl = '/assets/templates/story_board_object_form.html';
    var sboNew = null;

    beforeEach(function () {
        sboNew = new StoryBoardNewObjView();
    });

    afterEach(function(){
       sboNew = null;
    });

    describe("Initialise the the view", function () {
        beforeEach(function(){
            spyOn(ViewHelpers.prototype, 'getTemplate');
        });

        it("Has a template link", function(){
            sboNew.initialize();
            expect(sboNew.options.templateUrl).toEqual(validTemplateUrl);
        });

        it("Calls the get new StoryBoardObject template", function () {
            template = sboNew.initialize();
            expect(ViewHelpers.prototype.getTemplate).toHaveBeenCalledWith(validTemplateUrl);
        });

    });

    describe("Render the view", function(){
        var testContainer = null;

        beforeEach(function(){
            setFixtures('<div id="sbo-form-container"><div id="sbo-form"></div></div>');
            var testTemplate = this.fixtures.StoryBoardNewObjTemplate
            spyOn(ViewHelpers.prototype, 'getTemplate').andReturn(testTemplate);

            sboNew = new StoryBoardNewObjView({
              el: '#sbo-form-container'
           });
        });

        afterEach(function(){
        });

        it("Populates the 'new_story_board' object template with form objects", function () {

            sboNew.render();
            expect(sboNew.$el.find('#sbo-form')).toHaveHtml(this.fixtures.StoryBoardNewObjTemplate);
        });

        it("It calls the underscore template method with the model parameter", function () {
            var templateSpy = spyOn(_, 'template');
            sboNew.render();
            expect(templateSpy).toHaveBeenCalledWith(sboNew.options.template,{
                controls: jasmine.any(String),
                model: sboNew.model
            });
        });

        it("Appends the 'new_story_board' template to the #new-object container", function(){
            sboNew.render();
            expect(sboNew.$el.html().length).toBeGreaterThan(0);
        });

        it("Creates a valid model of the new story board object", function () {
            sboNew.render();

            expect(sboNew.model).toBeDefined();
        });

        it("Resizes the columns to the highest column", function(){

        });
    });

    describe("Create StoryBoard object", function(){
        beforeEach(function(){
            setFixtures('<div id="sbo-form-container"><div id="sbo-form"></div></div>');
            var testTemplate = this.fixtures.StoryBoardNewObjTemplate
            spyOn(ViewHelpers.prototype, 'getTemplate').andReturn(testTemplate);
            sboNew = new StoryBoardNewObjView({
                el: '#sbo-form-container',
                collection: new StoryBoardCollection(this.fixtures.StoryBoardCollection)
            });
            sboNew.render();
        });

        it("Calls the create object method of the model", function(){
            //arrange
            var creatObjSpy = spyOn(sboNew, 'createObject');
            sboNew.render();
            sboNew.delegateEvents();
            //act
            sboNew.$el.find('#sbo-form-save').trigger('click');

            expect(creatObjSpy).toHaveBeenCalled();
        });

        it("Adds the created model to the StoryBoardObject collection using form values", function(){
            debugger
            sboNew.createObject();
            expect(sboNew.model.get("title")).toBeDefined();
        });

        it("Calls the save method of the model", function(){
            var saveModelSpy = spyOn(StoryBoardObject.prototype, 'save');
            sboNew.createObject();
            expect(saveModelSpy).toHaveBeenCalled();
        });

        it("Hides the new object form on successful save", function(){
            var saveModelSpy = spyOn($, 'ajax').andCallFake(function(params){
                params.success();
            });
            var hideSpy = spyOn(sboNew, 'closeForm');

            sboNew.createObject();

            expect(hideSpy).toHaveBeenCalled();
        });

        it("Sets the parent_task_id if it has been passed in the options", function(){
            var parent_task_id = 1;
            var modelSetSpy = spyOn(Backbone.Model.prototype, "set");
            sboNew.options.parentTaskId = parent_task_id;
            sboNew.createObject();

            expect(modelSetSpy.callCount).toBe(4);
        });
    });

    describe("displayErrors", function(){
       it("Creates an errors container", function(){

       });

       it("Appends the container to the main element of the view", function(){

       });

       it("Returns a list view of each error", function(){

       });
    });
});