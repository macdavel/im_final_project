
var canvasElement;
var capture;
var data_list = [];
var start_screen = true;
var end_screen = false;
var sound_obj
var already_played = true;


// var music = ['56377417','65245249','33546064','101451158','87099229','89566557','26299470','159230477','87635651','153882075']

var bad_auto = [87635651,]

var music = ['157154705','89901625','104877196','43891548','151640044','78549467']

SC.initialize({
  client_id: 'a93bdb6a3ee57264e5ce88a2edc34f27'
});

// stream track id 293
SC.stream("/tracks/"+'28977598', function(sound){
  sound_obj = sound;

  sound.play({
    loops:3
  });
});



var socket = io('http://localhost:3000');
socket.on('news', function (data) {

    if(data == 'end game'){
      console.log('got restart to end game');
      $('body').css("background-color","red");
      $('#instructions').replaceWith('<div id="lost"><h3>Sorry you suck, Press any key to restart</h3><h3>Remember, Wait for the music and follow the pattern of the lights</h3></div>');
        console.log("making video");
        var webmBlob = Whammy.fromImageArray(data_list, 1000 / 60);
        console.log(webmBlob);


        var video = document.createElement('video');
        video.src = window.URL.createObjectURL(webmBlob);
        console.log(video.src);
        video_link = video.src;

        upload(webmBlob);
        console.log("I am in the other upload")
    }
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });
socket.on('game_ended',function (data){

  console.log("making video");
  var webmBlob = Whammy.fromImageArray(data_list, 1000 / 60);
  console.log(webmBlob);


  var video = document.createElement('video');
  video.src = window.URL.createObjectURL(webmBlob);
  console.log(video.src);
  video_link = video.src;

  upload(webmBlob);

})




function setup() {


   var canvas = createCanvas(320,240);
  //var canvas = createCanvas(300,300);
  canvasElement = canvas.elt;
  //createCanvas(windowWidth, windowHeight);
  // Create an Audio input
  // mic = new p5.AudioIn();
  // mic.start();
  
  capture = createCapture(VIDEO);
  capture.hide();

  // frameRate(30);

}


function draw() {
  if(start_screen == true){
        background(255);
        textSize(32);
        textAlign(CENTER);
        fill(0);
        text("Just Dance",windowWidth/2,0);
        text("Follow the Blinking light Pattern",windowWidth/2,150);
        text("",windowWidth/2,200);
        text("Shout",windowWidth/2,250);
        text("Whatever you do, MAKE NOISE!!!!",windowWidth/2,300);
        textSize(50)
        text("Begin in: ",windowWidth/2,400);
  }

	else{background(255);
	image(capture,0,0,320,240);
	var dataURL = canvasElement.toDataURL('image/webp');
	data_list.push(dataURL);
}

}


function upload(blobOrFile) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/save', true);
  xhr.onload = function(e) {
    console.log(e);
  };
  xhr.setRequestHeader('X_FILENAME', 'just_another_day');
  xhr.setRequestHeader('Content-Type', 'video/webm');
  xhr.send(blobOrFile);
  console.log('Sent the file to the server')
}


function keyPressed(){
  // $('#instructions').replaceWith('<h3>Sorry you suck, Press any key to start again</h3>')
  // socket.emit('start_game', 'start');
  $('body').css("background-color","white");
  if($("#lost").length != 0) {

  $('#lost').replaceWith('<h3 id="instructions">Time to Dance!!!</h3>')
}
  if($("#instructions").length != 0) {

  $('#instructions').replaceWith('<div id="instructions"><h3>Time to Dance!!!</h3><h3>Look at the lights!!!</h3></div>')
}

  start_screen = false
   console.log('Begin game request sent');

    if(already_played == true){
    sound_obj.stop();
  }



  SC.stream("/tracks/"+music[Math.floor(Math.random()*7)], function(sound){
      already_played = true;
      sound_obj = sound;
      sound.play({
        loops:3
      });
      socket.emit('start_game', 'start');
    })
}

