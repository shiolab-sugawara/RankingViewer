# ベースイメージ
FROM node:20-alpine

# 作業ディレクトリを作成
WORKDIR /app

# package.jsonとlockファイルをコピーして依存解決
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# 残りのファイルをすべてコピー
COPY . .

# ポートを公開（Viteのデフォルト5173）
EXPOSE 5173

# 開発サーバを起動
CMD ["npm", "run", "dev", "--", "--host"]