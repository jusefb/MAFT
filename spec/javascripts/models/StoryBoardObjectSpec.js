describe("StoryBoard Object Model", function () {
    beforeEach(function(){
       this.sboModel = new StoryBoardObject();
    });

    afterEach(function(){

    });

    describe("On model change", function () {
        it("Triggers the onModelChanged function on change", function(){
            var changeSpy = spyOn(StoryBoardObject.prototype, 'onModelChanged');
            this.sboModel.trigger('change');
            expect(changeSpy).toHaveBeenCalled();
        });
    });

    it("Sends a valid request to the save StoryBoardObejct action for updates", function(){
        var changeSpy = spyOn($, 'ajax');
        this.sboModel.save();
        expect(changeSpy).toHaveBeenCalled();
        expect(changeSpy.mostRecentCall.args[0].url).toEqual('/story_board');
    });
});