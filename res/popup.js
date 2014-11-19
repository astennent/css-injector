
// Document On-load function
document.addEventListener('DOMContentLoaded', function() {
	chrome.tabs.query({'active': true}, function (tabs) {
		
		// Fill in the a default regex based on the current url.
		const regexTextfield = document.getElementById("new-rule-regex");
		const currentURL = tabs[0].url;
		const domainRegex = /^.*\/\/.*?\//; // May not work with everything, but it's good enough.
		const currentDomain = currentURL.match(domainRegex);
		regexTextfield.value = currentDomain + "*"; // Asterisk to match trailing stuff.


		function addRule(regexStr) {
			var node = document.createElement('iframe');
			node.src = "rule.html";
		    node.innerHTML = regexStr;
		    document.body.appendChild(node);
		}

		// Find existing rules and add them.
		for (var i = 0 ; i < 3 ; i++ ) {
			addRule("x" + i)
		}


	});


	document.getElementById("test-btn").addEventListener("click", function(){
		var customCSS = document.getElementById("new-rule-content").value;
	    testStyleString(customCSS);
	});

	document.getElementById("save-btn").addEventListener("click", function(){
		var customCSS = document.getElementById("new-rule-content").value;
		var regex = document.getElementById("new-rule-regex").value;
	    saveStyleString(customCSS, regex);
	});
});

function testStyleString(cssStr) {
	console.log(cssStr);
	chrome.tabs.insertCSS( {'code':cssStr} );
}

function saveStyleString(cssStr, regex) {
	var kvp = {};
	kvp[regex] = cssStr;
	// Save it using the Chrome extension storage API.
    chrome.storage.sync.set(kvp, function() {
      // Notify that we saved.
      alert('StyleSheet saved');
    });
}

function clearStorage() {
	// This might not work.
	StorageArea.clear();
}
