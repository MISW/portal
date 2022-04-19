# Frontend

## 実行方法
基本的にはdocker-composeの上で動いている.

単独で動かす場合は以下
```
pnpm i
pnpm run format
pnpm run build
```
して`localhost:3000`にアクセス

## フォルダ
`/pages`: URLに対応するページのjsが入っている  
`/components`: ここに全体で使うレイアウトとかを入れていくらしい

## ESLint と Prettier用のFormatOnSave
以下を.vscode/setting.jsonに書きこむ

```
"[typescript]": {
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    }
  },
"[typescriptreact]": {
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    }
}
```

## コマンドラインからsrcとpages以下のファイルをフォーマット
```
npm run format
```
