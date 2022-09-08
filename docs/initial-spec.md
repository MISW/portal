<!--this file is copied from https://hackmd.io/V5Tm1NUORiuu7qDt53Df6w?both-->

# MISW ポータルサイト Spec

## 必要な機能

### ユーザ視点

- Slack のシングルサインオンでログイン
- アカウントごとに会員情報登録
  - 大学学部学科
  - 学籍番号
  - サークル入会時の学年
    - 代の定義: 最初にサークルに入った時の, その学年に対応する代になる. 代は基本的に変わることはない(留年等しても x 代の人は x 代のまま)
      - 例えば 1 年生時点で 3 回留年してはじめて MISW に入会したらその人は一年生の代だが, その人が二年生時点でまた留年しても代は変わらない.
  - 本名
  - 本名(フリガナ)
  - ハンドル
  - 性別
  - メアド
  - 緊急連絡先(携帯電話番号)
  - 研究会、班
  - 他サークル
  - 会費を払った情報(2019 春みたいな感じ) これは読み取り専用の情報でフォームにはいらない

### 新規会員登録

- **非ログイン状態**で入力するフォームに入力(入力情報は同上)
- 同様に QR コード表示

### 管理者視点

- メンバー一覧
  - とりあえずはエクスポートできるだけ
  - いずれは Web 上でメンバー一覧を見られるようにするかも
- 会費の支払い状態の更新
  - 基本は会員の画面に QR を表示
  - それを会計が読み取ると支払い状態に
  - スマホを持っていない人は会計が Web から情報更新
    - これの仕様難しい
    - PC もスマホも持っていなくてどうやって入力すんねんって話になったので一旦保留