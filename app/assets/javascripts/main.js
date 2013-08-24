$(document).ready(function(){

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
});