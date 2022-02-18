const isVirtualDevice = (video) => {
  if (!video || video === true || !video.deviceId) return false;

  const deviceId = video.deviceId;

  if (Array.isArray(deviceId)) return deviceId.includes("virtual");
  if (typeof deviceId === "object") return deviceId.exact === "virtual";

  return deviceId === "virtual";
};

const _getUserMedia = navigator.mediaDevices.getUserMedia.bind(
  navigator.mediaDevices
);

navigator.mediaDevices.getUserMedia = async function (
  constraints
) {
  // 仮想デバイスでなければ、元々のAPIを実行する
  if (!constraints || !isVirtualDevice(constraints.video)) {
    return _getUserMedia(constraints);
  }

  const src = document.querySelector(".src")
  const stream = src.captureStream()

  // const stream = await navigator.mediaDevices.getDisplayMedia({
  //   audio: false, // 音声はいらないので false に。
  //   video: true,
  // });

  return stream
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
    label: "Screen Capture Virtual Camera 🎥",
  }

  // 仮想デバイスを追加する
  devices.push({ ...virtualDevice, toJSON: () => ({ ...virtualDevice }) })

  return devices
}

console.log("hello")

// テスト
// const button = document.querySelector(".button")
// const output = document.querySelector(".output")

// button.addEventListener('click', async () => {
//   const devices = await navigator.mediaDevices.enumerateDevices()
//   const virtualDevice = devices[devices.length - 1]
//   console.log(virtualDevice);

//   const stream = await navigator.mediaDevices.getUserMedia({
//     audio: false,
//     video: {
//       deviceId: virtualDevice.deviceId
//     }
//   });

//   output.srcObject = stream

// })

