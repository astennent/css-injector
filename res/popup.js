{
	function onload() {
		chrome.tabs.query({'active': true}, function (tabs) {
			const currentURL = tabs[0].url;
			const domainRegex = /^.*\/\/.*?\//;
			const currentDomain = currentURL.match(domainRegex);
			const regexTextfield = document.getElementById("new-rule-regex")
			regexTextfield.value = currentDomain + "*";
			console.log(tabs[0]);
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

	}

	document.addEventListener('DOMContentLoaded', function() {
	  onload();
	});
}

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
	StorageArea.clear();
}
clearStorage();