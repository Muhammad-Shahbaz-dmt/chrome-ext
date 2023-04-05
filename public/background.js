/* global chrome */
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === "install") {
        chrome.windows.create({
            type: "popup",
            url: chrome.runtime.getURL("index.html"),
            width: 400,
            height: 300
        });
    }
});
