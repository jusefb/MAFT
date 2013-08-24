//describe("getTemplate from file", function(){
//
//    beforeEach(function(){
//        spyOn($, 'ajax').andCallFake(function(params){
//            params.success('<p>Test</p>');
//        });
//        sboNew = new StoryBoardNewObjView();
//    });
//
//    afterEach(function(){
//
//    });
//
//    it("Makes a valid request to get the template", function(){
//        sboNew.getTemplate(validTemplateUrl);
//        expect($.ajax.mostRecentCall.args[0].url).toEqual(validTemplateUrl);
//    });
//
//    it("Reuses the template if it has already been loaded", function(){
//        sboNew.getTemplate(validTemplateUrl);
//        sboNew.getTemplate(validTemplateUrl);
//        expect($.ajax.calls.length).toEqual(1);
//    });
//
//    it("Expect to set the template", function(){
//        sboNew.getTemplate(validTemplateUrl);
//        expect(sboNew.options.template.length).toBeGreaterThan(0);
//    });
//
//});