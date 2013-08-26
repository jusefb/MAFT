/**
 * Created with JetBrains RubyMine.
 * User: jusef
 * Date: 16/08/2013
 * Time: 10:55
 * To change this template use File | Settings | File Templates.
 */
var ReportingView = Backbone.View.extend({
    events: {
      'click #view-report': 'plotChart'
    },
    render: function(){
   },
    plotChart: function(){
        var cv = this;
        var projectId = this.$el.find('#project > option:selected').val();
        var projectName =  this.$el.find('#project > option:selected').text();
        var reportType = this.$el.find('#report_type > option:selected').text();
        var startDate = this.$el.find('input[name="start_date"]').val();
        var endDate = this.$el.find('input[name="end_date"]').val();
        var reportTitle = reportType + ' for ' + projectName + ' (' + startDate + '-' + endDate + ')';

        var reportDataRequest = this.requestReportData({
            report_type: reportType,
            project_id: projectId,
            start_date: startDate,
            end_date: endDate
        });
        reportDataRequest.done(function(data){
            console.log(data);
            cv.$el.find('#chart-container').empty();
            cv.plot1 = $.jqplot ('chart-container', data.reportData, {
                // Give the plot a title.
                title: reportTitle,
                axesDefaults: {
                    labelRenderer: $.jqplot.CanvasAxisLabelRenderer
                },
                axes: {
                    // options for each axis are specified in seperate option objects.
                    xaxis: {
                        label: "Current Sprint Day",
                        // Turn off "padding".  This will allow data point to lie on the
                        // edges of the grid.  Default padding is 1.2 and will keep all
                        // points inside the bounds of the grid.
                        pad: 0,
                        numberTicks: data.numberTicks
                    },
                    yaxis: {
                        label: "Current Sprint Hours"
                    }
                }
            });
        });
    },
    // this method will make a request to retrieve report data
    //      reportParams - contains a json string off all report parameters obtained for the reporting module contorls
    requestReportData: function(reportParams){
        return $.ajax({
            url: '/reporting/get_report_data',
            data: reportParams,
            type: 'POST'
        })
    }
});