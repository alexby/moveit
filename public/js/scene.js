var scene = {
  init: function(container){
    var that = this;
    that.scene = $(container);
    try {
        that.imageCanvas = fx.canvas(); // try to create a WebGL canvas (will fail if WebGL isn't supported)
        that.scene.prepend(that.imageCanvas);
    } catch (e) {
        alert(e);
        return;
    }





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


    that.crazyObjectsContainer = $('<div>',{'class':'crazy_objects_container'}).appendTo(that.scene);
    that.crazyObjectsContainer.crazyObjects({
      items: items,
      parameters: parameters,
      proportionalScale: true,
      deleteButton: true,
      flipContent: false,
      movableArea: {left:0, top:0, width:640, height:480},
      zIndexByClick: true,
      design: 3,
      onRemove: function(key, data) {

      },
      onChanging: function() {},
      onChanged: function(data) {
        // if(!core.edit) return;
        // core.image_parameters = data;
        // widget.preferences.setValue("image_parameters", JSON_stringify(core.image_parameters), { doNotPushToUndoStack:true });
      }
    });

    that.scene.crazyObjects("hide");





  },


  addImage: function(url, edit){
    var that = this;
    var img = new Image();
    img.onload = function(){
      that.imageTexture = that.imageCanvas.texture(img);
      that.imageCanvas.draw(that.imageTexture).update();
      that.imageCanvasCtx = that.imageCanvas.getContext('2d');

      that.scene.crazyObjects("show");
      that.scene.crazyObjects("edit");

      var req = $.post("/json/save",enjoyCSS.points[eid]).error(function() { alert("error"); });
      req.success(function(obj){
        alert(obj);
      });
    };
    img.src = url;
  },

  update: function(spectrum){
    var that = this;
    var say = function(src, sounds){
      var out;
      out = src.bulgePinch(400, 360, 120, sounds.a.a*3-1);
      out = src.bulgePinch(400, 360, 100, -0.2);
      out = src.swirl(460, 360, 60, (sounds.i.a*3-1));
      out = src.swirl(340, 360, 60, -(sounds.i.a*3-1));

      out = src.bulgePinch(350, 220, 80, sounds.o.a);
      out = src.bulgePinch(460, 220, 80, sounds.o.a);

      out = src.brightnessContrast(sounds.a.a*0.2, 0);
      return out;
    };


    var src = that.imageCanvas.draw(that.imageTexture);
    if(1){
      var out = say(src, spectrum.sounds);
      out.update();
    } else {
      out = src;
      out.update();
    }
  }
};
