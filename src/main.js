let recordedChunks = [];
let mediaRecorder;
let streamToRecord;

const videoElement = document.createElement('video');
videoElement.autoplay = true;
videoElement.muted = true;
videoElement.loop = true;
videoElement.style.display = 'none';

document.body.insertBefore(videoElement, document.body.lastChild)

const startRecording = () => {
  console.log('startRecording')
  const options = { mimeType: "video/webm; codecs=vp9" };
  mediaRecorder = new MediaRecorder(streamToRecord, options);
  mediaRecorder.ondataavailable = (event) => {
    console.log("data-available");
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };
  mediaRecorder.start(3000);
}

const stopRecording = () => {
  if(!mediaRecorder) return;
  console.log('stopRecording')
  mediaRecorder.stop();
}

const createRecordedStream = () => {
  console.log("createRecordedStream");
  return videoElement.captureStream();
}

const attachVideo = () => {
  const blob = new Blob([...recordedChunks], { type: "video/webm" });
  const url = URL.createObjectURL(blob);

  videoElement.src = url;
  videoElement.play();
}

const isVirtualDevice = (video) => {
  if (!video || video === true || !video.deviceId) return false;

  const deviceId = video.deviceId;

  if (Array.isArray(deviceId)) return deviceId.includes("virtual");
  if (typeof deviceId === "object") return deviceId.exact === "virtual";

  return deviceId === "virtual";
};

const _getUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);

navigator.mediaDevices.getUserMedia = async function (constraints) {
  console.count("getUserMedia", constraints);
  // 仮想デバイスでなければ、元々のAPI(普通のカメラ)を実行する&録画をつねに回しておく
  if (!constraints || !isVirtualDevice(constraints.video)) {
    const stream = await _getUserMedia(constraints);
    if(constraints && constraints.video) {
      streamToRecord = stream;
    }
    return stream
  }

  // 仮想デバイスの場合、ループ映像を返す
  const stream = createRecordedStream()
  return new Promise((res) => {
    stream.onactive = () => {
      res(stream)
    }
  })
};

// 元々の`enumerateDevices()`を保持しておく
const _enumerateDevices = navigator.mediaDevices.enumerateDevices.bind(
  navigator.mediaDevices
);

// `enumerateDevices()`を上書きする
navigator.mediaDevices.enumerateDevices = async function () {
  // 使用できるデバイス(マイク・カメラなど)を取得する
  const devices = await _enumerateDevices()

  // 仮想デバイスの情報を定義
  const virtualDevice = {
    groupId: "default",
    deviceId: "virtual",
    kind: "videoinput",
    label: "Loop!!!",
  }

  // 仮想デバイスを追加する
  devices.push({ ...virtualDevice, toJSON: () => ({ ...virtualDevice }) });

  return devices;
}

const transitStartRecButton = document.querySelector(".transit-start-rec");
transitStartRecButton.addEventListener('click', () => {
  console.log('main: transitStartRecButton');
  startRecording();
});

const transitEndRecButton = document.querySelector(".transit-end-rec");
transitEndRecButton.addEventListener('click', () => {
  console.log('main: transitEndRecButton');
  stopRecording();
  attachVideo();
  recordedChunks = [];
});