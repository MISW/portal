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
- Use LF line break style  
    example: `git config --global core.autocrlf input`


### Install / Start dev server

```shell
git clone https://github.com/MISW/Portal

cd Portal

docker-compose up -d
```

<!-- 
- build frontend image
    ```
    docker build -t ${image_name}:${tag_name} -f frontend.Dockerfile .
    ```
--> 

### Show Logs
```
docker-compose logs
docker-compose logs -f # 流しっぱなしにする
docker-compose logs app # Webサーバのみ(MySQLを無視)
```

### For Internal Members
[dev.env for MISW developers](https://misw.kibe.la/notes/3490)

### 注意
- auth0のredirect urlに注意
- アクセスするにはデータベースに存在する(slack_idを持つ)ユーザである必要がある
