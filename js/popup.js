TOAST_TIME = 1400
NULL_URL = "none"

function copyURLToClipboard(url) {
	if (url != NULL_URL) {
		var copyFrom = $('<textarea/>');
		copyFrom.text(url);
		$('body').append(copyFrom);
		copyFrom.select();
		document.execCommand('copy');
		copyFrom.remove();
		Materialize.toast('Copied!', TOAST_TIME);
	} else {
		Materialize.toast('Nothing to copy!', TOAST_TIME);
	}
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

	$('#short-url').text("Error!");
	$('#shortened-url').text(obj.fields[0].code);

	localStorage.shortenedURL = NULL_URL;
	localStorage.shortURL = NULL_URL;	
}

function startApp(){

	if (localStorage.APIKey && localStorage.APIKey!='Unauthorized'){

		/*Init text fields*/
		if (localStorage.shortURL != NULL_URL){	
			$('#short-url').text(localStorage.shortURL);
			$('#shortened-url').text(localStorage.shortenedURL);	
		} else {
			$('#short-url').text("http://x.co/shortlnk");
			$('#shortened-url').text("http://www.full.link.example");	
		}

		/*BTNs init*/

		$('select').material_select();
		$('#shorten-button').click(function(){
			shortenCurrentURL(setCardName);
		});

		$('#custom-shorten-button').click(function(){
			customShortenCurrentURL(setCardName, decodeURI($('#custom-url-form').serialize()));
		});

		$('#short-url').click(function(){
			copyURLToClipboard(localStorage.shortURL);
		});

		$('#clipboard-copy-btn').click(function(){
			copyURLToClipboard(localStorage.shortURL);
		});

		/*External APIs*/

		$('#fb-share-btn').click(function(){
			fbShare(localStorage.shortURL);
		});

		$('#tw-share-btn').click(function(){
			twShare(localStorage.shortURL);
		});

		$('#in-share-btn').click(function(){
			inShare(localStorage.shortURL);
		});

	} else chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
		requestAPIKey(startApp);
	});

}

document.addEventListener('DOMContentLoaded', function(){ 
	startApp();
});