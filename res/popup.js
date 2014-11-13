function onload() {

	var url = "";
	chrome.tabs.query({'active': true}, function (tabs) {
    	url = tabs[0].url;
    	console.log(url)
	});
	const currentDomain = document.domain;
	document.getElementById("new-rule-regex").value = currentDomain + "/*";
	console.log("test");
}

document.addEventListener('DOMContentLoaded', function() {
  onload();
});