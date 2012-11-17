
/**
 * Module dependencies.
 */

var express = require('express');


var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/css3gen');

var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var cssStructureSchema = new Schema({
   title     :  String
  ,date      :  { type: Date, default: Date.now }
  ,data      :  {}
});

var cssStructure = mongoose.model('cssStructure',cssStructureSchema);

var routes = require('./routes');


//var Document = require('./models.js').Document(db);

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/samples',routes.samples);
app.get('/samples/',routes.samples);


app.get('/:id',routes.sample);

app.get('/json/get/:id.js',routes.jsonGet);

app.post('/json/save', routes.jsonSave);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
