# Dockerfile.backend
# Usa uma imagem Node.js oficial como base
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos package.json e package-lock.json para instalar as dependências
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia todo o código da aplicação para o container
COPY . .

# Expõe a porta que o backend vai usar
EXPOSE 4000

# Comando para iniciar a aplicação
# Usa 'npm run dev' para desenvolvimento com nodemon, para hot-reloading
# Para produção, você usaria 'npm start'
CMD ["npm", "run", "dev"]
