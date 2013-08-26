var UsersHomeView = Backbone.View.extend({
    events:{
       'click .delete-user': 'confirmDeleteUser'
    },
    render: function(){
        var viewHelpers = new ViewHelpers();
        var cv = this;

        //hide the message container after 10s
        setTimeout(function(){
            cv.$el.find('.message-cntr').fadeIn();
        }, 10000);

        viewHelpers.resizeColumnsToTheHighest('.tile-list-row', this.$el.find('#other-users'));

   },
    confirmDeleteUser: function(e){
        var cv = this;
        var el = $(e.currentTarget);
        var userName = el.data('username');
        var userId = el.data('userid');
        var confirmDelete = confirm('Are you sure you want to delete user ' + userName);

        if(confirmDelete){
            $.ajax({
                type: 'DELETE',
                url: '/user/' + userId,
                success: function(){
                    //now refresh the current view via an ajax request and rebind all the events
                    cv.$el.load(document.location.href + ' ' + cv.$el.selector);
                    cv.delegateEvents();
                }
            })
        }
    }

});