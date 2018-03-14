// Check the text of the webpage for the search term "2012"
if(document.body.innerText.search("2012") != -1){
//	document.body.innerHTML = document.body.innerHTML.replace("2012", "<i>2012</i>")
	chrome.runtime.sendMessage({bravo: "2012"}, function(response) {});	
}
