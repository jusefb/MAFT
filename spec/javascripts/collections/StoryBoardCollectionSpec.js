describe("Story Board Collection", function () {
    beforeEach(function () {

        this.fixture = this.fixtures.StoryBoardCollectionResponse.valid;
        this.server = sinon.fakeServer.create();
        this.storyBoardCollection = new StoryBoardCollection();
        this.storyBoardCollection.options = {
            projectId: 1
        };

        this.model = new Backbone.Model({
            id: 5,
            title: "Foo"
        });

        this.storyBoardCollection.model = StoryBoardObject;
        this.storyBoardCollection.add(this.model);

        this.server.respondWith(
            "GET",
            "/story_board/get_project_tasks/1",
            this.validResponse(this.fixture)
        );
    });

    afterEach(function () {
        this.server.restore();
        this.storyBoardCollection.reset();
    });

    it("Adds a model", function () {
        expect(this.storyBoardCollection.length).toEqual(1);
    });

    it("Finds a model by id", function () {
        expect(this.storyBoardCollection.get(5).get("id")).toEqual(5);
    });

    it("Makes the correct request", function () {
        this.storyBoardCollection.fetch();
        expect(this.server.requests.length)
            .toEqual(1);
        expect(this.server.requests[0].method)
            .toEqual("GET");
        expect(this.server.requests[0].url)
            .toEqual("/story_board/get_project_tasks/1");
    });

    it("Sets a correct url", function () {
        var validUrl = '/story_board/get_project_tasks/1';
        var actualUrl = this.storyBoardCollection.url(1);
        expect(validUrl).toEqual(actualUrl);
    });
});
