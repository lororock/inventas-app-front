#!/bin/bash

echo "Iniciando deploy a Firebase"

echo "Compilando aplicación"
npm run build

echo "Subiendo a Firebase Hosting"
firebase deploy

echo "Despliegue completado."
