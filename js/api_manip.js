function parseWebPage(url, callback) {
	console.log(decodeURI(url));
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



function requestAPIKey(callback){
	chrome.windows.create(

		{
			'url' : 'https://sso.godaddy.com/login?realm=idp&app=shortener&path=/',
			'width' : 580,
			'height' : 700
		},

		function(popupWindow){

			chrome.tabs.query({active : true}, function(tabs){
					chrome.tabs.onUpdated.addListener(

						function fetchAPIKey(){
							chrome.cookies.get({"url": 'https://shortener.godaddy.com', "name": 'ShopperId1'}, function(cookie){
								if (cookie) {
									parseWebPage("https://shortener.godaddy.com/v1/apikey", function(res){
										if (res != 'Unauthorized'){
											localStorage.APIKey = res;
											callback(res);
											chrome.windows.remove(popupWindow.id);
											chrome.tabs.onUpdated.removeListener(fetchAPIKey);
										}
									});
								}
							});
						}

					);
				}
			);			

		}
	);
}

function shortenCurrentURL(callback){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		shortenAPIRequest = "https://shortener.godaddy.com/v1/?apikey=" + localStorage.APIKey + "&url=" + tabs[0].url;
		localStorage.shortenedURLreq = tabs[0].url;
		parseWebPage(shortenAPIRequest, callback);
	});
}

function customShortenCurrentURL(callback, optional_parameters){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		shortenAPIRequest = "https://shortener.godaddy.com/v1/?apikey=" + localStorage.APIKey + "&url=" + tabs[0].url + '&' + optional_parameters;
		localStorage.shortenedURLreq = tabs[0].url;
		parseWebPage(shortenAPIRequest, callback);
	});
}