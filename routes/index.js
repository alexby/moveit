var mongoose = require("mongoose");
var util = require('util');
var ce = require('cloneextend');
var cssStructure = mongoose.model('cssStructure');
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'MOVE IT!'})
};

exports.sample = function(req, res){
 //res.send(req.params.id);
  //cssStructure.findById(bsonShortify.decode(req.params.id), function (err, doc){
    res.render('index', {enjoyid:req.params.id,title: 'MOVE IT!'});
  //});
};

exports.samples = function(req, res){
  cssStructure.find({}, function (err, docs) {
    var list = {};
    docs.forEach(function(a){
      var enjoyid = bsonShortify.encode(a._id);
      var cla = {};
      cla.data  = JSON.stringify(ce.clone(a.data));
      list[enjoyid]='enjoyCSS.points["'+enjoyid+'"]='+cla.data+';cssg.init("'+enjoyid+'");';
    })

    //var list =
    res.render('index_samples', {layout:'layout_samples',title: 'CSS3 generator samples','samplesData':list})

  });


};

exports.jsonSave = function(req, res){
  //console.log(3333333)
  var instance = new cssStructure();
  instance.title = 'wazzza';
  instance.data = req.body;
  instance.save(function (err) {
    console.log('--save start');
    console.log('----saved item bson = '+instance._id);
    var enjoyid = bsonShortify.encode(instance._id);
    console.log('----saved item enjoyid = '+enjoyid);
    res.send({enjoyid:enjoyid});
    //res.send('Privet Nillll');
    console.log('--saved! ;)');
  });
  //res.render('index', { title: 'Express' })

};

exports.jsonGet = function(req, res){
  cssStructure.findById(bsonShortify.decode(req.params.id), function (err, doc){
  //console.log(bsonShortify.decode(req.params.id))
    res.contentType('json');
    res.send('var CURRENT_DATA = '+JSON.stringify(doc.data));
  });

};


//http://localhost:3000/OqZoRlRK1BThMZBY7
//http://localhost:3000/OqTm713IQQpQTnef

var bsonShortify = {
  encode:function(bson){
    bson+='';
    return this._hex2urlBase(bson.substr(0,12))+this._hex2urlBase(bson.substr(12,12));
  },
  decode:function(token){
    token+='';
    return this._urlBase2hex(token.substr(0,Math.ceil(token.length/2)))+this._urlBase2hex(token.substr(Math.ceil(token.length/2),Math.ceil(token.length/2)));
  },
  _base:64,
  _baseChars:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_",
  _urlBase2hex:function(token){
    var s = 0, n, l = (n = token.split("")).length, i = 0;
    while(l--) s += this._baseChars.indexOf(n[i++]) * Math.pow(this._base, l);
    var outhex = s.toString(16);
    while(outhex.length!=12){
      outhex = '0'+outhex;
    }
    return outhex;
  },
  _hex2urlBase:function(bson){
    var s = "", n = parseInt(bson,16);
    while(n) s = this._baseChars[n % this._base] + s, n = Math.floor(n / this._base);
    return s;
  }
}
