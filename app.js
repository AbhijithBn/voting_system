var http=require('http');
var express=require('express');
var app=express();


var PORT=process.env.PORT||9000;

//body parser
var bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));// if there is an error at body parsing the change it to False
app.use(bodyParser.json());//body is represented in json format
app.use(express.static('public'));// for the use of html files


//EJS
app.set('view engine','ejs');

//configure database and mongoose schema
var dbConfig=require('./db');
var mongoose=require('mongoose');
//connect to the database using the URL
mongoose.connect(dbConfig.url);


//configure passport
var passport=require('passport');//passport.js for authentication
var session = require("express-session");
app.use(session({
     secret: "cats",
     resave: true,
     saveUninitialized: true 
    }));
app.use(passport.initialize());
app.use(passport.session());


//passport authentication for voter
var initPassport = require('./passport/init_voter');
initPassport(passport);

//passport authentication for candidate
var initPassport_candid = require('./passport/init_candid');
initPassport_candid(passport);


var routes = require('./routes/index')(passport);
app.use('/', routes);


var server=app.listen(PORT,function(){
    var host=server.address().address
    var port=server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})