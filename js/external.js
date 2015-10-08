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
	chrome.tabs.create({'url' : 'https://shortener.godaddy.com/settings'});
}

function fetchDomainsList(APIKey, validAPIKeycallback){
	parseWebPage("https://shortener.godaddy.com/v1/domains?apikey=" + APIKey, function(res){
		if (res != 'Unauthorized'){
			localStorage.domains = res;
			validAPIKeycallback();
		}
		else{
			$('#apy-key-manual-input').removeClass('valid');
			$('#apy-key-manual-input').addClass('invalid');
			Materialize.toast("Invalid APIKey!", TOAST_TIME * 1.5);
		}
	});
}

function requestAPIKey(testAPIKeyCallback, validAPIKeyCallback){
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
									testAPIKeyCallback(res, validAPIKeyCallback);
									chrome.windows.get(popupWindow.id, function(){
										if (!chrome.runtime.lastError) chrome.windows.remove(popupWindow.id);
									});
								}
							});
						}
					});
				}

				);
		});			

	});
}

function customShortenCurrentURL(callback, optional_parameters){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		shortenAPIRequest = "https://shortener.godaddy.com/v1/?apikey=" + localStorage.APIKey + '&' + optional_parameters;
		localStorage.shortenedURLreq = tabs[0].url;
		parseWebPage(shortenAPIRequest, callback);
	});
}