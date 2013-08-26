beforeEach(function() {

    var storyBoardCollection = [
        {
            "id": 1,
            "obj_order": 1,
            "title": "As I user I want be able to add new features",
            "type": "Feature",
            "stage": "Current",
            "description": "Users should be able to add features",
            "parent_task_id": 1,
            "parent_title ": "other",
            "created_at": "2011-07-03 00:00:00",
            "updated_at": "2011-07-03 00:00:00"
        },
        {
            "id": 2,
            "obj_order": 2,
            "title": "Update the test site",
            "type": "Task",
            "stage": "Backlog",
            "description": "The test site needs to be updated",
            "parent_task_id": 1,
            "parent_title ": "other",
            "created_at": "2011-07-03 00:00:00",
            "updated_at": "2011-07-03 00:00:00"
        },
        {
            "id": 3,
            "obj_order": 3,
            "title": "Update the test site",
            "type": "Task",
            "stage": "Future",
            "description": "The test site needs to be updated",
            "parent_task_id": 1,
            "parent_title ": "other",
            "created_at": "2011-07-03 00:00:00",
            "updated_at": "2011-07-03 00:00:00"
        },
        {
            "id": 4,
            "obj_order": 2,
            "title": "Update the test site",
            "type": "Task",
            "stage": "Current",
            "description": "The test site needs to be updated",
            "parent_task_id": 1,
            "parent_title ": "other",
            "created_at": "2011-07-03 00:00:00",
            "updated_at": "2011-07-03 00:00:00"
        }

    ];

    this.fixtures = {

        StoryBoardObject: {
            "id": 1,
            "obj_order": 1,
            "title": "As I user I want be able to add new features",
            "type": "Feature",
            "description": "Users should be able to add features",
            "parent_task_id": 1,
            "parent_title ": "other",
            "created_at": "2011-07-03 00:00:00",
            "updated_at": "2011-07-03 00:00:00"
        },

        StoryBoardCollectionResponse: {
            valid: { // response starts here
                "status": "OK",
                "version": "1.0",
                "response": {
                    "StoryBoardCollection": storyBoardCollection
                }
            }
        },

        "StoryBoardCollection": storyBoardCollection,

        StoryBoardNewObjTemplate: '<div class="new-obj-template">' +
            '<form name="sbo-new-form">' +
            '<input name="title" type="text" value="Test title" />' +
            '<input id="sbo-form-save" type="submit" value="Save" />' +
            '<input id="sbo-form-cancel" type="reset" value="Cancel" />' +
            '</form>' +
            '</div>',

        StoryBoardUpdateObjTemplate: '<div class="update-obj-template">' +
            '<form name="sbo-new-form">' +
            '<input name="title" type="text" value="Test title" />' +
            '<input id="sbo-form-save" type="submit" value="Save"/>' +
            '<input id="sbo-form-cancel" type="reset" value="Cancel"/>' +
            '</form>' +
            '</div>',

        StoryBoardHomeObjectTemplate: '<div class="sbo-display-row">' +
            '<span>Some Task</span>' +
            '<p>Some Content</p>' +
            '</div>',

        ValidStoryBoardRoute: {
            views: [],
            projectId: 1,
            sboFormObjects: {
                types: [],
                stages: []
            },
            SbObjectCollection: {}
        },

        FormObjects: {
            types: [],
            stages: []
        }

    };

});