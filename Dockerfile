# Use a imagem base do Node.js
FROM node:14

# Crie e defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos do projeto para o diretório de trabalho
COPY . .

# Instale as dependências
RUN npm install

# Exponha a porta que a aplicação irá usar
EXPOSE 3000

# Variáveis de ambiente
ENV PORT=3000
ENV KEY_ID=''
ENV KEY_NAME=''
ENV APP_KEY=''
ENV ENDPOINT_S3=''
ENV BACKBLAZE_BUCKET=''
ENV DB_HOST=''
ENV DB_USER=''
ENV DB_PASS=''
ENV DB_NAME=''
ENV DB_PORT=
ENV SENHA_JWT=""

# Comando para iniciar a aplicação
CMD ["npm", "start"]
