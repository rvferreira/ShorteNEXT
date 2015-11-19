TOAST_TIME = 1400
CARD_SWITCH_TIME = 300
FADE_TRANSITIONS_TIME = 400
NULL_URL = "none"

function setShortenBtn(){
	$('#shorten-btn').one('click', function(){
		if(localStorage.shortenBtnClickable){
			localStorage.defaultDomain = ($("#domain-opt option:selected").text());
			customShortenCurrentURL(checkGeneratedURL, $('#custom-url-form [id!="long-url"]').serialize() + '&' + $('#custom-url-form #long-url').serialize());
		}
	});
}

function setShortenAnotherBtn(){
	$('#shorten-another-btn').one('click', function(){
		shortenAnother();
	});
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

function initAPIKeyBtns(){
	localStorage.shortenBtnClickable = true;

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

	setShortenBtn();

	$('#long-url').click(function(){
		$('#long-url').select();
		$('#long-url').removeClass('invalid');
	});

	/*API Output*/

	$('#short-url').click(function(){
		copyURLToClipboard(localStorage.shortURL);
	});

	setShortenAnotherBtn();

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
}

function resetApp(){
	localStorage.shortenedURL = NULL_URL;
	localStorage.shortURL = NULL_URL;
	location.reload();
}