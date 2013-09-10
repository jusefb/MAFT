

$(document).ready(function(){
    $('#js-tests').contents().find('a').click(function(event) {
        alert("demo only");
        event.preventDefault();
    });
});
