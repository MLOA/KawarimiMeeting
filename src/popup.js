/**
 * かわりミーティング
 * popup.js
 * Copyright © 2022 意識中くらい. All rights reserved.
 */

let isRecording = false;

const ACTION_TYPE = { START_REC: "start-rec", END_REC: "end-rec" };

const sendData = (actionType) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { actionType });
  });
}

const recordButton = document.querySelector(".circle");
const indicator = document.querySelector(".indicator");
const preview = document.querySelector(".preview-area");
const previewVideo = document.querySelector(".preview-video");

recordButton.addEventListener("click", (ev) => {
  isRecording = !isRecording;

  if (isRecording) {
    sendData(ACTION_TYPE.START_REC);
    indicator.classList.remove("stopping");
    indicator.classList.add("recording");
    preview.style.display = "none";
  } else {
    sendData(ACTION_TYPE.END_REC);
    indicator.classList.remove("recording");
    indicator.classList.add("stopping");
  }
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

chrome.runtime.onMessage.addListener((request) => {
  if (request.actionType === "recorded") {
    previewVideo.src = request.videoSrc;
    preview.style.display = "initial";
  }
});
