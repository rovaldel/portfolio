# Usa una imagen base de Nginx muy ligera
FROM nginx:alpine

# Copia todos tus archivos estáticos al directorio de servicio de Nginx
COPY . /usr/share/nginx/html/


##Prueba para verificar que Github actions funciona