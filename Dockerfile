# Usa Amazon Linux 2023 como base
FROM amazonlinux:2023

# Establece el directorio de trabajo
WORKDIR /apptmp

# Instala Node.js, npm, y otras dependencias necesarias
RUN yum update -y && \
    yum install -y gcc-c++ make tar gzip curl --allowerasing && \
    curl -sL https://rpm.nodesource.com/setup_18.x | bash - && \
    yum install -y nodejs

# Copia los archivos de tu proyecto
COPY . .

# Instala las dependencias de la aplicación usando npm
RUN npm install

# Exponer el puerto en el que tu aplicación escuchará
EXPOSE 5173

# Comando para ejecutar tu aplicación
#CMD ["npm", "run", "dev", "--", "--host"]
CMD ["tail", "-f", "/dev/null"]