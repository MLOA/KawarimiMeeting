/**
 * かわりみミーティング
 * popup.js
 * Copyright © 2022 意識中くらい. All rights reserved.
 */

const ACTION_TYPE = { START_REC: "start-rec", END_REC: "end-rec" };
const LOCAL_STORAGE_KEYS = {
  IS_PLAYING: 'kawarimi:is_playing',
  VIDEO_SRC: 'kawarimi:video_src',
};
const SYSTEM_STATUS = { IDLE: 1, RECORDING: 2, PLAYING: 3 };

let systemStatus = SYSTEM_STATUS.IDLE;

const sendData = (actionType) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { actionType });
  });
};

const recordArea = document.querySelector(".record-area");
const recordButton = document.querySelector(".circle");
const indicator = document.querySelector(".indicator");
const preview = document.querySelector(".preview-area");
const previewVideo = document.querySelector(".preview-video");
const playArea = document.querySelector(".play-area");
const playButton = document.querySelector(".video-play");
const stopButton = document.querySelector(".video-stop");

const setSystemStatus = (nextSystemStatus) => {
  systemStatus = nextSystemStatus;

  switch (systemStatus) {
    case SYSTEM_STATUS.IDLE: {
      indicator.classList.remove("recording");
      indicator.classList.add("stopping");
      // かわりみ終了後はstopButtonを隠し、recordとplayボタンを見せる
      // 録画終了後はpreviewとplayボタンを見せる
      stopButton.style.display = "none";
      recordArea.style.display = "flex";
      playButton.style.display = "block";
      playArea.style.display = "block";
      preview.style.display = "block";
      localStorage.setItem(LOCAL_STORAGE_KEYS.IS_PLAYING, false);
      break;
    }
    case SYSTEM_STATUS.RECORDING: {
      indicator.classList.remove("stopping");
      indicator.classList.add("recording");
      // 録画中はpreviewもplayボタンも見せない
      preview.style.display = "none";
      playArea.style.display = "none";
      localStorage.setItem(LOCAL_STORAGE_KEYS.IS_PLAYING, false);
      break;
    }
    case SYSTEM_STATUS.PLAYING: {
      // 再生中ならrecordAreaとplayButtonを隠し、stopボタンを表示する
      recordArea.style.display = "none";
      playButton.style.display = "none";
      stopButton.style.display = "block";
      playArea.style.display = "block";
      localStorage.setItem(LOCAL_STORAGE_KEYS.IS_PLAYING, true);
      break;
    }
    default:
      break;
  }
};

chrome.runtime.onMessage.addListener((request) => {
  if (request.actionType === "recorded") {
    previewVideo.src = request.videoSrc;
    localStorage.setItem(LOCAL_STORAGE_KEYS.VIDEO_SRC, request.videoSrc);
  } else if(request.actionType === "initWithRefresh") {
    localStorage.clear();
    init();
  } else if(request.actionType === "init") {
    init();
  }
});

const init = () => {
  const isPlaying = localStorage.getItem(LOCAL_STORAGE_KEYS.IS_PLAYING);
  const videoSrc = localStorage.getItem(LOCAL_STORAGE_KEYS.VIDEO_SRC);

  if (isPlaying === 'true') {
    setSystemStatus(SYSTEM_STATUS.PLAYING);
  }
  if (videoSrc) {
    previewVideo.src = videoSrc;
    preview.style.display = "block";

    if (isPlaying === 'true') {
      playButton.style.display = "none";
      stopButton.style.display = "block";
    } else {
      playButton.style.display = "block";
      stopButton.style.display = "none";
    }
    playArea.style.display = "block";
  }
};

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, { actionType: "init" });
});

recordButton.addEventListener("click", (ev) => {
  if (systemStatus === SYSTEM_STATUS.IDLE) {
    sendData(ACTION_TYPE.START_REC);
    setSystemStatus(SYSTEM_STATUS.RECORDING);
  } else {
    sendData(ACTION_TYPE.END_REC);
    setSystemStatus(SYSTEM_STATUS.IDLE);
  }
});

playButton.addEventListener("click", (ev) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { actionType: "video-play" });
    setSystemStatus(SYSTEM_STATUS.PLAYING);
  });
});

stopButton.addEventListener("click", (ev) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { actionType: "video-stop" });
    setSystemStatus(SYSTEM_STATUS.IDLE);
  });
});

