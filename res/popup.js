
// Document On-load function
document.addEventListener('DOMContentLoaded', function() {
	chrome.tabs.query({'active': true}, function (tabs) {
		
		// Fill in the a default regex based on the current url.
		const regexTextfield = document.getElementById("new-rule-regex");
		const currentURL = tabs[0].url;
		const domainRegex = /^.*\/\/.*?\//; // May not work with everything, but it's good enough.
		const currentDomain = currentURL.match(domainRegex) + "*"; // Asterisk to match trailing stuff.
		regexTextfield.value = currentDomain;

		addRules(true, currentDomain);
	});

	function addRules(showNonMatches, currentDomain) {
		function addRule(regexStr, cssString) {
			var node = document.createElement('iframe');
			node.src = "rule.html";
			var injectorPopupDiv = document.getElementById("existing-rules");
		    injectorPopupDiv.appendChild(node);

   			// var ruleTextField = node.getElementsByClassName("rule-text")[0];
		    // ruleTextField.innerHTML = cssString;

		    // var ruleRegexField = node.getElementsByClassName("rule-regex")[0];
		    // ruleRegexField.innerHTML = regexStr;
		}

		function updateNewRule(cssString) {
			const newRuleTextfield = document.getElementById("new-rule-content");
			newRuleTextfield.innerHTML = cssString;
		}

	    chrome.storage.sync.get(null, function(matchingRules) {
	        for (regexStr in matchingRules) {
	        	var cssString = matchingRules[regexStr];
	        	if (regexStr == currentDomain) {
	            	updateNewRule(cssString);
	            } else { //TODO: If showNonMatches || this matches
	            	addRule(regexStr, cssString);
	            }
	        }
		});
	}


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
