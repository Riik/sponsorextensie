const API = "http://csrdelft.nl/API/2.0/sponsorlinks";
const API_TIMESTAMP = API + "/timestamp";
const SPONSOR_LINK_FORMAT = atob("aHR0cHM6Ly93d3cuc3BvbnNvcmtsaWtzLmNvbS9saW5rLnBocD9jbHViPXtjbHViX2lkfSZzaG9wX2lkPXtzaG9wX2lkfSZzaG9wPXtzaG9wX25hbWV9");
const URLS_KEY = "urls";
const CLUBID_KEY = "club_id";
const LASTCHECK_KEY = "lastcheck";
const TIMESTAMP_KEY = "timestamp";
const NOTIFICATION_ID = "sponsor-notification";
const UPDATE_CHECK_INTERVAL = 600;
const CUSTOM_TARGETS = {
    'www.bol.com': {
        'shop_name': "bol.com",
        'link': 'https://partnerprogramma.bol.com/click/click?p=1&t=url&s=2379&url=https%3A//www.bol.com/nl/index.html&f=TXL&name=tekstlink'
    }
};
const CHROME = typeof browser === 'undefined';

if (CHROME) {
    browser = chrome;
}

//document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Cadeaubon", "g"), "testsetst");

function checkUpdate() {
    getStorage(storage => {
        if (typeof storage[URLS_KEY] !== 'undefined') {
            const lastCheck = storage[LASTCHECK_KEY] || 0;
            if (lastCheck < unixDayAgo()) {
                const lastTimestamp = storage[TIMESTAMP_KEY] || 0;
                $.get(API_TIMESTAMP, function (timestamp) {
                    if (lastTimestamp < parseInt(timestamp)) {
                        browser.storage.local.set({
                            [LASTCHECK_KEY]: unixTime(new Date()),
                            [TIMESTAMP_KEY]: timestamp
                        });
                        updateURLs();
                    }
                });
            }
        } else {
            updateURLs();
        }
    });
}

function updateURLs() {
    $.getJSON(API, function (data) {
        browser.storage.local.set({
            [CLUBID_KEY]: data[CLUBID_KEY],
            [URLS_KEY]: data['affiliates']
        });
    });
}/* 

function navigateTo(tabId, target) {
    browser.tabs.update(tabId, {url: target});
}

function formatLink(clubid, data) {
    data['club_id'] = clubid;
    return SPONSOR_LINK_FORMAT.replace(/{(.+?)}/g, function (match, key) {
        return typeof data[key] !== 'undefined' ? data[key] : match;
    });
}

function enableLinking(link, target, tabId, hostname, notificationTitle) {
    // Page action
    browser.pageAction.show(tabId);
    browser.pageAction.onClicked.addListener(function () {
        sponsortabs[tabId] = hostname;
        browser.notifications.clear(NOTIFICATION_ID);
        navigateTo(tabId, link);
    });

    // Notification
    browser.notifications.create(NOTIFICATION_ID, {
        type: "basic",
        title: notificationTitle,
        message: "U bent deel van de mooiste lichting van C.S.R.!",
        iconUrl: browser.extension.getURL("icons/icon128.png")
    }, function (nId) {
    });

    browser.notifications.onClicked.addListener(function (notificationId) {
        if (notificationId === NOTIFICATION_ID) {
            sponsortabs[tabId] = hostname;
            browser.notifications.clear(notificationId);
            navigateTo(tabId, link);
        }
    });
}

function handleCustomTarget(target, tabId, url, hostname) {
    // Check if we're still visiting the same site we already went through a sponsored link for
    if (hostname === sponsortabs[tabId]) {
        return;
    }

    enableLinking(
        "https://www.youtube.com/watch?v=wEvQ9xAjltQ",
        target,
        tabId,
        hostname,
        "2012 b'vo"
    );
}

function navigationCompleteListener(event) {
//	if(document.body.innerHTML.search("Cadeaubon") != -1){
//			    return handleCustomTarget(custom_target, tabId, url, hostname);
//		} 
	console.log("handling link")
	console.log(document.body)
	

    getStorage(storage => {
        const tabId = event.tabId;
        const url = event.url;
        const hostname = extractHostname(url);
        const nowww_hostname = hostname.replace(/^(www\.)/,"");
        const custom_target = CUSTOM_TARGETS[hostname];
		console.log("handeling stoar")
		
		chrome.tabs.get(tabId, function(tab){
			  chrome.windows.get(tab.windowId, function(win){ 
				   console.log(win.document); // THIS IS THE WINDOW OBJECT
			  });
		 });
		
		
       //If we have a custom affiliate link for the current target
        //if (custom_target) {
            //return handleCustomTarget(custom_target, tabId, url, hostname);
        //}
 	
/*
 		
        const urls = storage[URLS_KEY];
        const targets = (nowww_hostname !== hostname) ? (urls[hostname] || []).concat(urls[nowww_hostname]) : urls[hostname] ;


        // If we're not on a sponsored link capable page: return
        if (!targets) {
            return;
        }

        // Check if we're still visiting the same site we already went through a sponsored link for
        if (hostname === sponsortabs[tabId]) {
            return;
        }

        // TODO: Implement support for multiple targets per hostname
        const target = targets[0];

        enableLinking(
            formatLink(storage[CLUBID_KEY], target),
            target,
            tabId,
            hostname,
            target['shop_name'] + " heeft ook een gesponsorde link!"
        ); 

    });

}

function extractHostname(url) {
    //find & remove protocol (http, ftp, etc.) and get hostname, then find & remove "?"
    return ((url.indexOf("://") > -1) ? url.split('/')[2] : url.split('/')[0]).split('?')[0];
} */

function getStorage(key, callback) {
    if (!callback || typeof callback !== 'function') {
        callback = key;
        key = false;
    }

    if (CHROME) {
        if (key) {
            browser.storage.local.get(key, callback);
        } else {
            browser.storage.local.get(callback);
        }
    } else {
        const promise = (key) ? browser.storage.local.get(key) : browser.storage.local.get();
        promise.then(callback);
    }
}

/**
 * Return the unix timestamp of 1 day ago
 */
function unixDayAgo() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return unixTime(d);
}

function unixTime(date) {
    return Math.round((date.getTime() / 1000));
}
