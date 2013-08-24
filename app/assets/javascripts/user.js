// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
$(function(){
   var usershomeView = new UsersHomeView({
       el: 'div.tile-list-cntr'
   });
   usershomeView.render();
});
