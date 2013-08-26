// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
$(document).ready(function(){
    var viewHelpers = new ViewHelpers();

    //render js field styling for report controls
    viewHelpers.renderDates({ dateFormat: "dd-mm-yy" });


    var reportsView = new ReportingView({
        el: '#main-cntr'
    });
    reportsView.render();
    //var plot1 = $.jqplot ('chart-container', [[3,7,9,1,4,6,8,2,5]]);
});
