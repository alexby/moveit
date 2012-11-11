var scene = {
  init: function(){
    var that = this;
    that.scene = $('.scene');
    try {
        that.imageCanvas = fx.canvas(); // try to create a WebGL canvas (will fail if WebGL isn't supported)
        that.scene.prepend(that.imageCanvas);
    } catch (e) {
        alert(e);
        return;
    }



    that.initTap();

    that.addImage('/images/image.jpg');

    var items = [
      {'key':'mouth','object':'<div></div>', originalWidth: 140, originalHeight:80, maxSize: { width:450, height:450 }, minSize: { width:50, height:50 }},
      {'key':'eye1','object':'<div></div>', originalWidth: 80, originalHeight:60, maxSize: { width:450, height:450 }, minSize: { width:50, height:50 }},
      {'key':'eye2','object':'<div></div>', originalWidth: 80, originalHeight:60, maxSize: { width:450, height:450 }, minSize: { width:50, height:50 }},
    ];

    var parameters = [
      {'key':'mouth', top:300, left:250},
      {'key':'eye1',  top:180, left:230},
      {'key':'eye2',  top:180, left:340},
    ];



    // var qq;
    // for(qq = 0; qq < core.image_datas.length; qq++) {
    //   var oo = {
    //     key: core.image_datas[qq].id,
    //     object: '<div></div>', //style="background-image: url(' + core.image_datas[qq].img.url + ');"
    //     originalWidth: core.image_datas[qq].w,
    //     originalHeight: core.image_datas[qq].h,
    //     minSize: { width:(core.image_datas[qq].t == "image" ? 100 : 200), height:(core.image_datas[qq].t == "image" ? 20 : 200) },
    //     maxSize: { width:450, height:450 }
    //   };
    //   if(core.image_datas[qq].t == "video") {
    //     oo.rotateable = false;
    //   }
    //   objs.push(oo);
    // }

    that.scene.crazyObjects({
      items: items,
      parameters: parameters,
      proportionalScale: true,
      deleteButton: true,
      flipContent: false,
      movableArea: {left:0, top:0, width:640, height:480},
      zIndexByClick: true,
      design: 3,
      onRemove: function(key, data) {
        // if(!core.edit) return;
        // core.image_parameters = data;
        // core.removeItemById(key);
        // widget.preferences.setValue("image_datas", JSON_stringify(core.image_datas), { doNotPushToUndoStack:true });
        // widget.preferences.setValue("image_parameters", JSON_stringify(core.image_parameters), { doNotPushToUndoStack:true });
        // if(core.image_datas.length <= 0) {
        //   jQuery("body").removeClass("step1").addClass("step0");
        // } else {
        //   jQuery("body").removeClass("step0").addClass("step1");
        // }
      },
      onChanging: function() {},
      onChanged: function(data) {
        // if(!core.edit) return;
        // core.image_parameters = data;
        // widget.preferences.setValue("image_parameters", JSON_stringify(core.image_parameters), { doNotPushToUndoStack:true });
      }
    });

    that.scene.crazyObjects("edit")





  },

  initTap:function(){
    var that = this;
    that.tapContainer = $('<div>',{'class':'tap_container'}).appendTo(that.scene);
    that.tapVideo     = $('<video>',{'autoplay':'autoplay','class':'tap_video'}).attr({width:640, height:480}).appendTo(that.tapContainer).on('click',function(){that.captureImage();});
    that.tapCanvas    = $('<canvas>',{'class':'tap_canvas'}).attr({width:640, height:480}).appendTo(that.tapContainer);
    that.tapCanvasCtx = that.tapCanvas[0].getContext('2d');
    that.tapStream = false;

    // standards ... shit
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    window.URL.createObjectURL = window.URL.createObjectURL || window.URL.webkitCreateObjectURL || window.URL.mozCreateObjectURL || window.URL.msCreateObjectURL;

    navigator.getUserMedia({video: true}, function(stream) {
      that.tapVideo[0].src = window.URL.createObjectURL(stream);
      that.tapStream = stream;
      console.log(that.tapStream);
    }, function(){
      console.log('stream failed :P');
    });
  },

  captureImage:function(){
    var that = this;
    //console.log(that.tapStream);
    if (that.tapStream) {
      console.log(that.tapVideo[0].width, that.tapVideo[0].height, that.tapCanvas[0].width, that.tapCanvas[0].height);
      that.tapCanvasCtx.translate(that.tapCanvas[0].width, 0);
      that.tapCanvasCtx.scale(-1, 1);
      that.tapCanvasCtx.drawImage(that.tapVideo[0], 0, 0, that.tapVideo[0].width, that.tapVideo[0].height);
      //that.tapCanvasCtx.scale(-1, 1);

      // "image/webp" works in Chrome 18. In other browsers, this will fall back to image/png.
      var url = that.tapCanvas[0].toDataURL('image/png');
      that.addImage(url);
      that.tapContainer.remove();
      //console.log();

    }
  },

  addImage: function(url){
    var that = this;
    var img = new Image();
    img.onload = function(){
      //console.log('===')
      //img.width = img.width/2;
      //img.height = img.height/2;
      that.imageTexture = that.imageCanvas.texture(img);
      that.imageCanvas.draw(that.imageTexture).update();
      //console.log(that.imageCanvas,that.imageCanvas.getContext('2d'),'--');
      that.imageCanvasCtx = that.imageCanvas.getContext('2d');
      //console.log('===')
    }
    img.src = url;
  },

  update: function(spectrum){
    var that = this;
    var say = function(src, sounds){
      var out;
      //if(action.open){
      //console.log(sounds.i.a);
        out = src.bulgePinch(400, 360, 120, sounds.a.a*3-1);
        out = src.bulgePinch(400, 360, 100, -0.2);
        out = src.swirl(460, 360, 60, (sounds.i.a*3-1));
        out = src.swirl(340, 360, 60, -(sounds.i.a*3-1));

        out = src.bulgePinch(350, 220, 80, sounds.o.a);
        out = src.bulgePinch(460, 220, 80, sounds.o.a);

        // out = src.bulgePinch(370, 380, 80, -0.5);
        // out = src.bulgePinch(440, 380, 80, -0.5);

        out = src.brightnessContrast(sounds.a.a*0.2, 0);

        // that.imageCanvasCtx.fillStyle = 'rgba(255,255,255,0.5)';
        // that.imageCanvasCtx.fillRect(440, 420, 200, 200);

        // out = src.zoomBlur(400, 300, action.open/5);

    //  }

      return out;
    }


    var src = that.imageCanvas.draw(that.imageTexture);
    if(1){
      var out = say(src, spectrum.sounds);
      out.update();
    } else {
      out = src;
      out.update();
    }
  },


}
