/**
 * Created with JetBrains RubyMine.
 * User: JUSEF
 * Date: 12/07/13
 * Time: 23:23
 * To change this template use File | Settings | File Templates.
 */
var ViewHelpers = function(){ };
ViewHelpers.prototype = {
    getTemplate: function(templateUrl){
        var template = '';

        if(templateUrl != null && templateUrl.length > 0){
            $.ajax({
                async: false,
                url: templateUrl,
                success: function(data){
                    template = data;
                }
            });
        }
        return template;
    },
    resizeColumnsToTheHighest: function(selector, context){
        var heights = [];
        var elements = context.find(selector);
        $.each(elements, function(i, elem){
            heights.push(parseInt($(elem).height()));
        })
        var maxHeight = Math.max.apply(Math, heights);//Math.max(heights);
        elements.height(maxHeight);
    },
    getMaxOrderForStage: function(stage){
        var order = 0;
        var orderValues = []
        if(stage != null){
            $('#' + stage.toLowerCase()).find('li.sbo-stage-row').each(function(i, stageContainer){
                var dataOrder = $(stageContainer).data('obj_order');
                orderValues.push(parseInt(dataOrder));
            });
            order = Math.max.apply(Math, orderValues)
        }

        return order;
    },
    resizeStageContainers: function(){
        var stageColumns = $('#sbo-container > div');
        //we need to resize each column on the size of the list
        $.each(stageColumns, function(i, thisColumn){
            var thisColumn = $(thisColumn);
            var listHeight = thisColumn.find('ul.sbo-stage').height();
            thisColumn.height(listHeight + 10);
        });
        this.resizeColumnsToTheHighest('#sbo-container > div', $('#main-content'));
    },
    scrollToElement: function($elem){
        var elemOffset = $elem.offset();
        var scrollDestination = elemOffset.top;
        $(document).scrollTop(scrollDestination);
    },
    renderDates: function(options){
        if(typeof($.ui.datepicker) == 'object'){
            $('input.datepicker').datepicker(options);
        }
    }
};
