import Model from "./models/model.js";

chrome.extension.sendMessage({}, function (response) {

});

const model = new Model("My name is Mooodel");
model.printName();
