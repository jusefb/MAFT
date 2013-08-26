//To be completed at a later stage
xdescribe("On Story Board Object collection change", function(){
    it("Triggers the addObjectToStage function on add to SBO collection", function(){
        var addObjectToStageSpy = spyOn(StoryBoardRoute.prototype, 'addObjectToStage');

        this.sboCollection.trigger('add');

        expect(addObjectToStageSpy).toHaveBeenCalled();
    })

    it("Adds newly created object to the relevant stage container", function(){
        var spyOnRoute = spyOn(StoryBoardRoute.prototype, 'addObjectToStage');
        this.sboCollection.add(new StoryBoardObject(this.fixtures.StoryBoardObject));
        expect(spyOnRoute).toHaveBeenCalled();
    });
});