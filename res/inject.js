chrome.storage.sync.get(null, function(items) {
    var allKeys = Object.keys(items);
    var currentURL = document.URL;
    var matches = [];
    for (index in allKeys) {
        var regexStr = allKeys[index];
    	if (currentURL.match(regexStr) !== null) {
    		matches.push(regexStr);
    	}

    }
    chrome.storage.sync.get(matches, function(matchingRules) {
        for (rule in matchingRules) {
            var cssStr = matchingRules[rule];
            applyStyleString(cssStr);
        }
	});
});

function applyStyleString(str) {
    var node = document.createElement('style');
    node.innerHTML = str;
    document.body.appendChild(node);
}