FROM node
WORKDIR /praxi

# クローンして必要パッケージをインストール
RUN git clone https://github.com/sleepy-cat-devs/Sleepy-Cat-Discordbot.git /praxi
# 参照するブランチを切り替える場合は下で指定
# RUN git switch F_refactaring
# RUN git pull
RUN npm install

# トークンを格納したファイル
COPY settings.yml /praxi/