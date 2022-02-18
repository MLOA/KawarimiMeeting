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
    }
  });
};
