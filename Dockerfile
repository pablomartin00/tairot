# Usa Amazon Linux 2023 como base
FROM amazonlinux:2023

# Establece el directorio de trabajo
WORKDIR /app

# Instala dependencias necesarias
RUN yum update -y && \
    yum install -y gcc-c++ make tar gzip curl --allowerasing && \
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

# Cargar nvm y configurar PATH
ENV NVM_DIR="/root/.nvm"
RUN bash -c "source $NVM_DIR/nvm.sh && nvm install node && nvm use node"

# Copia los archivos de tu proyecto
COPY . .

# Instala las dependencias de la aplicación usando nvm
RUN bash -c "source $NVM_DIR/nvm.sh && npm install"

# Exponer el puerto en el que tu aplicación escuchará
EXPOSE 5173

# Comando para ejecutar tu aplicación
CMD ["bash", "-c", "source $NVM_DIR/nvm.sh && npm run dev -- --host"]