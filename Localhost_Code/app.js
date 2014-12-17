var express = require('express');
var path = require('path');
var sys = require('sys');
var fs = require('fs');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
var session = require ('express-session');
_ = require('underscore');
var Request = require('request');
var http = require('http')



var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;

var routes = require('./routes/index');
var users = require('./routes/users');

// youtube requirements

var passport = require('passport');
var YoutubeStrategy = require('passport-youtube').Strategy;
var YoutubeUpload = require ('YoutubeUpload');

var gtoken = '';



// database requirements

var cloudant_USER = 'macdavel';
var cloudant_DB = 'vinavina';
var cloudant_KEY = 'mayselessuddindewoughtfa';
var cloudant_PASSWORD = 'OCNVwdEf4xiW3gTdfbiBoKfP';
var cloudant_URL = "https://" + cloudant_USER + ".cloudant.com/" + cloudant_DB;

















var portName = 'COM3'; 

var myPort = new SerialPort(portName, { 
   baudRate: 9600,
   // look for return and newline at the end of each data packet:
   parser: serialport.parsers.readline("\r\n")
 }); 

function showPortOpen() {
   console.log('port open. Data rate: ' + myPort.options.baudRate);
}

function saveLatestData(data) {
    console.log(data);
    console.log(typeof(data));

    if(data == 'end game'){
        console.log('received end request');
        socket.emit('game ended', 'end the game');
    }
   socket.emit('news', data);


}

function showPortClose() {
   console.log('port closed.');
}

function showError(error) {
   console.log('Serial port error: ' + error);
}



myPort.on('open', showPortOpen);  
// myPort.on('data', saveLatestData); 
myPort.on('close', showPortClose);
myPort.on('error', showError);

































// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'nunjucks');

nunjucks.configure('views', {
    autoescape: true,
    express: app
});


app.use(cookieParser());
app.use(session({secret: 'sessionSecret', cookie: { maxAge: 100000 }, resave: true, saveUninitialized: true}));

// // uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));



app.use(passport.initialize());
app.use(passport.session());



passport.serializeUser(function(user, done) {
    console.log("SERIALIZE!!!");
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    console.log("-----DESERIALIZE-----");
    done(null, obj);
});


function uploadToYoutube(filelocation){



            var filePath            = filelocation;
            // console.log(filePath)
            var title               = 'title';
            var description         = 'description';
            var category            = 'Music';
            var keywords            = 'music';
            var googleAccessToken   = gtoken;
            var youtubeDeveloperKey = 'AIzaSyBhKB0pT0mqbulUwQYJGdqoejw5sLK7lOE';

            YoutubeUpload (filePath, title, description, category, keywords, googleAccessToken, youtubeDeveloperKey, false, false, function (err, youtube_id) {

              if (err){
                console.log ("Got error: "+err);
            }
              else{
                console.log("successfully uploaded to youtube");
                console.log ("Got id: "+youtube_id);
                var data_obj = {
                    youtube_link: 'http://www.youtube.com/watch?v='+youtube_id
                };

                //Send the data to the db
                        Request.post({
                            url: cloudant_URL,
                            auth: {
                                user: cloudant_KEY,
                                pass: cloudant_PASSWORD
                            },
                            json: true,
                            body: data_obj
                        },
                        function (error, response, body){
                            if (response.statusCode == 201){
                                console.log("Saved!");
                                // response.json(body);
                            }
                            else{
                                console.log("Uh oh...");
                                console.log("Error: " + res.statusCode);
                                // response.send("Something went wrong...");
                            }
                     })
            }
            });


};









passport.use(new YoutubeStrategy({
    clientID: '688781750798-j0r7dor9ouo7araigq3rrrlnm80iieoq.apps.googleusercontent.com',
    clientSecret: 'c6nrqPci8oNlpRPsZCgKxp0H',
    scope: 'https://www.googleapis.com/auth/youtube',
    callbackURL: "http://localhost:3000/auth/youtube/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile.id);
    gtoken = accessToken;
    return done(null, profile);
  }
  ));






app.post("/save", function (request, response) {
    var body = '';
    var file = fs.createWriteStream('/devworld/'+'videotest.webm');
    
    request.on('data',function(obj){
        file.write(obj);
    })
    

    request.on('end',function(){
                console.log('end');
                uploadToYoutube('/devworld/videotest.webm');
    })



    file.on('finish',function(){
                console.log('finish');
    })

});


















//Route middleware to make sure a user is authenticated
function checkAuthentication(req, res, next) {
    // If user is authenticated in the session, carry on
    if (req.isAuthenticated()){
        console.log("Good to go!!!");
        return next();
    }
    // If they aren't redirect them to the login page
    res.redirect('/login');
}

//ROUTES
app.get("/", checkAuthentication, function(req, res){
    res.redirect('/success');
});

app.get('/login', function(req,res){
    res.render('login.html');
});

app.get("/success", checkAuthentication, function(req, res){
    console.log("In success route");

    res.render('noise.html');

});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});

//********** youtube Auth Routes **********//
app.get("/auth/youtube", passport.authenticate('youtube'), function(req, res){
        // The request will be redirected to Twitter for authentication
        // so this function will not be called.
    });

app.get("/auth/youtube/callback", passport.authenticate('youtube', { failureRedirect: '/' }), function(req, res) {
        //Successful Auth
        res.redirect('/success');
    });
//****************************************//

// app.get("*", function(req,res){
//     res.redirect("/");
// });


// Start the server

var port = process.env.PORT || 3000; 

server.listen(port);
console.log('Express started on port ' + port); 



io.on('connection', function (socket) {
    socket.emit('news','handshake is done');
    console.log("shake news sent")

    myPort.on('data', function(data){
        console.log('Data length is: '+ data.length)
        console.log(typeof(data));
        console.log(data)

        if("end game" == data){
            socket.emit('game ended','end the game')
        }
        socket.emit('news', data);
    }); 
  
  socket.on('start_game', function (data) {
    myPort.write("start\n",function(err, results){
        // console.log("results: "+results)
        // console.log('Error: '+err);
    });
    console.log('received request from client');
    console.log(data);
  });
});














