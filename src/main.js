/**
 * みがわり地蔵
 * main.js
 * Copyright © 2022 意識中くらい. All rights reserved.
 */

let recordedChunks = [];
let mediaRecorder;
let streamToRecord;
let videoElement;

/* 録画 */

// MediaRecorderによる録画の設定と開始
const startRecording = () => {
  console.log('startRecording')
  const options = { mimeType: "video/webm; codecs=vp9" };
  mediaRecorder = new MediaRecorder(streamToRecord, options);
  mediaRecorder.ondataavailable = (event) => {
    console.log("data-available", recordedChunks);
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };
  mediaRecorder.start(100);
}

// 録画の終了処理
const stopRecording = () => {
  if(mediaRecorder == null || mediaRecorder == undefined) return;
  console.log('stopRecording')
  mediaRecorder.stop();
  mediaRecorder = null;
}

/* 出力・再生 */

// 録画した動画をvideoタグに出力
const attachVideo = () => {
  console.log("attachVideo start");
  const blob = new Blob([...recordedChunks], { type: "video/webm" });
  const url = URL.createObjectURL(blob);
  console.log(url)
  videoElement = document.createElement('video');
  videoElement.autoplay = true;
  videoElement.muted = true;
  videoElement.loop = true;
  videoElement.style.display = 'none';
  videoElement.src = url;
  document.body.insertBefore(videoElement, document.body.lastChild)
  console.log("attachVideo end");
}

// videoタグをループ再生し、MediaStreamを取得
const createRecordedStream = async () => {
  console.log("createRecordedStream");
  await videoElement.play()
  recordedChunks = [];
  return videoElement.captureStream();
}


/* MediaDevices系 */

// 仮想デバイスの追加
const addEnumerateDevice = () => {
  const _enumerateDevices = navigator.mediaDevices.enumerateDevices.bind(
    navigator.mediaDevices
  );

  navigator.mediaDevices.enumerateDevices = async function () {
    const devices = await _enumerateDevices()

    const virtualDevice = {
      groupId: "default",
      deviceId: "virtual",
      kind: "videoinput",
      label: "††† かわりみ地蔵 †††",
    }
    devices.push({ ...virtualDevice, toJSON: () => ({ ...virtualDevice }) });

    return devices;
  }
}

// 仮想デバイスの判定
const isVirtualDevice = (video) => {
  if (!video || video === true || !video.deviceId) return false;

  const deviceId = video.deviceId;

  if (Array.isArray(deviceId)) return deviceId.includes("virtual");
  if (typeof deviceId === "object") return deviceId.exact === "virtual";

  return deviceId === "virtual";
};

// getUserMediaの書き換え
const _getUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
navigator.mediaDevices.getUserMedia = async (constraints) => {
  console.count("getUserMedia", constraints);
  // 仮想デバイスでなければ、元々のgetUserMediaを実行
  if (!constraints || !isVirtualDevice(constraints.video)) {
    const stream = await _getUserMedia(constraints);
    if(constraints && constraints.video) {
      // ビデオキャプチャデバイスの場合、録画時の対象としてstreamを保持しておく
      streamToRecord = stream;
    }
    return stream;
  }

  // 仮想デバイスの場合、録画した映像を返す
  const stream = await createRecordedStream()
  return new Promise((res) => {
    stream.onactive = () => res(stream)
  });
};

/* IFの設定 */

// 録画開始ボタンへリスナの登録
const transitStartRecButton = document.querySelector(".transit-start-rec");
transitStartRecButton.addEventListener('click', () => {
  console.log('main: transitStartRecButton');
  startRecording();
});

// 録画停止ボタンへリスナの登録
let deviceAdded = false;
const transitEndRecButton = document.querySelector(".transit-end-rec");
transitEndRecButton.addEventListener('click', () => {
  console.log('main: transitEndRecButton');
  stopRecording();
  attachVideo();
  if(!deviceAdded) {
    // 一度でも録画を行ったら、仮想デバイスを追加する
    addEnumerateDevice();
    deviceAdded = true;
  }
});