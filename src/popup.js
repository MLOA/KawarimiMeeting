let isRecording = false;

const recordButtonText = ["Start Record", "Recording..."];

const recordButton = document.querySelector(".record");
recordButton.addEventListener("click", (ev) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const sendData = {
      actionType: isRecording ? "start-rec" : "end-rec",
    };
    chrome.tabs.sendMessage(tabs[0].id, sendData);
    recordButton.textContent = isRecording
      ? recordButtonText[1]
      : recordButtonText[0];
    isRecording = !isRecording;
  });
});

document.querySelector(".video-play").addEventListener("click", (ev) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { actionType: "video-play" });
  });
});

document.querySelector(".video-stop").addEventListener("click", (ev) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { actionType: "video-stop" });
  });
});
