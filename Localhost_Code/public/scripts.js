var buttonpress = 1;
$(document).ready(function(){
	console.log("Aye Captain, We are ready!");

$("#me").click(function(){
	console.log(buttonpress);
	if(buttonpress%2 !== 0){
	console.log("Button clicked!!");
	var displayText = "<p id='theinput'>Kumudzi is a new Malawian start-up founded by Ellen Chilemba, Amanda Sefu and Mac Davel Kalumbi that aims to connect tourists visiting Malawi with local host families.</p>";	$("#theinput").replaceWith(displayText);
buttonpress++;
}
else{
	var displayT = "<div id='theinput'></div>";
	$("#theinput").replaceWith(displayT);
	buttonpress++;
}

});



});