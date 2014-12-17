var allPopcornObjects = [];
var already_played = false;
var sound_obj

var allData = [];
var youtube_videos = [];
function getAllData(){
	$.ajax({
		url: '/api',
		type: 'GET',
		dataType: 'json',
		error: function(data){
			console.log(data);
			alert("Oh No! Try a refresh?");
		},
		success: function(data){
			console.log("We have data");
			console.log(data);
			//You could do this on the server
			allData = data.map(function(d){
				return d.doc;
			});
			console.log(allData)

			youtube_videos = allData.map(function(d){
				return d.youtube_link;
			})

			console.log('data has arrived')
			//Clear out current data on the page if any
		}
	});
}

getAllData();

youtube_ids = ['KBTNPp3W5t0','YHkDOG4z7_I','ddl4tuyyrvc','VUK_lCUsrnc','tOTYKDd3e04','9cOt2khwmDE','sxq8K0pXMV0','gs88onQsj0Q','GK7UXMD6xqw'];
// var music = ['56377417','65245249','33546064','101451158','87099229','89566557','26299470','159230477','153882075'];

var music = ['94686925','26299470','162022719','151640044','141483353','154899511']

SC.initialize({
		  client_id: 'a93bdb6a3ee57264e5ce88a2edc34f27'
		});

// SC.stream("/tracks/"+music[Math.floor(Math.random()*12)], function(sound){
// 		  sound.play({
// 		    loops:3
// 		  });
// });

// '26299470'

$("#stream").live("click", function(){
	if(already_played == true){
		sound_obj.stop();
	}

	// getAllData();

	console.log("playing again");
	SC.stream("/tracks/"+music[Math.floor(Math.random()*7)], function(sound){
			already_played = true;
			sound_obj = sound;
		  sound.play({
		    loops:3
		  });

});


	for (var i = 0; i < youtube_videos.length; i++){
		var newlink = youtube_videos.pop();
		var newid = newlink.slice(31)
		// var curVideoId = youtube_ids.pop()
		var curVideoId = newid
		var popVideoId = "pop-" + curVideoId;
		var curVideoLink = 'http://www.youtube.com/watch?v=' + curVideoId;
		//Create a div
		$('#videos').append('<div class="video" id=' + popVideoId + '></div>');
		//Initialize the Popcorn object
		var tempWrapper = Popcorn.HTMLYouTubeVideoElement('#' + popVideoId);
		tempWrapper.src = curVideoLink;
		var tempPopcorn = Popcorn(tempWrapper);
		//Add the Popcorn object to an array
		allPopcornObjects.push(tempPopcorn);
	}


		allPopcornObjects[0].on("canplayall", function() {
				this.currentTime(1);
			});

		for(x = 0; x<allPopcornObjects.length; x++){
			allPopcornObjects[x].play();
			allPopcornObjects[x].mute();
			allPopcornObjects[x].loop(true);

		}

		
		
		// allPopcornObjects[1].play();
		// allPopcornObjects[1].mute()
		// allPopcornObjects[1].loop(true);

		// allPopcornObjects[0].cue(10, function(){
		// 		console.log("Playing first video");
		// 		this.play();
		// 		this.loop(true);
		// 		this.cue(16, function(){
		// 			this.pause();
		// 			allPopcornObjects[1].play(2);
		// 			allPopcornObjects[1].loop(true);
		// 			allPopcornObjects[1].cue(40, function(){
		// 						// this.pause();
		// 						allPopcornObjects[1].pause();
		// 						allPopcornObjects[1].loop(false);
		// 						this.play(6);
		// 					});

		// 		});
		// 	});

		allPopcornObjects[0].cue(40, function(){
				this.pause();
				allPopcornObjects[0].play(6);
			});

  });



