import Model from "./models/model.js";

//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
	function (request, sender, sendResponse) {
		chrome.pageAction.show(sender.tab.id);
		sendResponse();
	}
);

chrome.runtime.onInstalled.addListener(() => {
	console.log("Hello World!");
	const model = new Model("blerg");
	model.printName();
	//chrome.storage.sync.set({color: '#3aa757'}, function() {
	//	console.log("The color is green.");
	//});
});

// Handles plugin hotkeys/shortcut actions
chrome.commands.onCommand.addListener(function (command) {
	console.log('Command:', command);
});
