
var canvasElement;
var list = [];
var image_loaded = false;
var image_list = [];
var capture;
var data_list = [];
var selfie_list = [];
var current_time = 0;
var cur_time = 0;
var timer = 10;
var data_x = 0;
var display_selfie_pictures = false;
var intro_screen = true;

function setup() {


  var canvas = createCanvas(windowWidth, windowHeight);
  canvasElement = canvas.elt;
  //createCanvas(windowWidth, windowHeight);
  // Create an Audio input
  mic = new p5.AudioIn();
  mic.start();

  capture = createCapture(VIDEO);
  capture.hide();



}


function draw() {
	background(255);

  if(intro_screen === true){
  		if(timer>0){
	  		background(255);
	  		textSize(32);
	  		textAlign(CENTER);
	  		fill(0);
	  		text("Laugh!",windowWidth/2,100);
	  		text("Cry!",windowWidth/2,150);
	  		text("Scream!",windowWidth/2,200);
	  		text("Shout!",windowWidth/2,250);
	  		text("Whatever you do, MAKE NOISE!!!!",windowWidth/2,300);
	  		textSize(50)
	  		// text("Begin in: "+timer,windowWidth/2,400);
	  		// timer_function();
		}
 		else{
 			intro_screen = false;
  		}

  }

  

  // Get the overall volume (between 0 and 1.0)
  var vol = mic.getLevel();
  // console.log(vol);
  fill(127);
  stroke(0);
  // console.log("The curret status of image loaded is: "+image_loaded)
  // console.log("The current status of display_selfie_pictures is: "+display_selfie_pictures)


	if(vol>0.4){
			intro_screen = false;
			image(capture,0,0,windowWidth,windowHeight);
			var dataURL = canvasElement.toDataURL('image/jpeg');
			// p5.image
			// var cropimage = copy()
  			background(255);

			//window.open(dataURL);
			console.log(dataURL);
			data_list.push(dataURL);

			var url = list[Math.floor(Math.random()*list.length)]["link"];
			img = loadImage(url);
			image_loaded = true;
			console.log("the length of the data list is:"+data_list.length);




			if(data_list.length == 6){
				console.log("I am activating the selfie protocol")
				image_loaded = false;
				display_selfie_pictures = true;

				for(var i = 0; i<4; i++){
					img = loadImage(data_list.pop());
					selfie_list.push(img);
				}

				current_time = millis();
			}

	}

	if(image_loaded == true){
			console.log("I am in image loaded");
			imageMode(CENTER);
			if(vol<0.1){
				img_width = 0.1;
				}
			else if(vol>0.1){
				img_width = vol;
				}
		image(img,windowWidth/2,350, (windowWidth*.7)*(img_width*10),(windowHeight*.9));
	}




	if(display_selfie_pictures == true){
			imageMode(CENTER);
			textAlign(CENTER);
			textSize(32);
			text("By the way, This is how ridiculous you look",windowWidth/2,25);
			console.log("I am in the sefie protocol");
			newtime = millis();
			if(newtime-current_time<4000){
				console.log("the newtime is: "+newtime)
				var new_x_pos = 0;
				var new_y_pos = 300;
				for(var my_image = 0; my_image<selfie_list.length;my_image++){
					image(selfie_list[my_image],windowWidth/2,new_y_pos,(windowWidth*.7),(windowHeight*0.7));
					new_x_pos=new_x_pos+200;
					// new_y_pos= new_y_pos+200;
					}

			}

			else if(newtime-current_time>4000){
				console.log("I am resetting things in the loop");
				display_selfie_pictures = false;
				var url = list[Math.floor(Math.random()*list.length)]["link"];
				img = loadImage(url);
				image_loaded = true;
				data_list.length = 0;
				current_time = newtime;
				selfie_list = [];
			}
	}	
}





function mousePressed(){
	// console.log("I am in mousePressed");

	// var dataURL = canvasElement.toDataURL('image/jpeg');
	// data_list[0] = dataURL;
	// console.log(dataURL);



}



function getImages(){

	imageURL = "https://api.imgur.com/3/g/memes/viral/1.json";

	
	$.ajax({

  headers: {
        'Authorization': 'Client-ID 8c1e88aa6dd6f6d'
    },
		url: imageURL,
		type: "GET",
		jsonp:"jsonp",
		error: function(data){
			console.log("Didn't work");
		},

		success: function(data){

			list = data.data;
			console.log(list);
			link = list[Math.floor(Math.random()*list["data"].length)]["link"];
		}



	});


}



$(document).ready(function(){

	getImages();

});



function timer_function(){
      new_time = millis();
      wait = 1000;       
      if(new_time-cur_time>wait){
          timer--;
	         cur_time= new_time;
          }  
}