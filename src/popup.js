document.querySelector(".start-rec").addEventListener("click", (ev) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { actionType: "start-rec" });
  });
});

document.querySelector(".end-rec").addEventListener("click", (ev) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { actionType: "end-rec" });
  });
});
