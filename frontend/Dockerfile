# Dockerfile.frontend
# Usa uma imagem Node.js oficial como base para o build (React)
FROM node:18-alpine as build

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos package.json e package-lock.json para instalar as dependências
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia todo o código da aplicação para o container
COPY . .

# Constrói a aplicação React para produção
RUN npm run build

# Usa uma imagem Nginx leve para servir os arquivos estáticos da aplicação
FROM nginx:alpine

# Copia os arquivos construídos do estágio 'build' para o diretório de serviço do Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copia a configuração padrão do Nginx (opcional, pode ser personalizado)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta padrão do Nginx
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
