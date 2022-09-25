<!--this file is copied from https://hackmd.io/7WCOBLBfSzCk27oTjbetGA?both-->

# MISW Portal API Spec

- base path: /api

## Error Message

| Status Code | Status                | Description                          |
| ----------- | --------------------- | ------------------------------------ |
| 400         | Bad Request           | API 呼び出しのパラメータがおかしい   |
| 401         | Unauthorized          | ログインしていない                   |
| 404         | Forbidden             | 許可されていないリソースへのアクセス |
| 500         | Internal Server Error | サーバ内部でエラーが発生している     |

エラー時の Response Body の例(JSON)

```
{
    "status": "Bad Request",
    "status_code": 400,
    "message": "メールアドレスがすでに利用されています"
}
```

非エラー時の Response Body の例(Status: OK)

```
{
    "status": "OK",
    "status_code": 200,
    "redirect_url": "https://misw.auth0.com/..."
}
```

### 以下では全て status と status_code を省略するが、正常時全てで付与されている

## Endpoint: Public

- path: /public

### Login

- method: POST
- path: /login
- description: 外部アカウント(slack など)のログイン時にリダイレクトする URL を返す
- parameter: なし
- set-cookie: misw-portal-state
- response:

```json=
{
    "redirect_url": "https://misw.auth0.com/..."
}
```

この ridirect_url に遷移すれば良い

### Logout

- method: POST
- path: /logout
- description: OIDC アカウントからログアウトする
- response:

```json=
{
  "logout_url": "logout url"
}
```

この logout_url に遷移すれば oidc で使ってるアカウントからログアウトできる

### Callback

- method: POST
- path: /callback
- description: Auth0 から返ってくる callback の URL
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
{
  "has_account": "true | false", //みすポータルにアカウントを持っているかどうか
}
```

### Verify Email

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

メールに添付のリンクを開くと `/verify_email` が開かれるようになっており、URL のパラメータに token が付いているのでこれをこのエンドポイントの body に添付して POST する

### Endpoint: OIDC Account

- path: /oidc_account
- description: OIDC でログインはしているが、portal にはアカウントを作成していないユーザ

#### Info

- method: GET
- path: ""
- description: account_info を取得する
- response:

```json=
{
  token: "string",
	acciunt_id: "account_id",
	email: "email"`,
}
```

#### Signup

- method: POST
- path: /signup
- description: 新規アカウント登録用エンドポイント. DB に存在しないアカウントで先に Login しておく必要がある.
- parameter: `Content-Type: application/json` の body を POST

- JSON フォーマットは[ここ](https://github.com/MISW/Portal/blob/master/backend/domain/user.go#L122)を参照(ただし、ID、AccountID、 Email、 Role、CreatedAt、UpdatedAt は指定しなくて良い(自動で生成される))

- response:
  - 成功時:
  ```json=
  {}
  ```
  - (特に)失敗時:
  ```json=
  {
    "status_code": "code",
  	"status":      "http.StatusText(code)",
  	"message":     "message",
  }
  ```

E メールが送信されているので E メールを確認してください、みたいなメッセージを表示するだけで良い

## Endpoint: Private

- path: /private

### Logout

- method: POST
- path: /logout
- description: アカウントからログアウト
- response:

```json=
{
  "logout_url": "logout url"
}
```

### Get Profile

- method: GET
- path: /profile
- description: 自身の登録情報を取得する
- response:
  JSON でユーザ型が返る(リクエストと同じ、更新されたもの)

### Update Profile

- method: POST
- path: /profile
- description: 自身の登録情報を更新する
- parameter: `Content-Type: application/json` の body を POST

https://github.com/MISW/Portal/blob/master/backend/domain/user.go#L46

JSON フォーマットはここを参照(ただし、ID、AccountID、Email、Role、CreatedAt、UpdatedAt は指定しなくて良い(自動で生成される))

一部値に関しては変更が効かないようになっている

- response:
  JSON でユーザ型が返る(リクエストと同じ、更新されたもの)

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
- ない場合は null

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
        "account_id": "U01210BMT0D",
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
  - GET /payment_status とは違い、オプションが optional になっている
  - **現在対応しているのは user_id のみ指定と両方指定のみ**
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
  - `"Authorization": "Bearer {EXTERNAL_INTEGRATION_TOKENS}"`

### Find Role

- path: /find_role
- description: account_id からロールを取得
- query:
  - account_id
- response:

```json
{
  "role": "ロール"
}
```

### All Member Roles

- path: all_member_roles
- description: 全員のロールを取得
- response:

```json
{
    "account_id_1": {
        "role": "ロール"
    },
    "account_id_2": {
        "role": "ロール"
    },
    ...
}
```

## Other Tips

### 新規登録(Sign up)時のフロー

- 外部アカウントでログイン(orSignup)する
- フロント側で情報を入力する
- `/api/private/signup` を叩いて登録する。同時に Account ID や email も登録される
- not member role としてアカウントが作成される
- メールが送信され、メールアドレス認証を行う
  - email_verified flag が立つ
- QR コード生成 API を叩いて(未定義)QR コードを生成し表示する
- 会計が読み取る
- member role に変更

### ログイン時の挙動

- signup ページ以外で非ログイン状態
- `/api/public/login` を叩いて返ってきた redirect_url に転送
- 転送されて Auth0 で認証に成功すると `/callback` に返ってくる
- この時に `/callback?code=XXXX&state=XXXX` みたいな感じで code と state がついてくるのでこれを読み取って `/api/public/callback` を叩く
