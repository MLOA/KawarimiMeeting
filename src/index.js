window.onload = () => {
  const script = document.createElement("script");
  script.setAttribute("type", "module");
  script.setAttribute("src", chrome.extension.getURL("main.js"));

  const head =
    document.head ||
    document.getElementsByTagName("head")[0] ||
    document.documentElement;

  head.insertBefore(script, head.lastChild);

  document.body.insertBefore(script, document.body.lastChild)

  chrome.runtime.onMessage.addListener((request, sender) => {
    console.log('呼び出されたわ！受信したデータは', request.data);
    //何かの処理
  });
}
