# Portal

MIS.W のポータルサイトです。

## 仕様

- [初期仕様](./docs/initial-spec.md)
- [API Spec](./docs/spec.md)

## Directories

- backend: Go で書かれた API サーバ
- frontend: React+Next.JS で書かれたフロントエンド

## How to develop

### Prerequirements

- Install docker
- Use LF line break style
  example: `git config --global core.autocrlf input`

### Install / Start dev server

```shell
git clone https://github.com/MISW/Portal

cd Portal

docker compose up -d --build
```

### Show Logs

```
docker compose logs
docker compose logs -f # 流しっぱなしにする
docker compose logs app # Webサーバのみ(MySQLを無視)
```

### Auth0

- (slack アカウントをログインに利用する場合、)[auth0 social connection](https://marketplace.auth0.com/features/social-connections)に slack を設定する。
- 本サイト用に[auth0 application](https://auth0.com/docs/get-started/applications)を作成する。

### アカウント

- ログインするためにはデータベースに存在するユーザ(slack_id を持つ)である必要がある。
- 次のいずれかによってデータベースにデータを入れる必要がある。管理ページを見るには`admin`ロールが必要。
  1. [./tools/batch_insert/](./tools/batch_insert/)を使う
  2. 直接データベースをいじる

### Environment variable

- create dev.env file following [dev.env.template](./dev.env.template)
