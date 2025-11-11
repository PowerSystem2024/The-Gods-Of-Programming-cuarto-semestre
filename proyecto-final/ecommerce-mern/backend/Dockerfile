# Etapa 1: Build
FROM node:20-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Etapa 2: Producción
FROM node:20-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copiar dependencias desde builder
COPY --from=builder /app/node_modules ./node_modules

# Copiar código fuente
COPY . .

# Cambiar ownership a usuario nodejs
RUN chown -R nodejs:nodejs /app

# Cambiar a usuario no-root
USER nodejs

# Exponer puerto
EXPOSE 5000

# Variable de entorno para producción
ENV NODE_ENV=production

# Comando de inicio
CMD ["node", "server.js"]
