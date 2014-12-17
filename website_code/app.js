//Set up requirements
var express = require("express");
var logger = require('morgan');
var Request = require('request');


//Create an 'express' object
var app = express();

//Some Middleware - log requests to the terminal console
app.use(logger('dev'));

//Set up the views directory
app.set("views", __dirname + '/views');
//Set EJS as templating language WITH html as an extension
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
//Add connection to the public folder for css & js files
app.use(express.static(__dirname + '/public'));

/*-----
ROUTES
-----*/

var cloudant_USER = 'macdavel';
var cloudant_DB = 'vinavina';
var cloudant_KEY = 'mayselessuddindewoughtfa';
var cloudant_PASSWORD = 'OCNVwdEf4xiW3gTdfbiBoKfP';
var cloudant_URL = "https://" + cloudant_USER + ".cloudant.com/" + cloudant_DB;











//Main Page Route - NO data
app.get("/", function(req, res){
	res.render('index.html');
});

app.get("/api", function(req, res){

	Request.get({
		url: cloudant_URL + "/_all_docs?include_docs=true",
		auth: {
			user: cloudant_KEY,
			pass: cloudant_PASSWORD
		},
		json: true
	},
	function (error, response, body){
		var theRows = body.rows;
		
		res.json(theRows);
	});
});

//Main Page Route - WITH data requested via the client
;

//JSON Serving route


//Catch All Route
app.get("*", function(req, res){
	response.send('Sorry, nothing doing here.');
});

// Start the server
port = process.env.PORT || 3000; 

app.listen(port);
console.log('Express started on port 3000');