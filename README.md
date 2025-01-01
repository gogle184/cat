# CatGPT

![demo](https://github.com/user-attachments/assets/49fb85a4-59c1-4565-a442-70fd3610e76e)

## 12/9更新
以下参考
https://go-tech.blog/nodejs/typescript-env/

## 開発用ツール

- ngrok
  - ローカルのアプリを外部に公開するためのツール
  - https://ngrok.com/
  - 使い方
    - インストール - `brew install --cask ngrok`
  - 起動
    - `ngrok http 3000` - ローカルサーバーのポート番号を指定して起動すると、外部からアクセスできる URL が表示される
    - 表示された URL にアクセスすると、ローカルサーバーにアクセスできる
    - https://\*\*\*\*.ngrok-free.app/slack/events を Slack のイベント通知先に設定することで、ローカルサーバーにイベント通知を受け取ることができる
    - slackで入力欄が出て来なかった場合はFeature->AppHome->Allow users to send Slash commands and messages from the messages tabにチェック
    - 権限等変更した場合はslackにreinstallしてください。その後slack再起動してください。

## ローカル確認
- npm install
- npm run init
- 管理者にデータ、開発用awsキーを教えてもらう
- npm run build:local

# slack接続
- aws sso login --profile sso名
- sam local start-api --profile sso名 --env-vars env.json
- ngrok http 3000
- ngrok側のhttpsをslackのEventSubscriptionに貼り付ける

## iam設定
- 認証はaws configure ssoで行う
- aws sso login --profile sso名

## ローカルテストについて
※開発環境はAPIgatewayを利用してる。以下補足

```
      Events:
        ApiEvent:
          Type: Api
          Properties:
            Path: /slack/events
            Method: POST
      (Enviromentの上の方。空行なし)
      Environment:
        Variables:
```

本番はEventsをFunctionUrlConfigにする
```
      FunctionUrlConfig:
        AuthType: NONE
        InvokeMode: BUFFERED
        Cors:
          AllowOrigins:
            - '*'
          AllowMethods:
            - POST
          AllowCredentials: false
```
(FunctionUrlConfigを消して下記のeventを入れる)

## todo(12/18更新)
- 画像、スタンプ対応したい
- geminiやラマスリーに切り替えができるようにしたい
- たまに人間に戻るのやめてほしい
- slackの3秒ルールをどうにかしなきゃいけないかも

```
POST /dev/slack/events (λ: slack)
(node:51006) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
New conversation started. No previous messages.
(λ: slack) RequestId: 74d84ae5-8c82-41fb-9b76-d96a752ab581  Duration: 2878.32 ms  Billed Duration: 2879 ms
POST /dev/slack/events (λ: slack)
(λ: slack) RequestId: 86f55e32-5ee3-4148-8ec8-8ea0aaf9e8b7  Duration: 4.28 ms  Billed Duration: 5 ms
POST /dev/slack/events (λ: slack)
(λ: slack) RequestId: 9411f6fa-d870-47e6-89ae-ddaa23a5f614  Duration: 5.68 ms  Billed Duration: 6 ms
```

## 更新
- 12/24 dev環境整えました
- 12/25 lint、npmコマンド追加しました
