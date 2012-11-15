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





    //that.addImage('/images/image.jpg');

    that.moveItCrazyItems = [
      {'key':'mouth','object':'<div></div>', originalWidth: 140, originalHeight:80, maxSize: { width:450, height:450 }, minSize: { width:50, height:50 }},
      {'key':'eye1','object':'<div></div>', originalWidth: 80, originalHeight:60, maxSize: { width:450, height:450 }, minSize: { width:50, height:50 }},
      {'key':'eye2','object':'<div></div>', originalWidth: 80, originalHeight:60, maxSize: { width:450, height:450 }, minSize: { width:50, height:50 }},
    ];

    that.moveItCrazyParameters = [
      {'key':'mouth', top:300, left:250, width:140, height: 80},
      {'key':'eye1',  top:180, left:230, width:80, height: 60},
      {'key':'eye2',  top:180, left:340, width:80, height: 60}
    ];

    var extendMoveItCrazyParameters = function(){
      $.each(that.moveItCrazyParameters,function(i, v){
        v.center = {x: v.left + v.width/2, y: v.top + v.height/2};
        v.keydots = [{x: v.left, y: v.top + v.height/2}, {x: v.left + v.width, y: v.top + v.height/2}];
      });
    };

    that.crazyObjectsContainer = $('<div>',{'class':'crazy_objects_container'}).appendTo(that.scene);
    that.crazyObjectsContainer.crazyObjects({
      items: that.moveItCrazyItems,
      parameters: that.moveItCrazyParameters,
      proportionalScale: false,
      deleteButton: false,
      flipContent: false,
      movableArea: {left:0, top:0, width:640, height:480},
      zIndexByClick: true,
      design: 3,
      onRemove: function(key, data) {

      },
      onChanging: function() {

      },
      onChanged: function(moveItCrazyParameters) {
        that.moveItCrazyParameters = moveItCrazyParameters;
        extendMoveItCrazyParameters();
        console.log( that.moveItCrazyParameters);
        // if(!core.edit) return;
        // core.image_parameters = data;
        // widget.preferences.setValue("image_parameters", JSON_stringify(core.image_parameters), { doNotPushToUndoStack:true });
      }
    });

    that.scene.crazyObjects("hide");


    extendMoveItCrazyParameters(that.moveItCrazyParameters);


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

      var req = $.post("/json/save",{}).error(function() { alert("error"); });
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

      // var moth = {
      //   center:that.moveItCrazyParameters
      // }
      var mouth = that.moveItCrazyParameters[0];
      var eye1 = that.moveItCrazyParameters[1];
      var eye2 = that.moveItCrazyParameters[2];

      //console.log(mouth.center.x, mouth.center.y, mouth.width/2);

      out = src.bulgePinch(mouth.center.x, mouth.center.y, mouth.width/2, sounds.a.a*3-1.5);
      out = src.bulgePinch(mouth.center.x+mouth.width/4, mouth.center.y, mouth.width/2, sounds.a.a*2-1);
      out = src.bulgePinch(mouth.center.x-mouth.width/4, mouth.center.y, mouth.width/2, sounds.a.a*2-1);
      //out = src.bulgePinch(400, 360, 100, -0.2);
      out = src.swirl(mouth.keydots[0].x, mouth.keydots[0].y, mouth.width/3, (sounds.i.a*3-1.5));
      out = src.swirl(mouth.keydots[1].x, mouth.keydots[1].y, mouth.width/3, -(sounds.i.a*3-1.5));

      out = src.bulgePinch(eye1.center.x, eye1.center.y, eye1.width/2, sounds.o.a);
      out = src.bulgePinch(eye2.center.x, eye2.center.y, eye2.width/2, sounds.o.a);

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
