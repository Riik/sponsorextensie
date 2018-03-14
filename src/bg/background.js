// This page checks for message from the content script, and displays notification if it finds something 

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	if(request.bravo == "2012"){
		chrome.notifications.create("bravo-notification", {
			type: "basic",
			title: "2012 braviale melding",
			message: "U bent deel van de mooiste lichting van C.S.R.!",
			iconUrl: chrome.extension.getURL("icons/icon128.png")
		}, function (nId) {
		});
	}
  });
  
 random_urls = [ 
	"http://www.2012.com",
	"https://joop.bnnvara.nl/", 
	"https://nl.wikipedia.org/wiki/2012", 
	"https://csrdelft.nl/forum/deel/107",
	"https://csrdelft.nl/fotoalbum/2012-2013/12-08-27-31%20Novitiaat/#/plaetjes/fotoalbum/2012-2013/12-08-27-31%20Novitiaat/27-08%20Maandag/",
	"https://www.youtube.com/watch?v=xY_MUB8adEQ",
	"https://www.google.nl/search?q=anker+en+boei&source=lnms&tbm=isch&sa=X&ved=0ahUKEwjq6emA0uzZAhUhDsAKHbKGAd0Q_AUICigB&biw=1745&bih=885", 
	"https://www.youtube.com/watch?v=Adc2zphOP5I",
	"https://www.bureauboeiend.nl/"
 ]
  
chrome.notifications.onClicked.addListener(function (notificationId) {
	rand_url = random_urls[Math.floor(Math.random() * random_urls.length)];
	if (notificationId === "bravo-notification") {
		chrome.notifications.clear(notificationId);
		chrome.tabs.create({'url': rand_url})
	}
});