import img_collection from './data/img_collection'
import fmu from './components/FilemanagerUI';

$('#sidebar').affix({
  offset: {
    bottom: 235
  }
});

var navHeight = $('.navbar').outerHeight(true) + 10;

$(function() {
  // draw plugin to dom >>>
  var folder = $( "<div></div>" )
      .appendTo( "body" )
      .filemanager({
          images: img_collection
      })

  // listen for the objectSaved event to catch and persist the data
  $( "body" ).on( "objectSaved", function( event, img_collection ) {
      console.log(img_collection)
  });

});
