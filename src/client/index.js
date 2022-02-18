window.onload = () => {
  const videoElement = document.createElement('video')
  videoElement.classList.add('src');
  videoElement.src = chrome.extension.getURL("sample.mp4");
  videoElement.autoplay = true;
  videoElement.muted = true;
  videoElement.loop = true;
  videoElement.style = 'display: none';

  document.body.insertBefore(videoElement, document.body.lastChild)

  document.querySelector('video.src').play();

  const script = document.createElement("script");
  script.setAttribute("type", "module");
  script.setAttribute("src", chrome.extension.getURL("main.js"));

  const head =
    document.head ||
    document.getElementsByTagName("head")[0] ||
    document.documentElement;

  head.insertBefore(script, head.lastChild);

  document.body.insertBefore(script, document.body.lastChild)
}
