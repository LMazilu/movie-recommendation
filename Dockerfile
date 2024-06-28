# Usa un'immagine ufficiale di Node.js come base
FROM node:22

# Imposta la directory di lavoro
WORKDIR /usr/src/app

# Copia package.json e package-lock.json
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia il resto dell'applicazione
COPY . .

# Compila l'applicazione
RUN npm run build

# Esponi la porta dell'applicazione
EXPOSE 3030

# Comando per avviare l'applicazione
CMD ["npm", "run", "start:prod"]
