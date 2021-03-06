function share(jsonObj, shortURL){
	if (shortURL != NULL_URL){
		chrome.tabs.query({
			active : true,
			currentWindow : true
		}, function(tabs) {
			chrome.windows.create(jsonObj, function(popupWindow){
				chrome.tabs.query({active : true}, function(tabs){
					chrome.tabs.onUpdated.addListener(function(){
				});
				});	
			}
			);
		});
	}
	else{
		Materialize.toast('Nothing to share!', TOAST_TIME);
	}
}

function fbShare(shortURL) {
	var reqObj = {
		'url' : "https://www.facebook.com/sharer/sharer.php?"
		+ "u=" + encodeURI(shortURL)
	};
	share(reqObj, shortURL)
}

function inShare(shortURL){
	var reqObj = {
		'url' : "https://www.linkedin.com/shareArticle?"
		+ "mini=true&"
		+ "url=" + encodeURI(shortURL)
	};	
	share(reqObj, shortURL);
}

function twShare(shortURL){
	var reqObj = {
		'url' : "https://twitter.com/intent/tweet?"
		+ "&ref_src=twsrc%5Etfw"
		+ "&tw_p=tweetbutton"
		+ "&url=" + encodeURI(shortURL)
	};	
	share(reqObj, shortURL);
}