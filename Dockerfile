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
ENV KEY_ID='00539da301e31380000000001'
ENV KEY_NAME='cubosApi'
ENV APP_KEY='K005vc37z1DmLLTspOuyGOwWmjVMGHg'
ENV ENDPOINT_S3='s3.us-east-005.backblazeb2.com'
ENV BACKBLAZE_BUCKET='cubosApi'
ENV DB_HOST='motty.db.elephantsql.com'
ENV DB_USER='majpcvww'
ENV DB_PASS='287l_kltks1LqTH6ottsK5RdBvAE2XZF'
ENV DB_NAME='majpcvww'
ENV DB_PORT=5432
ENV SENHA_JWT="shaienne"

# Comando para iniciar a aplicação
CMD ["npm", "start"]
