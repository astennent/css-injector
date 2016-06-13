
var unmatchedRuleNodes = [];
var showUnmatched = false;

// Document On-load function
document.addEventListener('DOMContentLoaded', function() {

	var currentURL;

   chrome.tabs.query({'active': true}, function (tabs) {
      
      // Fill in the a default regex based on the current url.
      const regexTextfield = document.getElementById("new-rule-regex");
      var nonExtensionTab = tabs.filter(function(tab) { return !tab.url.startsWith("chrome-extension") })[0];
      currentURL = nonExtensionTab.url;
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

         if (currentURL.match(regexStr) === null) {
	      	unmatchedRuleNodes.push(node);
	      	node.style.display = "none";
	      }

           // Delay the updating of the node contents until the iframe is loaded.
         node.onload = function() {
            var contentDocument = node.contentDocument;
            var ruleTextField = contentDocument.getElementsByClassName("rule-text")[0];
            ruleTextField.innerHTML = cssString;

            var ruleRegexField = contentDocument.getElementsByClassName("rule-regex")[0];
            ruleRegexField.value = regexStr;

            var removeButton = contentDocument.getElementById('remove-btn');
            removeButton.addEventListener("click", function() {
            	if (confirm("The rule for " + regexStr + " will removed permanently. Continue?")) {
            		clearStyleString(regexStr);
            		node.remove();
            	}
            });

            contentDocument.getElementById('edit-btn').addEventListener("click", function() {
            	updateNewRule(cssString)
            	updateNewRuleRegex(regexStr);
            });
         }
      }

      function updateNewRule(cssString) {
         const newRuleTextfield = document.getElementById("new-rule-content");
         newRuleTextfield.innerHTML = cssString;
         Prism.highlightAll();
      }

      function updateNewRuleRegex(regexStr) {
      	const newRuleRegexField = document.getElementById("new-rule-regex");
      	newRuleRegexField.value = regexStr;
      }

       chrome.storage.sync.get(null, function(matchingRules) {
           for (regexStr in matchingRules) {
              var cssString = matchingRules[regexStr];
              if (regexStr == currentDomain) {
                  updateNewRule(cssString);
               } else { 
                  addRule(regexStr, cssString);
               }
           }
      });
   }


   function applyStyleString(cssStr) {
      chrome.tabs.insertCSS( {'code':cssStr} );
   }

   function saveStyleString(regex, cssStr) {
      var kvp = {};
      kvp[regex] = cssStr;
      // Save it using the Chrome extension storage API.
      if (cssStr) {
			chrome.storage.sync.set(kvp, function() {
				console.log("Saved " + cssStr);
				alert('StyleSheet saved: ' + cssStr);
 			});
    	} else {
    		chrome.storage.sync.remove(regex);
    	}
   }

   function clearStyleString(regex) {
   	saveStyleString(regex, undefined);
   }


   document.getElementById("save-btn").addEventListener("click", function(){
		var regex = document.getElementById("new-rule-regex").value;
		var cssStr = getCurrentContent();
		applyStyleString(cssStr);
		saveStyleString(regex, cssStr);
   });


   var showMatchesToggle = document.getElementById('show-matches');
   showMatchesToggle.addEventListener('change', function() {
   	showUnmatched = !showUnmatched
   	setDisplayUnmatchedRules(showUnmatched);
   })

   var editorContainer = document.getElementById('editor-container');

   var textAreaHTML = '<textarea class="event-hook"\
                                 id="new-rule-content"\
                                 spellcheck="false"></textarea>';
   var prismHtml = '<pre class="prism-editor event-hook" \
                           spellcheck="false"\
                          id="new-editor"\
                       ><code class="language-css" id="new-rule-content" spellcheck="false"></code></pre>';

   function getCurrentContent() {
      var contentElement = document.getElementById('new-rule-content');
      var contentString = contentElement.value !== undefined ? contentElement.value : contentElement.textContent;
      return contentString.trim();
   }

   function SwitchRuleContents(replacementHtml, text) {
      var currentText = text || getCurrentContent();
      editorContainer.innerHTML = replacementHtml;
      var innerElement = document.getElementById('new-rule-content');
      innerElement.innerHTML = currentText;
   }

   function AddEventListener(eventName, callback) {
      var elementToHook = document.getElementsByClassName('event-hook')[0];
      elementToHook.addEventListener(eventName, callback);
      elementToHook.focus();
      if (elementToHook.setSelectionRange) {
         elementToHook.scrollTop = 0;
         elementToHook.setSelectionRange(0, 0);
      }
   }

   function Unhighlight() {
      SwitchRuleContents(textAreaHTML);
      AddEventListener('blur', ReHighlight);
   }

   function Highlight(text) {
      SwitchRuleContents(prismHtml, text);
      AddEventListener('click', Unhighlight);
      Prism.highlightAll();
   }

   function ReHighlight() {
      Highlight();
   }


   var defaultRule = "/* Example: Makes highlighted text blue-ish green */\n\
::selection {\n\
   background: #66E0C2;\n\
}";
   Highlight(defaultRule);

});

function setDisplayUnmatchedRules(value) {
	var styleValue = value ? "" : "none";
	for (var i = 0 ; i < unmatchedRuleNodes.length ; i++) {
		unmatchedRuleNodes[i].style.display = styleValue;
	}
}