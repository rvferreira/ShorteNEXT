TOAST_TIME = 1400

function copyTextToClipboard(text) {
	var copyFrom = $('<textarea/>');
	copyFrom.text(text);
	$('body').append(copyFrom);
	copyFrom.select();
	document.execCommand('copy');
	copyFrom.remove();
	Materialize.toast('Copied!', TOAST_TIME);
}

function apiKeyObtained(APIKey){ //TODO remove this function
	console.log("APIKey: " + APIKey);	
	Materialize.toast('API Key Successfully obtained!', TOAST_TIME);
}

function setCardName(newName){
	
	try {
		var obj = JSON.parse(newName);
	} catch (e) {
		localStorage.shortenedURL = localStorage.shortenedURLreq;
		localStorage.shortURL = newName;

		$('#short-url').text(localStorage.shortURL);
		$('#shortened-url').text(localStorage.shortenedURL);

		return;
	}

	localStorage.shortenedURL = obj.fields[0].code;
	localStorage.shortURL = "Error!";

	$('#short-url').text(localStorage.shortURL);
	$('#shortened-url').text(localStorage.shortenedURL);
}

function startApp(){

	if (localStorage.APIKey && localStorage.APIKey!='Unauthorized'){
		apiKeyObtained(localStorage.APIKey + " (from localStorage)");
	}
	else chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
		requestAPIKey(apiKeyObtained);
	});

		$('select').material_select();
		$('#shorten-button').click(function(){
			shortenCurrentURL(setCardName);
		});

		$('#short-url').click(function(){
			copyTextToClipboard($('#short-url').text());
		});

		$('#clipboard-copy-btn').click(function(){
			copyTextToClipboard($('#short-url').text());
		});

		$('#custom-shorten-button').click(function(){
			customShortenCurrentURL(setCardName, decodeURI($('#custom-url-form').serialize()));
		});

	}

	document.addEventListener('DOMContentLoaded', function(){ 
		startApp();
	});