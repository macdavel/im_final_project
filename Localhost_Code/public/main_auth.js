console.log("Loaded!");

$(document).ready(function(){
	$('#twitterAuth').click(function(){
		document.location.href = '/auth/youtube';
	});

  $('#logout').click(function(){
    document.location.href = '/logout';
  });
});