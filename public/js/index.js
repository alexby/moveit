
var core = {
  createChannel: function(options){
    var that = this;
    var channel = {};
    channel.audioAnalyser = that.context.createAnalyser();
    channel.audioAnalyser.fftSize = 2048;
    // channel.audioAnalyserR = that.context.createAnalyser();
    // channel.audioAnalyserR.fftSize = 2048;

    channel.audioFilter   = that.context.createBiquadFilter();

    //channel.audioSplitter = that.context.createChannelSplitter(2);

    // make source - filter - analyser - descination channel ;)


    that.audioSource.connect(channel.audioFilter);
    that.audioSource.connect(channel.audioAnalyser);
    //channel.audioFilter.connect(channel.audioAnalyser);
    //that.audioSource.connect(that.audioDestination);

    //console.log('==========================',channel.audioSplitter);

    //channel.audioSplitter.connect(channel.audioAnalyserL, 0, 0);
    //channel.audioSplitter.connect(channel.audioAnalyserR, 1, 0);
    //channel.audioSplitter.connect(delayR, 1, 0);
    //channel.audioFilter  .connect(channel.audioAnalyser);
    channel.audioAnalyser.connect(that.audioDestination);
    //channel.audioAnalyserR.connect(that.audioDestination);
    return channel;
  },

  initAudioStuff: function(){
    var that = this;


    // audio
    that.audio = document.getElementById('audio');
    that.audio.addEventListener('timeupdate', function(e) {
      //console.log(parseInt(audio.currentTime / 60) + ':' + parseInt(audio.currentTime % 60));
      //this.spectrumCtx.fillRect(20,20,40,40);
    }, false);

    that.context = new webkitAudioContext();

    //navigator.webkitGetUserMedia({audio: true}, function(stream) {
      //that.audioSource = that.context.createMediaStreamSource(stream);
      that.audioSource = that.context.createMediaElementSource(that.audio);
      that.audioDestination = that.context.destination;
      for (var i = 0; i < that.channelsCount; i++) {
        that.channels.push(that.createChannel());
      };
    //});





    // var audioAnalyser = context.createAnalyser();

    // var audioFilter = context.createBiquadFilter();
    // audioFilter.type = 2;
    // audioFilter.frequency.value = 1500;
    // audioFilter.Q.value = 100;


   // var


    // audioSource.connect(audioAnalyser);
    // audioSource.connect(audioFilter);
    // //audioAnalyser.connect(context.destination);
    // audioFilter.connect(context.destination);



  },

  init:function(){
    var that = this;
    that.channels = [];
    that.channelsCount = 1;

    // SC.initialize({
    //   client_id: "T8Yki6U2061gLUkWvLA",
    //   redirect_uri: "http://apps.webdoc.com/common/webapps/soundcloud/callback/1.1/soundcloud-callback.html"
    // });


    //var q = "I like to move it bass ventura";
    //URL = 'http://api.soundcloud.com/tracks.json?q=' + escape(q) + '&consumer_key=PPUfDlCcjJUARBW9Y5k9eg&limit=15&offset=0&callback=?';

    // jQuery.getJSON(URL, function(response) {
    //   console.log(response)
    // });
    // spectrum canvas
    that.spectrumCanvas = document.getElementById('spectrum_canvas');
    that.spectrumCtx = that.spectrumCanvas.getContext('2d');

    that.voiceFormantsCircleCanvas = document.getElementById('formants_circle_canvas');
    that.voiceFormantsCircleCtx = that.voiceFormantsCircleCanvas.getContext('2d');

    that.voiceFormantsBarCanvas = document.getElementById('formants_bar_canvas');
    that.voiceFormantsBarCtx = that.voiceFormantsBarCanvas.getContext('2d');

    // image canvas

    // try {
    //     that.imageCanvas = fx.canvas(); // try to create a WebGL canvas (will fail if WebGL isn't supported)
    //     $('.scene').prepend(that.imageCanvas);
    // } catch (e) {
    //     alert(e);
    //     return;
    // }

    that.initAudioStuff();

    this.scene = $('<div>').addClass('scene').appendTo('body article');
    scene.init(this.scene);
    tap.init(this.scene);


    //that.addImage('/images/image.jpg');




    $(".c1").slider({
      from: 0,
      to: 5000,
      //heterogeneity: ['50/100', '75/250'],
      scale: [0, '|', 50, '|' , '100', '|', 250, '|', 500],
      limits: false,
      step: 1,
      dimension: '&nbsp;Hz',
      onstatechange : function(v){
        var values = v.split(';');
        //console.log(v);
        if(that.channels[0] && that.channels[0].audioFilter){
          that.channels[0].audioFilter.type = 2;
          that.channels[0].audioFilter.frequency.value = values[0];
          that.channels[0].audioFilter.Q.value = 0.0000000001;
          that.channels[0].audioFilter.gain.value = 1;
        }


        // that.channels[1].audioFilter.type = 1;
        // that.channels[1].audioFilter.frequency.value = values[0]/3;
        // that.channels[1].audioFilter.Q.value = 30;
        // that.channels[1].audioFilter.gain.value = 50;
      }

    });

    function calcSpectrum(source){
      var data = new Uint8Array(source.frequencyBinCount);
      source.getByteFrequencyData(data);

      var sounds = {
        i:{
          a:0,
          from:130,
          to:170,
          color:'#ff0000'
        },
        a:{
          a:0,
          from:40,
          to:190,
          color:'#ff00ff'
        },
        o:{
          a:0,
          from:100,
          to:130,
          color:'#ff33ff'
        }
    };


      var oSpectrum = [];
      var sum = 0;
      var avg = 0;
      var n = 0;
      for (var i = 0; i < data.length; i++) {
        if(i<100){
        sum += data[i];
        n++;
        }


        if(i>sounds.a.from && i< sounds.a.to){
          sounds.a.a += data[i];
        }


        if(i>sounds.i.from && i< sounds.i.to){
          sounds.i.a += data[i];
        }

        if(i>sounds.o.from && i< sounds.o.to){
          sounds.o.a += data[i];
        }


        var ls = 0;
        var ln = 0;
        for(var j = -3; j <= 3; j++){
          if(data[i+j]){
            ls += data[i+j];
            ln++;
          }
        }
        oSpectrum[i] = Math.round(ls/ln);
      }
      avg = sum/n;

      sounds.a.a = sounds.a.a / (sounds.a.to - sounds.a.from)/256;
      sounds.i.a = sounds.i.a / (sounds.i.to - sounds.i.from)/256;
      sounds.o.a = sounds.o.a / (sounds.o.to - sounds.o.from)/256;




      // var formants = [];
      // //find first formant
      // for (var i = 0; i < data.length; i++) {
      //   var a = data[i];
      //   if(data[i-1] && data[i+1] && a > data[i-1] && a > data[i+1] && a > 1){
      //     var w = ((data[i-1]+data[i+1])/2)/a;
      //     formants.push({i:i,a:a,w:w});
      //     //console.log(formants);
      //     break;
      //   }
      // }
      // if(formants[0]){
      //   var f0 = formants[0];
      //   for (var i = 2; i <= 10; i++) {
      //     var max = 0;
      //     var maxj = 0;
      //     for (var j = i*f0.i-2; j <= i*f0.i+2; j++) {
      //       if(data[j] > max) {
      //         max = data[j];
      //         maxj = j;
      //       }
      //     }
      //     var w = ((data[maxj-1]+data[maxj+1])/2)/max;
      //     formants[i-1] = {i:maxj,a:max,w:w}
      //   }
      //   //console.log(formants[0].a,formants[1].a,formants[3].a);
      // }


      // var formants = [];
      // //find first formant
      // for (var i = 0; i < data.length; i++) {
      //   var a = data[i];
      //   if(data[i-1] && data[i+1] && a > data[i-1] && a > data[i+1] && a > 1){
      //     var w = ((data[i-1]+data[i+1])/2)/a;
      //     formants.push({i:i,a:a,w:w});
      //     //console.log(formants);
      //     break;
      //   }
      // }
      // if(formants[0]){
      //   var f0 = formants[0];
      //   for (var i = 2; i <= 10; i++) {
      //     var max = 0;
      //     var maxj = 0;
      //     for (var j = i*f0.i-2; j <= i*f0.i+2; j++) {
      //       if(data[j] > max) {
      //         max = data[j];
      //         maxj = j;
      //       }
      //     }
      //     var w = ((data[maxj-1]+data[maxj+1])/2)/max;
      //     formants[i-1] = {i:maxj,a:max,w:w}
      //   }
      //   //console.log(formants[0].a,formants[1].a,formants[3].a);
      // }

      return {data:data, oData:oSpectrum, avg:avg, sum:sum, sounds: sounds};
    }

    function clearDataCanvases(){
      that.spectrumCtx.clearRect(0, 0, that.spectrumCanvas.width, that.spectrumCanvas.height);
      that.voiceFormantsCircleCtx.clearRect(0, 0, that.voiceFormantsCircleCanvas.width, that.voiceFormantsCircleCanvas.height);
      that.voiceFormantsBarCtx.clearRect(0, 0, that.voiceFormantsBarCanvas.width, that.voiceFormantsBarCanvas.height);
    }


    function drawSpectrum(spectrum, color){


      that.spectrumCtx.lineCap = 'round';

      for (var i = 0; i < that.spectrumCanvas.width; ++i) {

        // if(spectrum.data[i] > 0){
        //   var magnitude = spectrum.factor;
        //   that.spectrumCtx.fillStyle = '#dd2233';
        //   that.spectrumCtx.fillRect(i, that.spectrumCanvas.height, 1, -magnitude);
        // }

        var magnitude = spectrum.oData[i];

        if(i>130 && i<170){
          that.spectrumCtx.fillStyle = '#'+color;
        } else {
          that.spectrumCtx.fillStyle = '#ffffff';
        }


        that.spectrumCtx.fillRect(i, that.spectrumCanvas.height, 1, -magnitude);



      }
    }

    function drawVoiceFormantsCircleGraph(spectrum){
      //console.log(spectrum.formants[0])
      var formants = spectrum.formants;
      // if(formants[0]){

      //   for (var i = 0; i < formants.length; i++  ) {
      //     //console.log(i)
      //     //console.log(formants[i])
      //     that.voiceFormantsCircleCtx.beginPath();
      //     that.voiceFormantsCircleCtx.arc(128, 128, i*10, 0, 2 * Math.PI, false);
      //     that.voiceFormantsCircleCtx.lineWidth = formants[i].a/8;
      //     that.voiceFormantsCircleCtx.strokeStyle = 'rgba(255,255,255,'+(formants[i].w/2)+')';
      //     that.voiceFormantsCircleCtx.stroke();
      //   }
      // }
    }

    function drawVoiceFormantsBarGraph(spectrum){
      //console.log(spectrum.formants[0])
      var formants = spectrum.formants;
      // if(formants[0]){
      //   for (var i = 0; i < formants.length; i++  ) {

      //     that.voiceFormantsBarCtx.fillStyle = 'rgba(255,255,255,'+(formants[i].w/2)+')';
      //     that.voiceFormantsBarCtx.fillRect(i*21, that.spectrumCanvas.height, 20, -formants[i].a);

      //             //that.spectrumCtx.fillStyle = '#'+color;
      //   //that.spectrumCtx.fillRect(i, that.spectrumCanvas.height, 1, -magnitude);
      //   }
      // }
    }

    function updateSpectrum(time) {

      window.webkitRequestAnimationFrame(updateSpectrum);

      clearDataCanvases();
     // clearVoiceFormantsCircleCanvas();

      // var spectrumR = calcSpectrum(that.channels[0].audioAnalyserR);
      // //drawSpectrum(spectrumR, 'aaff11');

      var spectrum = calcSpectrum(that.channels[0].audioAnalyser);
      //drawSpectrum(spectrumL, '3311ff');

      // var sp = {data:[], max:0, factor: 0}

      // $.each(spectrumL.data, function(i, v){
      //   sp.data[i] = (spectrumL.data[i]+spectrumR.data[i])/2;
      // });

      drawSpectrum(spectrum, 'ff0000');
      drawVoiceFormantsCircleGraph(spectrum);
      drawVoiceFormantsBarGraph(spectrum);



      scene.update(spectrum);

      //console.log(data.length)








    }
    updateSpectrum();



  }
}





    window.onload = function() {
      core.init();
    };



