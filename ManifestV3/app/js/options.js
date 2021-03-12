// Example code below to demo some useful methods
let body = document.getElementById("body"); 

let color = "#3aa757";
chrome.storage.sync.set({ color });
chrome.storage.sync.get("color", (data) => {
    console.log(data);
});

// Initialize the page by constructing the color options
constructOptions(presetButtonColors);