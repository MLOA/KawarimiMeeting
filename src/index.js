window.onload = () => {
  const script = document.createElement("script");
  script.setAttribute("type", "module");
  script.setAttribute("src", chrome.extension.getURL("main.js"));

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

  chrome.runtime.onMessage.addListener((request) => {
    // console.log(request);
    const { actionType } = request;
    if (actionType === "start-rec") {
      transitStartRecButton.click();
    } else if (actionType === "end-rec") {
      transitEndRecButton.click();
    } else if (actionType === "video-play") {
      const virtualDevice = Array.from(document.querySelectorAll('.video-option-menu__pop-menu li > a'))
        .filter((s) => { return s.textContent === "Loop!!!" })[0];
      // 1回でも表示しないと操作できないぽい
      document.querySelectorAll('.video-option-menu > button')[0].click()
      virtualDevice.click();
    } else if (actionType === "video-stop") {
      const deviceList = Array.from(document.querySelectorAll('.video-option-menu__pop-menu li > a'));
      const defaultDevice = deviceList[deviceList.length -2]
      document.querySelectorAll('.video-option-menu > button')[0].click()
      defaultDevice.click();
    } 
  });
};
