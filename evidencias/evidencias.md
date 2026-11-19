# **Ejercicio 1**

# Configuraciones en AWS

## Grupos de seguridad

### EC2

![](images/img1.png)

### RDS

![](images/img2.png)

## Creacion del RDS

![](images/img3.png)

![](images/img4.png)

![](images/img9.png)


## Creacion del EC2

![](images/img6.png)

![](images/img5.png)

![](images/img7.png)

![](images/img8.png)

## Conexion a la EC2 por terminal

![](images/img10.png)

![](images/img11.png)

![](images/img12.png)

Instaalr mysql y crear la bd con la tabla libros

![](images/img13.png)

![](images/img14.png)

Instalar node

![](images/img15.png)

![](images/img16.png)

## Proyecto dentro de la ec2

![](images/img17.png)

Variables de entorno:

![](images/img18.png)

db.js (codigo en src/db.js) :

![](images/img19.png)

app.js (codigo en src/app.js):

![](images/img20.png)

Instalacion de pm2:

![](images/img21.png)

![](images/img22.png)

Status de la api desde ec2:

![](images/img23.png)

Instalar nginx:

![](images/img24.png)

Configuracion del sitio:

![](images/img25.png)

```bash
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
![](images/img26.png)

## Verificacion desde ec2 local:

Recisión de operaciones crud:

![](images/img27.png)

Persistencia en la BD:

![](images/img28.png)

# **Ejercicio 2**

## Dependencias:

Instalacion Jest + Supertest:

![](images/img29.png)

Añadir a package.json:

![](images/img30.png)

Refactorizar src/app.js para que sea testeable:

![](images/img31.png)

Crear el archivo de pruebas tests/app.test.js:

![](images/img32.png)

Ejecutar las pruebas en local:

![](images/img33.png)

## Crear el Dockerfile

![](images/img34.png)

# Construir y probar localmente

![](images/img35.png)

![](images/img36.png)

![](images/img37.png)

## Crear el workflow

ci.yml:

![](images/img38.png)

cd.yml:

![](images/img39.png)

# Repository secrets:

![](images/img40.png)

# EC2 preparacion para contenedores

![](images/img41.png)

![](images/img42.png)

liberar pm2:

![](images/img43.png)


Verificar que Docker Hub funciona:

![](images/img44.png)

![](images/img45.png)

## Sugir a github

![](images/img46.png)

![](images/img47.png)


## Verificar el despliegue

![](images/img48.png)

![](images/img49.png)

![](images/img50.png)

![](images/img51.png)


## Demostrar "cambio visible"

![](images/img52.png)

![](images/img53.png)

![](images/img54.png)


## Demostrar conservación de la versión anterior ante fallos


