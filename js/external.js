function parseWebPage(url, callback) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange=function()
	{
		if (xmlHttp.readyState == 4)
		{
			callback(xmlHttp.responseText);
		}
	}

	xmlHttp.open("GET", url, true); 
	xmlHttp.send();
}

function openAccountManagingTab(){
	chrome.tabs.create({'url' : 'https://shortener.godaddy.com'});
}

function requestAPIKey(callback){
	chrome.windows.create(

	{
		'url' : 'https://sso.godaddy.com/login?realm=idp&app=shortener&path=/',
		'width' : 580,
		'height' : 700
	},

	function(popupWindow){
		localStorage.loginPopup = popupWindow.id;
		chrome.tabs.query({active : true}, function(tabs){
			chrome.tabs.onUpdated.addListener(

				function fetchAPIKey(){
					chrome.cookies.get({"url": 'https://shortener.godaddy.com', "name": 'auth_idp'}, function(cookie){
						if (cookie) {
							parseWebPage("https://shortener.godaddy.com/v1/apikey", function(res){
								if (res != 'Unauthorized'){
									localStorage.APIKey = res;
									chrome.tabs.onUpdated.removeListener(fetchAPIKey);
									chrome.windows.remove(popupWindow.id);
									callback(res);
								}
							});
						}
					});
				}

				);
		});			

	});
}

function shortenCurrentURL(callback){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		shortenAPIRequest = "https://shortener.godaddy.com/v1/?apikey=" + localStorage.APIKey + "&url=" + encodeURI(tabs[0].url);
		localStorage.shortenedURLreq = tabs[0].url;
		parseWebPage(shortenAPIRequest, callback);
	});
}

function customShortenCurrentURL(callback, optional_parameters){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		shortenAPIRequest = "https://shortener.godaddy.com/v1/?apikey=" + localStorage.APIKey + '&' + optional_parameters;
		localStorage.shortenedURLreq = tabs[0].url;
		parseWebPage(shortenAPIRequest, callback);
	});
}