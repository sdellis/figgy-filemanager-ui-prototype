import img_collection from '@/data/img_collection'
import FilemanagerUI from '@/components/FilemanagerUI'

describe('FilemanagerUI', () => {
  it('should render correct contents', () => {
    var folder = $( "<div></div>" )
        .appendTo( "body" )
        .filemanager({
            images: img_collection
        })

    expect(folder.option( "images"))
      .to.equal('Welcome to Your Vue.js App')
  })
})
