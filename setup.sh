#!/bin/bash

# Actualiza el sistema
echo "Actualizando el sistema..."
yum update -y

# Instala dependencias necesarias
echo "Instalando dependencias necesarias..."
yum install -y gcc-c++ make tar gzip curl --skip-broken

# Verifica si tar y gzip se instalaron correctamente
if ! command -v tar &> /dev/null; then
    echo "Error: tar no se pudo instalar."
    exit 1
fi

if ! command -v gzip &> /dev/null; then
    echo "Error: gzip no se pudo instalar."
    exit 1
fi

# Instala nvm (Node Version Manager)
echo "Instalando nvm..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

# Carga nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Instala Node.js
echo "Instalando Node.js..."
nvm install node

# Verifica las instalaciones
echo "Verificando instalaciones..."
node -v
npm -v

echo "Instalación completada. Node.js y npm están listos para usar."
