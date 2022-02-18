const p = document.querySelector('p');

p.textContent = chrome.extension.getURL("sample.mp4");
