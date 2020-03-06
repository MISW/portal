# Portal

MIS.Wのポータルサイトです。


## 初期仕様
- https://hackmd.io/V5Tm1NUORiuu7qDt53Df6w

## API Spec
- https://hackmd.io/7WCOBLBfSzCk27oTjbetGA

## Directories
- backend: Goで書かれたAPIサーバ
- frontend: React+Next.JSで書かれたフロントエンド

## How to develop
### Prerequirements
- Install docker
- Install docker-compose

### Install / Start dev server

```shell
git clone https://github.com/MISW/Portal

cd Portal

docker-compose up -d
```

### Show Logs
```
docker-compose logs
docker-compose logs -f # 流しっぱなしにする
docker-compose logs app # Webサーバのみ(MySQLを無視)
```