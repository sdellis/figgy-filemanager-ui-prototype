import FileManager from './components/file_manager'

// use SaveManager to persist data?
// instantiating this causes my sortable from firing
// window.fm = new FileManager();
var manifest = {}
var img_collection = []
var selected = []

// $( document ).on( "foo", function( event ) {
//   console.log(event)
// });

$('#sidebar').affix({
  offset: {
    top: 235
  }
});

var navHeight = $('.navbar').outerHeight(true) + 10;

$.widget( "figgy.filemanager", {
    options: {
        endpoint: "",
        manifestUri: "",
        jsonLd: null,
        selected: []
    },
    _create: function() {

        this.element.addClass( "filemanager" );

        this.request = jQuery.ajax({
          url: this.options.endpoint + this.options.manifestUri,
          dataType: 'json',
          async: true
        });

        var _this = this;
        this.request.done(function(jsonLd) {

          function paintPages(element, index, array){
              $( "<div id='" + index + "' class='thumbnail'></div>" )
              .appendTo( "#sortable" )
              .html( "<img id='" + element["@id"] + "' src='" +
                    element.images[0].resource["@id"] +
                    "'><div class='caption'>" + element.label + "</div>" );
              img_collection.push({
                'id': element["@id"],
                'label': element.label,
                'isThumb': null,
                'isStart': null,
                'selected': false
              })
          }

          _this.options.jsonLd = jsonLd;

          // use global object or SaveManager here
          // rather than persisting data to DOM to allow for data binding
          manifest = _this.options.jsonLd
          $( "body" ).data( "figgy-filemanager-jsonLd", _this.options.jsonLd );
          $( "#title" ).text( _this.options.jsonLd.label );
          _this.options.jsonLd.sequences[0].canvases.forEach(paintPages);
        });

        // add event handlers
        this._on(this.document, {
  				'click.thumbnail': function(event) {

            this._trigger( "selectPage", event, {
              // do a lookup on img_collection based on id and pass the
              // whole thing to selected
              id: event.target.id
            });
  				}
  			});
    },
    _setOption: function( key, value ) {
        this._super( key, value );
    },
    _setOptions: function( options ) {
        this._super( options );
    },
    reset: function() {
      this._destroy();
      this._create();
    },
    save: function() {

        // use global object or SaveManager here
        // rather than persisting data to DOM to allow for data binding
        manifest = this.options.jsonLd
        $( "body" ).data( "figgy-filemanager-jsonLd", this.options.jsonLd );
        $( "#notice" ).text( "Updated!" );
        $( "#notice" ).show().fadeOut( 2600, "swing" );

        //  This will save it to a server if we want
        //  or it can save as a js object and delegate persistence
        //
        // payload = JSON.stringify( this.options.jsonLd );
        // $.ajax(
        //     {
        //         url : this.options.endpoint + this.options.manifestUri,
        //         contentType: "application/json",
        //         method: "PUT",
        //         data : payload,
        //         success:function(data, textStatus, jqXHR)
        //         {
        //            console.log("success!");
        //             $( "#notice" ).text( "Updated!" );
        //             $( "#notice" ).show().fadeOut( 2600, "swing" );
        //         },
        //         error: function(jqXHR, textStatus, errorThrown)
        //         {
        //             $( "#notice" ).text( "Update Error!" );
        //             $( "#notice" ).show().fadeOut( 2600, "swing" );
        //             console.log("Error Updating!");
        //         }
        //     });

    },
    _destroy: function() {
        this.element
            .removeClass( "filemanager" )
            .text( "" );
    }
});

$(function() {
  // draw plugin to dom >>>
  var folder = $( "<div></div>" )
      .appendTo( "body" )
      .filemanager({
          endpoint: "https://hydra-dev.princeton.edu/concern/ephemera_folders/",
          manifestUri: "feddf9b7-0935-448a-91d6-eb3ce933bcb5/manifest",
          complete: function( event, data ) {
              $( "#notice" ).text( "Complete!" );
              $( "#notice" ).show().fadeOut( 2600, "swing" );
          }
      })
      .data( "figgy-filemanager" );

  $( "#sortable" ).sortable({
    update: function(event, ui) {
        var jsonLd = $( "body" ).data( "figgy-filemanager-jsonLd");
        var new_canvasArr = [];
        var sortedIDs = $( "#sortable" ).sortable( "toArray" );
        var arrayLength = sortedIDs.length;
        for (var i = 0; i < arrayLength; i++) {
              new_canvasArr[i] = jsonLd.sequences[0].canvases[sortedIDs[i]];
        }
        jsonLd.sequences[0].canvases = new_canvasArr;
        folder.option( "jsonLd", jsonLd);
        //update the folder with the new sort order
        folder.save();
        console.log(img_collection)
    }
  });
});

var handleSelectPage = function(event) {
    console.log(event);
};

$( document ).filemanager({selectPage : handleSelectPage});
