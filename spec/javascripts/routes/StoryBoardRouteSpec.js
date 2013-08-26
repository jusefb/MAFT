//tutprial used: http://tinnedfruit.com/2011/04/26/testing-backbone-apps-with-jasmine-sinon-3.html
describe("StoryBoard routes", function () {
    var StoryB = {};

    //will recreate the router objec, used for mocking router
    function createRouter(StoryB){
        StoryB.Router = new StoryBoardRoute();
        StoryB.Router.sb = StoryB;
    }

    beforeEach(function () {
        StoryB = this.fixtures.ValidStoryBoardRoute;
        StoryB.SbObjectCollection = new StoryBoardCollection();
        StoryB.SbObjectCollection.bind('add', StoryB.SbObjectCollection.onAddObject);
        StoryB.SbObjectCollection.set(this.fixtures.StoryBoardCollection);
        createRouter(StoryB);

        //spyOn(window, 'StoryBoardHomeView').andReturn(new Backbone.View());
        //spyOn(window, 'StoryBoardCollection').andReturn(StoryB.SbObjectCollection);
    });

    afterEach(function () {
        Backbone.history.stop();
    });

    describe("#init_route", function(){
        beforeEach(function(){
            //this.ajaxSpy = sinon.spy($, "ajax");
            this.ajaxStub = sinon.stub($, "ajax");
            this.collectionSpy = sinon.spy(Backbone.Collection.prototype, 'fetch');

            try{
                Backbone.history.start();
            }
            catch(e){}
        });

        afterEach(function(){
            $.ajax.restore();
            this.collectionSpy.restore();
            Backbone.history.stop();
        });

        it("calls the intRoute method on navigating to #init_route", function(){
            var initRouteSpy = sinon.spy(StoryBoardRoute.prototype, "initRoute");
            createRouter(StoryB);

            StoryB.Router.navigate("init_route/true", {trigger: true});

            expect(initRouteSpy.calledOnce).toBeTruthy();
            initRouteSpy.restore();
        });

        it("gets the form objects for the story board form", function(){
            this.ajaxStub.yieldsTo("success", null);

            StoryB.Router.initRoute(true);

            expect(this.ajaxStub.getCall(0).args[0]).toEqual({
                async: false,
                url: '/story_board/get_form_objects',
                type: 'POST',
                success: jasmine.any(Function)
            });
        });

        it("fetches the story board object collection", function(){
            var indexRouterSpy = sinon.spy(StoryBoardRoute.prototype, "index");
            createRouter(StoryB);

            StoryB.Router.initRoute();

            expect(indexRouterSpy.calledOnce).toBeTruthy();
        });

        it("calls the index function of the router to render the storyboard", function(){

            StoryB.Router.initRoute(true);
            expect()
        })
    });

    describe("#index hash", function () {
        it('has a "index" route', function () {
            expect(StoryB.Router.routes['index']).toEqual('index');
        });

        it("fires the index route with a #index hash", function () {
            spyOn(StoryBoardRoute.prototype, "index");
            StoryB.Router = new StoryBoardRoute();
            StoryB.Router.sb = StoryB;
            Backbone.history.start();

            StoryB.Router.navigate("index", true);

            expect(StoryBoardRoute.prototype.index).toHaveBeenCalled();
        });

        it("renders the StoryBoardHome view after fetch is completed", function () {
            spyOn(StoryBoardHomeView.prototype, "render");
            Backbone.history.start();

            StoryB.Router.navigate("index", true);

            expect(StoryBoardHomeView.prototype.render).toHaveBeenCalled();
        });

    });

    describe("#update/:object_id hash", function () {
        var updateSboView = null;

        beforeEach(function () {
            updateSboView = new StoryBoardEditObjView({
                model: new StoryBoardObject(this.fixtures.StoryBoardObject)
            });
        });

        afterEach(function () {
            updateSboView = null;
            Backbone.history.stop();
        });

        it("Instantiates the updateStoryBoardObject view", function () {
            expect(StoryB.Router.routes['update/:model_id']).toEqual('updateObject');
        });

        it("Fires the updateObject route with #update hash", function () {
            spyOn(StoryBoardRoute.prototype, "index");
            spyOn(StoryBoardRoute.prototype, "updateObject");

            StoryB.Router = new StoryBoardRoute({});
            StoryB.Router.sb = StoryB;
            Backbone.history.start();

            StoryB.Router.navigate("update/1", true);

            expect(StoryBoardRoute.prototype.updateObject).toHaveBeenCalledWith("1");
        });

        it("Finds the required model based on the model id", function () {
            var getViewSpy = spyOn(StoryBoardRoute.prototype, 'getView').andReturn(updateSboView);
            StoryB.Router = new StoryBoardRoute({});
            StoryB.Router.sb = StoryB;
            Backbone.history.start();

            StoryB.Router.navigate("update/1", true);

            expect(updateSboView.model).toBeDefined();
        });

        it("Instantiates the StoryBoardEditObjView with the correct values", function () {
            //Arrange
            //set-up all the spies
            var getViewSpy = spyOn(StoryBoardRoute.prototype, 'getView').andReturn(updateSboView);
            spyOn(StoryBoardEditObjView.prototype, 'render');

            //recreate the router object to make sure all the spies are set
            StoryB.Router = new StoryBoardRoute({});
            Backbone.history.start();

            //assign the fixtures data to the newly created router
            StoryB.Router.sb = StoryB;

            //Act
            StoryB.Router.navigate("update/1", true);

            //Assert
            expect(getViewSpy).toHaveBeenCalledWith('StoryBoardEditObjView', {
                el: '#main-content',
                formObjects: StoryB.sboFormObjects,
                model: jasmine.any(Object)
            });
        });

        it("It renders StoryBoardEditObjView view", function () {
            spyOn(StoryBoardEditObjView.prototype, 'render');
            Backbone.history.start();

            StoryB.Router.navigate("update/1", true);

            expect(StoryBoardEditObjView.prototype.render).toHaveBeenCalled();
        });
    });

    describe("#new hash", function () {

        beforeEach(function () {
            this.getViewStub = sinon.stub(StoryBoardRoute.prototype, "getView").returns(new Backbone.View());
        });

        afterEach(function(){
            this.getViewStub.restore();
        });

        it('has a "newObject" route', function () {
            createRouter(StoryB);
            expect(StoryB.Router.routes['new']).toEqual('newObject');
        });

        it("fires the newObject route with a #new hash", function () {
            spyOn(StoryBoardRoute.prototype, "newObject");
            createRouter(StoryB);

            Backbone.history.start();

            StoryB.Router.navigate("new", true);

            expect(StoryBoardRoute.prototype.newObject).toHaveBeenCalled();
        });

        it("gets the StoryBoardNewObj view", function () {
            createRouter(StoryB);

            StoryB.Router.newObject();

            expect(this.getViewStub.getCall(0).args[0]).toEqual('StoryBoardNewObjView', {
                el: '#sbo-form-container',
                project_id: StoryB.projectId,
                formObjects: StoryB.sboFormObjects,
                collection: StoryB.SbObjectCollection
            });
        });

        it("Renders the StoryBoardNewObj view", function () {
            spyOn(StoryBoardNewObjView.prototype, 'render');
            var newViewStub = new StoryBoardNewObjView();
            this.getViewStub.returns(newViewStub);

            StoryB.Router = new StoryBoardRoute();
            StoryB.Router.newObject();

            expect(newViewStub.render).toHaveBeenCalled();
        });

    });

    describe("#search hash", function () {
        beforeEach(function(){
            StoryB.Router = new StoryBoardRoute();
        });

        it("Has a searchObjects route", function(){
            expect(StoryB.Router.routes['search/:search_criteria']).toEqual('searchObjects');
        });

        it("Calls the home view search action on #search/searchstring", function () {
            var searchCriteria = 'test';
            var sbHomeView = new StoryBoardHomeView();
            spyOn(sbHomeView, 'findObjects');
            StoryB.Router.sb.views["StoryBoardHomeView"] = sbHomeView;

            StoryB.Router.searchObjects(searchCriteria);
            expect(sbHomeView.findObjects).toHaveBeenCalledWith(searchCriteria);
        });
    });

    describe("On change model order", function(){
       it("Triggers the update event", function(){
           spyOn(StoryBoardRoute.prototype, 'triggerReorderSbo')
           StoryB.SbObjectCollection.bind('change:[order]', StoryB.Router.triggerReorderSbo);
           StoryB.SbObjectCollection.models[0].trigger('change:[order]');

           expect(StoryBoardRoute.prototype.triggerReorderSbo).toHaveBeenCalled();
       });
    });

    describe("#show_task hash", function () {
        beforeEach(function(){
            StoryB.Router = new StoryBoardRoute();
        });

        it("Has a showTask route", function(){
            expect(StoryB.Router.routes['show_task/:model_id']).toEqual('showTask');
        });

        it("Calls the home view showTask action on #show_task/model_id", function () {
            var sbHomeView = new StoryBoardHomeView();
            spyOn(sbHomeView, 'showTask');
            StoryB.Router.sb.views["StoryBoardHomeView"] = sbHomeView;

            StoryB.Router.showTask(1);
            expect(sbHomeView.showTask).toHaveBeenCalledWith(1);
        });
    });

    describe("#delete_sbo hash", function () {
        beforeEach(function(){
            StoryB.Router = new StoryBoardRoute();
        });

        it("Has a deleteTask route", function(){
            expect(StoryB.Router.routes['delete_sbo/:model_id']).toEqual('deleteTask');
        });

        it("Calls the home view deleteTask action on #delete_sbo/model_id", function () {
            var sbHomeView = new StoryBoardHomeView();
            spyOn(sbHomeView, 'deleteTask');
            StoryB.Router.sb.views["StoryBoardHomeView"] = sbHomeView;

            StoryB.Router.deleteTask(1);
            expect(sbHomeView.deleteTask).toHaveBeenCalledWith(1);
        });
    });

    describe("#changeStatus hash", function(){
        beforeEach(function(){
           this.getViewStub = sinon.stub(StoryB.Router, 'getView').returns(new StoryBoardEditObjView());
        });

        afterEach(function(){
           this.getViewStub.restore();
        });

        it("Has a changeStatus route", function(){
            expect(StoryB.Router.routes['change_status/:model_id']).toEqual('changeStatus');
        });

        it("gets the StoryBoardEditObjView template", function(){
            StoryB.Router.changeStatus(1);

            expect(this.getViewStub).toHaveBeenCalledWith("StoryBoardEditObjView", {
                el: '#main-content',
                formObjects: StoryB.Router.sb.sboFormObjects,
                model: StoryB.SbObjectCollection.get(1)
            })
        });

        it("Calls the StoryBoardEditObjView view renderChangeStatus", function () {
            this.getViewStub.restore();

            var sbEditView = new StoryBoardEditObjView();
            spyOn(sbEditView, 'renderChangeStatus');

            StoryB.Router.sb.views["StoryBoardEditObjView"] = sbEditView;

            StoryB.Router.changeStatus(1);
            expect(sbEditView.renderChangeStatus).toHaveBeenCalled();
        });


        it("gets the model from the collection", function(){

       });
    });

    describe("View linked tasks", function(){

        beforeEach(function(){
            var homeView =  new StoryBoardHomeView();
            StoryB.views["StoryBoardHomeView"] = homeView
            this.displayLinkedSboStub = sinon.stub(homeView, 'displayLinkedSbo');
        });

        afterEach(function(){
            this.displayLinkedSboStub.restore();
        });

        it("calls the displayLinkedSbo function of the story board home view", function(){
            StoryB.Router.viewLinkedTasks(1);

            expect(this.displayLinkedSboStub).toHaveBeenCalled()
        })

    });


});