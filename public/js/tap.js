var tap = {
  init:function(container){
    var that = this;







    that.tapContainer = $('<div>',{'class':'tap_container'}).appendTo(container);
    that.tapVideo     = $('<video>',{'autoplay':'autoplay','class':'tap_video'}).attr({width:640, height:480}).appendTo(that.tapContainer);
    that.tapCanvas    = $('<canvas>',{'class':'tap_canvas'}).attr({width:640, height:480}).appendTo(that.tapContainer);
    that.tapCanvasCtx = that.tapCanvas[0].getContext('2d');
    that.tapStream = false;

    // standards ... shit
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    window.URL.createObjectURL = window.URL.createObjectURL || window.URL.webkitCreateObjectURL || window.URL.mozCreateObjectURL || window.URL.msCreateObjectURL;

    navigator.getUserMedia({video: true}, function(stream) {
      that.tapVideo[0].src = window.URL.createObjectURL(stream);
      that.tapStream = stream;
      $('<div>').addClass('play_button large red button').html('Capture').appendTo(container).on('click',function(){that.captureImage();});
      //console.log(that.tapStream);
    }, function(){
      console.log('stream failed :P');
    });

  },

  captureImage:function(){
    var that = this;
    if (that.tapStream) {
      that.tapCanvasCtx.translate(that.tapCanvas[0].width, 0);
      that.tapCanvasCtx.scale(-1, 1);
      that.tapCanvasCtx.drawImage(that.tapVideo[0], 0, 0, that.tapVideo[0].width, that.tapVideo[0].height);
      var url = that.tapCanvas[0].toDataURL('image/png');
      scene.addImage(url);
      console.log(url)
      CURRENT_DATA.url = url;
      that.tapContainer.remove();
    }
  }
};
