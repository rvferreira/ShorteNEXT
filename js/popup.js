function set_iframe_content(APIKey){ //TODO remove this function
	console.log("APIKey:" + APIKey);	
}

function setCardName(newName){
	$('#short-url').text(newName);
	$('#shortened-url').text(localStorage.shortenedURL);

}

function startApp(){

	if (localStorage.APIKey && localStorage.APIKey!='Unauthorized'){
		set_iframe_content("db "+localStorage.APIKey);
	}
	else chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
		requestAPIKey(set_iframe_content);
	});

	$('select').material_select();
	$('#shorten-button').click(function(){
		shortenCurrentURL(setCardName);
	});

	$('#custom-shorten-button').click(function(){
		customShortenCurrentURL(setCardName, $('#custom-url-form').serialize());
	});
	

}

document.addEventListener('DOMContentLoaded', function(){ 
	startApp();
});