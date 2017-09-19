import img_collection from './data/img_collection'

;(function ( $, window, document, undefined ) {
$.widget( "figgy.filemanager", {
    options: {
        endpoint: "",
        manifestUri: "",
        jsonLd: null,
        images: [],
        selected: {
          'id': '',
          'label': '',
          'url': '',
          'pageType': 'single',
          'isThumb': null,
          'isStart': null
        }
    },
    _create: function() {

        this.element.addClass( "filemanager" )

        // paint the img_collection here
        this.refresh()

        var _this = this;

        // add event handlers
        this._on(this.document, {
  				'click.thumbnail': function(event) {
            _this.handleSelectPage(event.target.id)
  				}
  			});

        this._on(this.document, {
          'click#save_btn': function(event) {
            this.save()
  				}
        });

        this._on(this.document, {
          'input#label': function(event) {
            this.options.selected.label = $( '#label' ).val()
            window.selected = this.options.selected;
  				}
        });

        // Probably don't need to refresh labels until after save
        // but just in case...
        // $('#label').on('input',function(e){
        //   selected.label = $( '#label' ).val()
        //   console.log(selected.label)
        //   window.selected = selected
        // });

        // Note: this relies on jQuery UI Sortable widget
        // Since jQuery UI is a dependency, we can lean on it
        // and look into optimizing with HTML5 native DnD if needed
        $( "#sortable" ).sortable({
          update: function( event, ui ) {
            var sortedIDs = $( "#sortable" ).sortable( "toArray" );
            _this._saveSort(sortedIDs);
          }
        });
    },
    getImageIndexById: function( id ) {
      var elementPos = this.options.images.map(function(image) {
        return image.id
      }).indexOf(id)
      return this.options.images[elementPos]
    },
    handleSelectPage: function( select_id ) {
      var selected = this.getImageIndexById(select_id)
      $( '#label' ).val(selected.label)
      $( '#pageType option[value="'+ selected.pageType +'"]' ).prop('selected', true)
      $( '#isThumb' ).prop( "checked", selected.isThumb )
      $( '#isStart' ).prop( "checked", selected.isStart )
      $( '#canvas_id' ).val(selected.id)
      $( '#detail_img' ).attr("src",selected.url)
      this.options.selected = selected
    },
    paintPage: function( page, index, array ) {
      $( "<div id='" + index + "' class='thumbnail'></div>" )
      .appendTo( "#sortable" )
      .html( "<img id='" + page.id + "' src='" +
            page.url +
            "'><div class='caption'>" + page.label + "</div>" );
    },
    _saveSort: function( sortedIDs ) {
      var new_imgArr = [];
      var arrayLength = sortedIDs.length;
      for (var i = 0; i < arrayLength; i++) {
        new_imgArr[i] = this.options.images[sortedIDs[i]];
      }
      this.options.images = new_imgArr;
    },
    _setOption: function( key, value ) {
        this._super( key, value );
    },
    _setOptions: function( options ) {
        this._super( options );
    },
    refresh: function() {
      $( "#sortable" ).empty();
      this.options.images.forEach(this.paintPage);
    },
    reset: function() {
      this._destroy();
      this._create();
    },
    save: function() {
        var index = this.options.images.map(function(img) {
          return img.id;
        }).indexOf(this.options.selected.id);
        this.options.images[index] = this.options.selected
        this.refresh()
        //  This will save it to a server if we want
        //  or we can just emit an event
        this.element.trigger( "objectSaved", [this.options.images] );
    },
    _destroy: function() {
        this.element
            .removeClass( "filemanager" )
            .text( "" );
    }
});
})( jQuery, window, document );

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
