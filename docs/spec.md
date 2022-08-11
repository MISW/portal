<!--this file is copied from https://hackmd.io/7WCOBLBfSzCk27oTjbetGA?both-->

# MISW Portal API Spec


- base path: /api

## Error Message

| Status Code | Status | Description |
| -------- | -------- | -------- |
| 400     | Bad Request     | API呼び出しのパラメータがおかしい |
| 401     | Unauthorized     | ログインしていない |
| 404     | Forbidden     | 許可されていないリソースへのアクセス |
| 500     | Internal Server Error | サーバ内部でエラーが発生している |

エラー時のResponse Bodyの例(JSON)
```
{
    "status": "Bad Request",
    "status_code": 400,
    "message": "メールアドレスがすでに利用されています"
}
```

非エラー時のResponse Bodyの例(Status: OK)
```
{
    "status": "OK",
    "status_code": 200,
    "redirect_url": "https://misw.auth0.com/..."
}
```
### 以下では全てstatusとstatus_codeを省略するが、正常時全てで付与されている

## Endpoint: Public
- path: /public

### Login
- method: POST
- path: /login
- description: Slackログイン時にリダイレクトするURLを返す
- parameter: なし
- set-cookie: misw-portal-state
- response: 
```json=
{
    "redirect_url": "https://misw.auth0.com/..."
}
```
このridirect_urlに遷移すれば良い

### Callback
- method: POST
- path: /callback
- description: Auth0から返ってくるcallbackのURL
- parameter:
```json=
{
    "code": "code in query parameter",
    "state": "state in query parameter"
}
```

- set-cookie: misw-portal-token
- response: 
```json=
{}
```

## Signup
- method: POST
- path: /signup
- description: 新規アカウント登録用エンドポインt
- parameter: `Content-Type: application/json` のbodyをPOST

https://github.com/MISW/Portal/blob/master/backend/domain/user.go#L46

JSONフォーマットはここを参照(ただし、ID、SlackID、Role、CreatedAt、UpdatedAtは指定しなくて良い(自動で生成される))

- response:

```json=
{}
```

Eメールが送信されているのでEメールを確認してください、みたいなメッセージを表示するだけで良い

## Verify Email
- method: POST
- path: /veryfy_email
- parameter:
```json=
{
    "token": "token in query parameter",
}
```

- set-cookie: misw-portal-token
- response: 
```json=
{}
```


メールに添付のリンクを開くと `/verify_email` が開かれるようになっており、URLのパラメータにtokenが付いているのでこれをこのエンドポイントのbodyに添付してPOSTする


## Endpoint: Private
- path: /private

### Logout
- method: POST
- path: /logout
- description: アカウントからログアウト
- response: 
```json=
{}
```

### Get Profile
- method: GET
- path: /profile
- description: 自身の登録情報を取得する
- response:
JSONでユーザ型が返る(リクエストと同じ、更新されたもの)

### Update Profile
- method: POST
- path: /profile
- description: 自身の登録情報を更新する
- parameter: `Content-Type: application/json` のbodyをPOST

https://github.com/MISW/Portal/blob/master/backend/domain/user.go#L46

JSONフォーマットはここを参照(ただし、ID、SlackID、Role、CreatedAt、UpdatedAtは指定しなくて良い(自動で生成される))

一部値に関しては変更が効かないようになっている

- response:
JSONでユーザ型が返る(リクエストと同じ、更新されたもの)

### Get Payment Statuses
- method: GET
- path: /profile/payment_statuses
- description: 自身の支払い履歴を取得する
- response:
```json=
{
    "payment_statuses": [payment statusの配列]
}
```
payment status: https://github.com/MISW/Portal/blob/master/backend/domain/payment.go#L10

### Get Payment Transaction
- method: POST
- path: /profile/payment_transaction
- description: 支払い用トークンを取得する
- response:
```json=
{
    "token": "token"
    "expired_at": "トークン失効時刻(期限は1分)"
}
```
定期的に自動更新する設計が必要

## Endpoint: Management
- path: /management
- **required role: admin**

### List Users
- method: GET
- path: /list_users
- description: ユーザ一覧を取得
- response: ユーザ型の配列+payment_status
- ない場合はnull

```json=
[
    {
        "id": 134,
        "email": "tsuyochi23182+10@gmail.com",
        "generation": 55,
        "name": "みす ちゃん",
        "kana": "ミス チャン",
        "handle": "mischa",
        "sex": "female",
        "university": {
            "name": "早稲田大学",
            "department": "dasdas",
            "subject": "asdads"
        },
        "student_id": "sdadasd",
        "emergency_phone_number": "08041111111",
        "other_circles": "",
        "workshops": [
            "CG"
        ],
        "squads": [
            ""
        ],
        "role": "admin",
        "slack_id": "U01210BMT0D",
        "created_at": "2020-04-17T16:59:56+09:00",
        "updated_at": "2020-04-19T14:30:28+09:00",
        "payment_status": {
            "user_id": 134,
            "authorizer": 134,
            "period": 202004,
            "created_at": "2020-04-19T14:28:14+09:00",
            "updated_at": "2020-04-19T14:28:14+09:00"
        }
    }
]
```


### Authorize Transaction
- method: POST
- path: /authorize_transaction
- description: ユーザの支払い完了申請を許可
- request:

```json=
{
    "token": "Get Payment Transactionで取得したtoken"
}
```

- response:
```json=
{}
```

### Get Payment Status
- method: GET
- path: `/payment_status?user_id={{target_user_id}}&period={{target_period}}`
- description: 特定の支払い情報を取得
- response:
```json-with-comment=
{
    "payment_status": {
        // https://github.com/MISW/Portal/blob/master/backend/domain/payment.go#L10
    }
}
```

### Delete Payment Status
- method: DELETE
- path: `/payment_status?user_id={{target_user_id}}&period={{target_period}}`
- description: 特定の支払い情報を削除
- response:
```json-with-comment=
{}
```

### Put Payment Status
- method: GET
- path: `/payment_status`
- description: 支払い情報を追加
- response:
```json-with-comment=
{
    "user_id": 10,
    "period": 202004
}
```


### Get Payment Statuses
- method: GET
- path: `/payment_statuses?user_id={{target_user_id}}&period={{target_period}}`
- description: 支払い情報を一括で取得
    - GET /payment_statusとは違い、オプションがoptionalになっている
    - **現在対応しているのはuser_idのみ指定と両方指定のみ**
- response:

```json=
{
    "payment_statuses": [
        {
            // https://github.com/MISW/Portal/blob/master/backend/domain/payment.go#L10
        }
    ]
}
```

### Get Config
- method: GET
- query: 
    - kind: KIND_NAME

- KIND_NAME
    - payment_period
    - current_period
    - email_template
        - query: email_kind
        - email_kind
            - email_verification: 新規登録時のメール認証
            - slack_invitation: Slackの招待時に同時に送信するメール

### Set Config
- method: POST
- body: 

```json=
{
    "kind": "上と同じkind",
    "payload": payload_type
}
```
#### payload
- payment_period
```json
{
    "payment_period": 202004
}
```
- current_period
```json
{
    "payment_period": 202004
}
```
- email_template
```json
{
    "email_kind": "上と同じ",
    "subject": "メールの件名",
    "body": "メールの本文テンプレート"
}
```

## Endpoint: Externam
- path: /external
- required headers: 
    - ```"Authorization": "Bearer {EXTERNAL_INTEGRATION_TOKENS}"```  

### Find Role
- path: /find_role
- description: slack_idからロールを取得
- query: 
    - slack_id
- response: 
```json
{
    "role": "ロール",
}
```

### All Member Roles
- path: all_member_roles
- description: 全員のロールを取得 
- response: 
```json
{
    "slack_id_1": {
        "role": "ロール"
    },
    "slack_id_2": {
        "role": "ロール"
    },
    ...
}
```


## Other Tips
### 新規登録(Sign up)時のフロー
- フロント側で情報を入力する
- `/api/public/signup` を叩いて登録する
- not member roleとしてアカウントが作成される
- メールが送信され、メールアドレス認証を行う
    - email_verified flagが立つ
- QRコード生成APIを叩いて(未定義)QRコードを生成し表示する
- 会計が読み取る
- member roleに変更
- Slackから招待メールが届く
- Portal側のデータベースにSlack IDが保存される

### ログイン時の挙動
- signupページ以外で非ログイン状態
- `/api/public/login` を叩いて返ってきたredirect_urlに転送
- 転送されてAuth0で認証に成功すると `/callback` に返ってくる
- この時に `/callback?code=XXXX&state=XXXX` みたいな感じでcodeとstateがついてくるのでこれを読み取って `/api/public/callback` を叩く

### Slackの招待APIを叩くために必要な呼び出し
https://slack.com/oauth/authorize?&client_id=2591799685.577702399297&team=misw-info&install_redirect=install-on-team&scope=admin+client

https://elements.heroku.com/buttons/outsideris/slack-invite-automation

OAuth tokens
Visit https://api.slack.com/apps and Create New App.

Click "Permissions".

In "OAuth & Permissions" page, select admin scope under "Permission Scopes" menu and save changes.

Click "Install App to Workspace".


Visit https://slack.com/oauth/authorize?&client_id=CLIENT_ID&team=TEAM_ID&install_redirect=install-on-team&scope=admin+client in your browser and authorize your app.

```
This form requires the client permission. Otherwise, you can see {"ok":false,"error":"missing_scope","needed":"client","provided":"admin"} error.
Your TEAM_ID is the subdomain for your slack team, e.g. myteam.slack.com - your TEAM_ID is myteam.
Your CLIENT_ID found in "Basic Information" section for your App.
You will be shown a Installed App Settings > OAuth Tokens for Your Team screen.
You can test auto invites with curl by providing the OAuth Access Token.
```

curl -X POST 'https://myteam.slack.com/api/users.admin.invite' \
--data 'email=test@email.com&token=OAuthAccessToken&set_active=true' \
--compressed