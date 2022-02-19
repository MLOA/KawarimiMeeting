/**
 * みがわり地蔵
 * index.js
 * Copyright © 2022 意識中くらい. All rights reserved.
 */

window.onload = () => {
  const script = document.createElement("script");
  script.setAttribute("type", "module");
  script.setAttribute("src", chrome.runtime.getURL("main.js"));

  const head =
    document.head ||
    document.getElementsByTagName("head")[0] ||
    document.documentElement;

  head.insertBefore(script, head.lastChild);

  document.body.insertBefore(script, document.body.lastChild);

  // start recイベントを経由させるためのボタン
  const transitStartRecButton = document.createElement("button");
  transitStartRecButton.classList.add("transit-start-rec");
  transitStartRecButton.style.display = "none";
  document.body.insertBefore(transitStartRecButton, document.body.lastChild);

  // end recイベントを経由させるためのボタン
  const transitEndRecButton = document.createElement("button");
  transitEndRecButton.classList.add("transit-end-rec");
  transitEndRecButton.style.display = "none";
  document.body.insertBefore(transitEndRecButton, document.body.lastChild);

  // recordEndイベントを経由させるためのボタン
  const transitRecordedButton = document.createElement("button");
  transitRecordedButton.classList.add("transit-recorded");
  transitRecordedButton.style.display = "none";
  document.body.insertBefore(transitRecordedButton, document.body.lastChild);
  transitRecordedButton.addEventListener("click", () => {
    // popupへdataUrlを伝える
    chrome.runtime.sendMessage({
      actionType: "recorded",
      videoSrc: transitRecordedButton.textContent,
    });
  });

  let isExistDeviceList = false;
  const checkButton = () => {
    if (
      Array.from(document.querySelectorAll(".video-option-menu > button"))
        .length !== 0
    ) {
      document.querySelectorAll(".video-option-menu > button")[0].click();
      isExistDeviceList = true;
    } else {
      setTimeout(() => {
        checkButton();
      }, 500);
    }
  };

  chrome.runtime.onMessage.addListener((request) => {
    // console.log(request);
    const { actionType } = request;
    if (actionType === "start-rec") {
      transitStartRecButton.click();
    } else if (actionType === "end-rec") {
      transitEndRecButton.click();
      checkButton();
    } else if (actionType === "video-play") {
      // isExistDeviceList 条件追加
      const virtualDevice = Array.from(
        document.querySelectorAll(".video-option-menu__pop-menu li > a")
      ).filter((s) => {
        return s.textContent === "かわりみミーティング";
      })[0];
      if (virtualDevice && isExistDeviceList) virtualDevice.click();
    } else if (actionType === "video-stop") {
      // isExistDeviceList 条件
      const deviceList = Array.from(
        document.querySelectorAll(".video-option-menu__pop-menu li > a")
      );
      const defaultDevice = deviceList[deviceList.length - 2];
      if (defaultDevice && isExistDeviceList) defaultDevice.click();
    }
  });
};
