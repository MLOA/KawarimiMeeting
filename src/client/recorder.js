const video = document.querySelector(".src")

const recordedChunks = [];
let mediaRecorder;

const display = () => {
  const blob = new Blob(recordedChunks, {    type: "video/webm"  });
  const url = URL.createObjectURL(blob);
  const videoElement = document.createElement('video')
  videoElement.classList.add('src');
  videoElement.src = url;
  videoElement.width = 300;
  videoElement.autoplay = true;
  videoElement.muted = true;
  videoElement.loop = true;
  // videoElement.style = 'display: none';
  document.body.insertBefore(videoElement, document.body.lastChild)
  // videoElement.play();
}

const download = (url) => {
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  a.href = url;
  a.download = "test.webm";
  a.click();
  window.URL.revokeObjectURL(url);
}

// ここからデバッグ用ボタン操作
const recStartButton = document.querySelector(".rec-start-button");
recStartButton.addEventListener('click', async () => {
  console.log('start')
  const stream = await navigator.mediaDevices.getUserMedia({    audio: false,video: true  });
  document.querySelector(".output").srcObject = stream;
  startRecording(stream)
})

const recEndButton = document.querySelector(".rec-end-button");
recEndButton.addEventListener('click', () => {
  console.log('stop')
  mediaRecorder.stop();
  display();
})
// ここまで

const startRecording = (stream) => {
  console.log('startRecording')
  const options = { mimeType: "video/webm; codecs=vp9" };
  mediaRecorder = new MediaRecorder(stream, options);
  mediaRecorder.ondataavailable = (event) => {
    console.log("data-available");
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
      console.log(recordedChunks);
    }
  };
  mediaRecorder.start(100);
}


const stopRecording = () => {
  console.log('stopRecording')
  mediaRecorder.stop();
  display(); //
}