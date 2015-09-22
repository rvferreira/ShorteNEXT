TOAST_TIME = 1400
CARD_SWITCH_TIME = 300
FADE_TRANSITIONS_TIME = 400
NULL_URL = "none"

function resetApp(){
	localStorage.shortenedURL = NULL_URL;
	localStorage.shortURL = NULL_URL;
	location.reload();
}

function apiKeyObtained(){
	if (localStorage.validAPIKey != 1){
		localStorage.validAPIKey = 1;
		Materialize.toast("We've got an APIKey!", TOAST_TIME * 1.5);
		$("#non-api-content-wrapper").fadeTo(FADE_TRANSITIONS_TIME, 0.0, function(){
			localStorage.recentKey = 1;
			startApp();
		});
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
	$('#short-url').text(shortURL);
	$('#shortened-url').text(shortenedURL);

	$("#shortener-input").animate({
		left: parseInt(-$("#content-wrapper").outerWidth())
	}, CARD_SWITCH_TIME, "easeInOutCubic", function(){
		fix_size = parseInt($("#shortener-ui").outerHeight());
		console.log(fix_size);
		$("#shortener-input").hide();

		$("#shortener-output").animate({
			left: parseInt($("#content-wrapper").outerWidth())
		}, 0, "easeInOutCubic", function(){

			$("#shortener-output").show();
			// $("#shortener-ui").height(fix_size);
			$("#shortener-output").animate({
				left: 0
			}, CARD_SWITCH_TIME, "easeInOutCubic", function(){
			});

		});

	});	
}

function shortenAnother(){
	$("#shortener-output").animate({
		left: parseInt($("#content-wrapper").outerWidth())
	}, CARD_SWITCH_TIME, "easeInOutCubic", function(){
		$("#shortener-output").hide();

		$("#shortener-input").animate({
			left: parseInt(-$("#content-wrapper").outerWidth())
		}, 0, "easeInOutCubic", function(){

			$("#shortener-input").show();
			$("#shortener-input").animate({
				left: 0
			}, CARD_SWITCH_TIME, "easeInOutCubic", function(){});

		});

	});	
}

function checkGeneratedURL(newName){
	try {
		var obj = JSON.parse(newName);
	} catch (e) {

		if (newName == "Unauthorized") {
			localStorage.validAPIKey = 0;
			$("#content-wrapper").fadeOut(FADE_TRANSITIONS_TIME, function(){
				resetApp();
			});

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
		
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
			$("#long-url").val(tabs[0].url);
		});

		$("#non-api-content-wrapper").hide();
		if (localStorage.recentKey == 1){
			$("body").animate({height:350}, FADE_TRANSITIONS_TIME, function(){
				$("#content-wrapper").fadeIn(FADE_TRANSITIONS_TIME);
			});
			localStorage.removeItem("recentKey");
		}
		else {
			$("#content-wrapper").show();
		}

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

		$('#shorten-btn').click(function(){
			customShortenCurrentURL(checkGeneratedURL, decodeURI($('#custom-url-form').serialize()));
		});

		$('#shorten-another-btn').click(function(){
			shortenAnother();
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
				localStorage.removeItem("loginPopup");
				apiKeyObtained();
			}
		});

		$('#login-btn').click(function(){
			requestAPIKey(apiKeyObtained);
		});

		localStorage.shortenedURL = NULL_URL;
		localStorage.shortURL = NULL_URL;

		$("body").animate({height:560}, FADE_TRANSITIONS_TIME, function(){
			$("#non-api-content-wrapper").fadeIn(FADE_TRANSITIONS_TIME);
		});
	});

}

document.addEventListener('DOMContentLoaded', function(){ 
	$("#non-api-content-wrapper").hide();
	$("#shortener-output").hide();
	$("#content-wrapper").hide();
	localStorage.appStarted = 0;
	startApp();
});