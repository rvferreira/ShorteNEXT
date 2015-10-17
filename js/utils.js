TOAST_TIME = 1400
CARD_SWITCH_TIME = 300
FADE_TRANSITIONS_TIME = 400
NULL_URL = "none"

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

function initAPIKeyBtns(){

	/*SideNav*/
	$('#logout-btn').click(function(){
		setAPIKeyInvalid();
	});

	/*API Input*/


	function resetApp(){
		location.reload();
	}

	$('#refresh-domain-btn').bind('click', function(){
		$(this).unbind('click');
		fetchDomainsList(localStorage.APIKey, resetApp);
	});

	$('#shorten-btn').click(function(){
		localStorage.defaultDomain = ($("#domain-opt option:selected").text());
		customShortenCurrentURL(checkGeneratedURL, $('#custom-url-form [id!="long-url"]').serialize() + '&' + $('#custom-url-form #long-url').serialize());
	});

	$('#long-url').click(function(){
		$('#long-url').select();
		$('#long-url').removeClass('invalid');
	});

	/*API Output*/

	$('#short-url').click(function(){
		copyURLToClipboard(localStorage.shortURL);
	});

	$('#shorten-another-btn').click(function(){
		shortenAnother();
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
}

function initAPIKeyForm(){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		$("#long-url").val(tabs[0].url);
	});
	
	// if (localStorage.shortURL && localStorage.shortURL != NULL_URL){	
	// 	$('#short-url').text(localStorage.shortURL);
	// 	$('#shortened-url').text(localStorage.shortenedURL);	
	// } else {
	// 	$('#short-url').text("http://x.co/shortlnk");
	// 	$('#shortened-url').text("http://www.full.link.example");	
	// }
}

function resetApp(){
	localStorage.shortenedURL = NULL_URL;
	localStorage.shortURL = NULL_URL;
	location.reload();
}