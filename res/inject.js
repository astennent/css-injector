chrome.storage.sync.get(null, function(items) {
    var allKeys = Object.keys(items);
    var currentURL = document.URL;
    var matches = [];
    for (index in allKeys) {
    	var regexStr = allKeys[index];
    	if (currentURL.match(regexStr) !== null) {
    		matches.append(regexStr);
    		console.log("Matched rule: " + regexStr);
    	}

    }

    chrome.storage.sync.get(matches, function(x) {
		console.log(x);
	});
});

function applyStyleString(cssStr) {
	console.log(cssStr);
	chrome.tabs.insertCSS( {'code':cssStr} );
}