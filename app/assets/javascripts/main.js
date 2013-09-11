$(document).ready(function(){
    //resize the window based on the screen height
    var footerHeight = $('#footer').height();
    $('#layout').height($(window).height()-footerHeight);
    $('#layout').resize(function(){
       $(this).height($(window).height()-footerHeight);
    });

    //resize all the rows to the highest column
    var viewHelpers = new ViewHelpers();
    viewHelpers.resizeColumnsToTheHighest('.tile-list-row', $('.page-content'));
    viewHelpers.renderDates();

    //add event for login button
    $(document).on('click', '#log-in-btn', function(){
        var el = $(this);
        var actionUrl =  el.data('actionurl');
        document.location.href = actionUrl;
    });

    //add event for logout button it has to be done via ajax to make DELETE request
    $(document).on('click', '#log-out-btn', function(){
        var el = $(this);
        var actionUrl =  el.data('actionurl');
        $.ajax({
            type: 'DELETE',
            url: actionUrl,
            success: function(){
                document.location.href = '/';
            }
        });
    });

    $(document).on('click', '#cancel-edit', function(){
       window.history.back();
    });
});