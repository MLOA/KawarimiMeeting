/**
 * かわりミーティング
 * popup.js
 * Copyright © 2022 意識中くらい. All rights reserved.
 */

let isRecording = false;
let isPlaying = false;

const ACTION_TYPE = { START_REC: "start-rec", END_REC: "end-rec" };

const sendData = (actionType) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { actionType });
  });
}

const recordArea = document.querySelector(".record-area");
const recordButton = document.querySelector(".circle");
const indicator = document.querySelector(".indicator");
const preview = document.querySelector(".preview-area");
const previewVideo = document.querySelector(".preview-video");
const playArea = document.querySelector(".play-area");
const playButton = document.querySelector(".video-play");
const stopButton = document.querySelector(".video-stop");

recordButton.addEventListener("click", (ev) => {
  isRecording = !isRecording;

  if (isRecording) {
    sendData(ACTION_TYPE.START_REC);
    indicator.classList.remove("stopping");
    indicator.classList.add("recording");
    // 録画中はpreviewもplayボタンも見せない
    preview.style.display = "none";
    playArea.style.display = "none";
  } else {
    sendData(ACTION_TYPE.END_REC);
    indicator.classList.remove("recording");
    indicator.classList.add("stopping");
  }
});

playButton.addEventListener("click", (ev) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { actionType: "video-play" });
    recordArea.style.display = "none";
    playButton.style.display = "none";
    stopButton.style.display = "block";
    isPlaying = true;
  });
});

stopButton.addEventListener("click", (ev) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { actionType: "video-stop" });
    // かわりみ終了後はstopButtonを隠し、recordとplayボタンを見せる
    stopButton.style.display = "none";
    recordArea.style.display = "flex";
    playButton.style.display = "block";
    isPlaying = false;
  });
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.actionType === "recorded") {
    previewVideo.src = request.videoSrc;
    // 録画終了後はpreviewとplayボタンを見せる
    preview.style.display = "block";
    playButton.style.display = "block";
    playArea.style.display = "block";
  }
});
