TOAST_TIME = 1400
CARD_SWITCH_TIME = 300
NULL_URL = "none"

function resetApp(){
	localStorage.shortenedURL = NULL_URL;
	localStorage.shortURL = NULL_URL;
	$('#non-api-content-wrapper *').off();
	$('#content-wrapper *').off();
	$('select').material_select('destroy');
	$('#non-api-content-wrapper').hide();
	$('#content-wrapper').hide();
	location.reload();
}

function apiKeyObtained(){
	if (localStorage.validAPIKey != 1){
		localStorage.validAPIKey = 1;
		Materialize.toast("We've got an APIKey!", TOAST_TIME);
		startApp();
	}
}

function copyURLToClipboard(shortURL) {
	if (shortURL != NULL_URL) {
		var copyFrom = $('<textarea/>');
		copyFrom.text(shortURL);
		$('body').append(copyFrom);
		copyFrom.select();
		document.execCommand('copy');
		copyFrom.remove();
		Materialize.toast('Copied!', TOAST_TIME);
	} else {
		Materialize.toast('Nothing to copy!', TOAST_TIME);
	}
}

function setCardName(shortURL, shortenedURL){
	$("#short-url-container").animate({
		left: parseInt(-$("#content-wrapper").outerWidth())
	}, CARD_SWITCH_TIME, "easeInOutCubic", function(){
		$('#short-url').text(shortURL);
		$('#shortened-url').text(shortenedURL);
	});	
	
	$("#short-url-container").animate({
		left: parseInt($("#content-wrapper").outerWidth())
	}, 0, "easeInOutCubic", function(){

		$("#short-url-container").animate({
			left: 0
		}, CARD_SWITCH_TIME, "easeInOutCubic", function(){});
		
	});
}

function checkGeneratedURL(newName){
	try {
		var obj = JSON.parse(newName);
	} catch (e) {

		if (newName == "Unauthorized") {
			localStorage.validAPIKey = 0;
			resetApp();

			return;
		}

		localStorage.shortenedURL = localStorage.shortenedURLreq;
		localStorage.shortURL = newName;

		setCardName(localStorage.shortURL, localStorage.shortenedURL)

		return;
	}

	localStorage.shortenedURL = NULL_URL;
	localStorage.shortURL = NULL_URL;

	setCardName("Error!", obj.fields[0].code);

}

function startApp(){

	if (localStorage.validAPIKey == 1 && localStorage.getItem("APIKey") != null && localStorage.APIKey!='Unauthorized'){
		
		$("#non-api-content-wrapper").hide();
		$("#content-wrapper").show();

		/*Init text fields*/
		if (localStorage.shortURL && localStorage.shortURL != NULL_URL){	
			$('#short-url').text(localStorage.shortURL);
			$('#shortened-url').text(localStorage.shortenedURL);	
		} else {
			$('#short-url').text("http://x.co/shortlnk");
			$('#shortened-url').text("http://www.full.link.example");	
		}

		/*BTNs init*/

		$('select').material_select();
		$('#shorten-button').click(function(){
			shortenCurrentURL(checkGeneratedURL);
		});

		$('#custom-shorten-button').click(function(){
			customShortenCurrentURL(checkGeneratedURL, decodeURI($('#custom-url-form').serialize()));
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

		/*Non api key app routine*/

		$('#manual-api-key-btn').click(function(){
			var inputKey = $('#manual-api-key-form').serialize().slice($('#manual-api-key-form').serialize().search("=")+1);
			if (inputKey.length > 0){
				localStorage.APIKey = inputKey;
				chrome.windows.remove(parseInt(localStorage.loginPopup));
				localStorage.removeItem("loginPopup");
				apiKeyObtained();
			}
		});

		localStorage.shortenedURL = NULL_URL;
		localStorage.shortURL = NULL_URL;

		$("#non-api-content-wrapper").show();
		requestAPIKey(apiKeyObtained);
	});

}

document.addEventListener('DOMContentLoaded', function(){ 
	$("#non-api-content-wrapper").hide();
	$("#content-wrapper").hide();
	localStorage.appStarted = 0;
	startApp();
});