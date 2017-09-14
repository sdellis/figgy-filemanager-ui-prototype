// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import FileManager from './components/file_manager'

// use SaveManager to persist data?
var fm = new FileManager();

$('#sidebar').affix({
  offset: {
    top: 235
  }
});

var $body   = $(document.body);
var navHeight = $('.navbar').outerHeight(true) + 10;

var jsonLd = {}

$.widget( "figgy.filemanager", {
    options: {
        endpoint: "",
        manifestUri: "",
        jsonLd: null,
        selected: []
    },
    _create: function() {

        this.element.addClass( "filemanager" );
        var _this = this;

          this.request = jQuery.ajax({
            url: this.options.endpoint + this.options.manifestUri,
            dataType: 'json',
            async: true
          });

          this.request.done(function(jsonLd) {

             function paintPages(element, index, array){
                $( "<div id='" + index + "' class='thumbnail'></div>" )
                .appendTo( "#sortable" )
                .html( "<img src='" +
                      element.images[0].resource["@id"] +
                      "'><div class='caption'>" + element.label + "</div>" );
                }

            _this.options.jsonLd = jsonLd;

            // use global object or SaveManager here
            // rather than persisting data to DOM to allow for data binding
            $( "body" ).data( "figgy-filemanager-jsonLd", _this.options.jsonLd );
            $( "#title" ).text( _this.options.jsonLd.label );
            _this.options.jsonLd.sequences[0].canvases.forEach(paintPages);
          });
        this.refresh();
    },
    _setOption: function( key, value ) {
        this._super( key, value );
    },
    _setOptions: function( options ) {
        this._super( options );
        this.refresh();
    },
    reset: function() {
      // this._setOption( "value", 0 );
      this._create();
    },
    save: function() {
        jsonLd = this.options.jsonLd;
        // use global object or SaveManager here
        // rather than persisting data to DOM to allow for data binding
        $( "body" ).data( "figgy-filemanager-jsonLd", this.options.jsonLd );
        $( "#notice" ).text( "Updated!" );
        $( "#notice" ).show().fadeOut( 2600, "swing" );

        //  This will save it to a server when we're ready
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
    refresh: function() {
        // this.options.jsonLd = $( "body" ).data( "figgy-filemanager-jsonLd");
        // this._create();
    },
    _destroy: function() {
        this.element
            .removeClass( "filemanager" )
            .text( "" );
    }
});

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
      console.log(jsonLd)
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
  }
});
