function set_iframe_content(){ //TODO remove this function
	console.log((localStorage.accessToken));
	$('#ext-main').show();
	$('#ext-main').attr('src', 'https://shortener.godaddy.com');	
}

function startApp(){

	chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
		//if (localStorage.accessToken){} //TODO
		$('#ext-main').hide();
		requestToken(set_iframe_content);
	});
}

document.addEventListener('DOMContentLoaded', function(){ 
	startApp();
});