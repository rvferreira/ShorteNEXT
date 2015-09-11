function set_iframe_content(APIKey){ //TODO remove this function
	console.log(APIKey);
	$('#ext-main').show();
	// $('#ext-main').attr('src', 'http://anycom.herokuapp.com?url=&#8221');	
}

function startApp(){

	chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
		$('#ext-main').hide();
		requestToken(set_iframe_content);
	});
}

document.addEventListener('DOMContentLoaded', function(){ 
	startApp();
});

