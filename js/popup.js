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

function setAPIKeyInvalid(){
	localStorage.validAPIKey = 0;
	$("#content-wrapper").fadeOut(FADE_TRANSITIONS_TIME, function(){
		resetApp();
	});
}

function shortenAnother(){
	$("#custom-url").val("");
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

function setOutputContent(shortURL, shortenedURL){
	$('#short-url').text(shortURL);
	$('#shortened-url').text(shortenedURL);

	$("#shortener-input").animate({
		left: parseInt(-$("#content-wrapper").outerWidth())
	}, CARD_SWITCH_TIME, "easeInOutCubic", function(){

		$("#shortener-input").hide();
		$("#shortener-output").animate({
			left: parseInt($("#content-wrapper").outerWidth())
		}, 0, "easeInOutCubic", function(){

			$("#shortener-output").show();
			$("#shortener-output").animate({
				left: 0
			}, CARD_SWITCH_TIME, "easeInOutCubic", function(){
			});

		});

	});	
}

function checkGeneratedURL(newName){
	try {
		var obj = JSON.parse(newName);
	} catch (e) {

		if (newName == "Unauthorized") {
			setAPIKeyInvalid();

			return;
		}

		localStorage.shortenedURL = localStorage.shortenedURLreq;
		localStorage.shortURL = newName;

		setOutputContent(localStorage.shortURL, localStorage.shortenedURL)

		return;
	}

	localStorage.shortenedURL = NULL_URL;
	localStorage.shortURL = NULL_URL;

	if (obj.fields[0].code == "INVALID_TARGET_URL")	{
		$('#long-url').removeClass('valid');
		$('#long-url').addClass('invalid');
	}
	else if (obj.fields[0].code == "INVALID_CODE")	{
		$('#custom-url').removeClass('valid');
		$('#custom-url').addClass('invalid');
	}
	else setOutputContent("Error!", obj.fields[0].code);

}

function startApp(){

	if (localStorage.validAPIKey == 1 && localStorage.getItem("APIKey") != null && localStorage.APIKey!='Unauthorized'){

		initAPIKeyForm();
		initAPIKeyBtns();

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

		/*Init Select Box*/
		$('select').material_select();

	} else {

		/*Non api key app routine*/

		$('#manual-api-key-btn').click(function(){
			var inputKey = $('#manual-api-key-form').serialize().slice($('#manual-api-key-form').serialize().search("=")+1);
			if (inputKey.length > 0){
				localStorage.APIKey = inputKey;
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
	}
}

document.addEventListener('DOMContentLoaded', function(){ 
	$("#content-wrapper").hide();
	$("#non-api-content-wrapper").hide();
	$("#shortener-output").hide();
	startApp();
});