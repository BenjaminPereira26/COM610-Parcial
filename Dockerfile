# syntax=docker/dockerfile:1
FROM node:20-alpine

WORKDIR /app

# Copiar archivos de dependencias primero (aprovechar caché)
COPY package*.json ./
RUN npm ci --omit=dev

# Copiar código fuente
COPY src ./src

# Exponer el puerto (documental, el mapeo real se hace con -p)
EXPOSE 3000

# Ejecutar la API
CMD ["node", "src/app.js"]