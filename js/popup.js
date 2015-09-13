TOAST_TIME = 1400
CARD_SWITCH_TIME = 500
NULL_URL = "none"

function apiKeyObtained(){
	Materialize.toast("We've got an APIKey!", TOAST_TIME);
	startApp();
}

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
	$("#short-url-container").animate({
		left: parseInt(-$("#content-wrapper").outerWidth())
	}, CARD_SWITCH_TIME, "easeInOutQuad", function(){
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
	});	
	
	$("#short-url-container").animate({
		left: parseInt($("#content-wrapper").outerWidth())
	}, 0, "easeInOutQuad", function(){

		$("#short-url-container").animate({
			left: 0
		}, CARD_SWITCH_TIME, "easeInOutQuad", function(){});
		
	});
}

function startApp(){

	// localStorage.removeItem("APIKey");

	if (localStorage.validAPIKey == 1 && localStorage.getItem("APIKey") != null && localStorage.APIKey!='Unauthorized'){
		console.log(localStorage.APIKey);

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
		$('#manual-api-key-btn').click(function(){
			console.log = $('#manual-api-key-form').serialize();
			apiKeyObtained();
		});

		$("#non-api-content-wrapper").show();
		requestAPIKey(apiKeyObtained);
	});

}

document.addEventListener('DOMContentLoaded', function(){ 
	$("#content-wrapper").hide();
	$("#non-api-content-wrapper").hide();
	startApp();
});