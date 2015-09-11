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



function requestToken(callback){
	chrome.windows.create(

		{'url' : 'https://sso.godaddy.com/login?realm=idp&app=shortener&path=/',
			'width' : 580,
			'height' : 400
		},

		function(popupWindow){

			chrome.tabs.query({active : true}, function(tabs){
					chrome.tabs.onUpdated.addListener(

						function fetchAPIKey(){
							chrome.cookies.get({"url": 'https://shortener.godaddy.com', "name": 'ShopperId1'}, function(cookie){
								if (cookie) {
									parseWebPage("https://shortener.godaddy.com/v1/apikey", function(res){
										localStorage.APIKey = res;
									});
									chrome.windows.remove(popupWindow.id);
									callback();
									chrome.tabs.onUpdated.removeListener(fetchAPIKey);
								}
								else localStorage.APIKey = "fuck";
							});
						}

					);
				}
			);			

		}
	);
}