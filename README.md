# かわりみミーティング

![拡張のアイコンと録画ボタン](./docs/img/promotion-marquee.png)

**リモートでの通話や講義が当たり前の現代、こんな経験はありませんか？**

- トイレに行きたくなってしまった！
- 宅急便が届いてしまった！
- カメラ必須なんだけど講義をこっそり抜けたい...

そんなリモートならではの「拘束されている時間」からあなたを解放するアプリ，それが **かわりみミーティング** です！

ループ映像である「かわりみ」を召喚することで，気づかれずに離席できます！（ご利用は計画的に）

## スクリーンショット

![スクリーンショット](./docs/img/screen_shot.png)

## 動作環境

- Google Chrome(最新版)
  - Mac で動作確認済み
- Zoom(Web ブラウザ版)

## 使い方

### 1. Chrome ウェブストア から「かわりみミーティング」をインストール

- [かわりみミーティング - Chrome ウェブストア](https://chrome.google.com/webstore/detail/%E3%81%8B%E3%82%8F%E3%82%8A%E3%81%BF%E3%83%9F%E3%83%BC%E3%83%86%E3%82%A3%E3%83%B3%E3%82%B0/eambcodfdjgfoipcpkohclalfnbjmjol?hl=ja)

### 2. Chrome で任意の Zoom 会議に参加する

Zoom リンクをクリックするとブラウザが立ち上がり，アプリ版へ誘導されますが，そのままブラウザで入ってください
![2でのブラウザでzoomへの入り方](./docs/img//how-to-2.png)

### 4. メニューバーにある拡張のアイコンをクリックする

### 5. 録画ボタンを押して撮影する

Chrome 拡張はブラウザの右上に出ます（出てない場合はジクソーパズルアイコンの設定からピン留めしてください）

![拡張のアイコンと録画ボタン](./docs/img//how-to-5.png)

#### 6. かわりみボタンを押して、Zoom 上の映像を録画したものに切り替える

録画を停止するとプレビューとかわりみボタンが出ます

![プレビューとかわりみボタン](./docs/img//how-to-6.png)

#### 7. 解除する場合はやめるボタンを押す

![やめるボタン](./docs/img//how-to-7.png)

## 技術的にやっていること

- ビデオ会議中のカメラ映像を録画し、仮想デバイスとして流すことができます
  - プラットフォームとして Chrome 拡張 を利用
    - ブラウザのメニューバーから使える UI も実装した
  - Chrome の API（getUserMedia, enumerateDevices）をハックしている
    - リアルタイムにカメラのビデオをキャプチャし，その場でループ動画を作成
    - 仮想カメラとして Zoom から読み込み・設定できるようにした

![かわりみミーティングが追加された様子](./docs/img//added-virtual-camera.png)

## ツクってアソぶハッカソン

- 2022/02/17 20:00 ~ 02/18 20:00で行われたイベント，[第2回 ツクってアソぶハッカソン](https://tsukuaso.com/): 『時から開放されるサービス』優秀賞を受賞

## Contributors

<a href="https://github.com/MLOA/KawarimiMeeting/graphs/contributors">
  <img src="https://contributors-img.firebaseapp.com/image?repo=MLOA/KawarimiMeeting" />
</a>

Made with [contributors-img](https://contributors-img.firebaseapp.com).
