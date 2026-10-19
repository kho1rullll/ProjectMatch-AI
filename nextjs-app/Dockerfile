# Gunakan base image Node.js 20 Alpine yang ringan
FROM node:20-alpine

WORKDIR /app

# Instal dependensi kompatibilitas sistem Alpine untuk Next.js
RUN apk add --no-cache libc6-compat curl

# Salin file konfigurasi paket
COPY package.json package-lock.json* ./

# Instal semua dependensi proyek
RUN npm install

# Salin seluruh source code proyek frontend
COPY . .

# Set environment variabel untuk proses build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build aplikasi Next.js (SSG & Optimized Server)
RUN npm run build

# Port yang dibuka
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Jalankan server Next.js production
CMD ["npm", "start"]
