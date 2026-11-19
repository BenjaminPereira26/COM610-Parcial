# COM610-Parcial

Las capturas de verificación se encuentran en la carpeta [`evidencias/`](./evidencias/)[cite: 1]

# API Libros — Examen Parcial 2 (COM610)

**Universidad San Francisco Xavier de Chuquisaca**  
**Docente:** Ing. Marcelo Quispe Ortega  
**Semestre:** 2/2026  
**Estudiante:** Pereira Manzano Benjamín Solano — BSPM

API REST desarrollada con Node.js y Express para la gestión de un catálogo de libros. La aplicación se ejecuta en **Amazon EC2** (Ubuntu LTS) y persiste los datos en **Amazon RDS for MySQL**. La API se publica a través de **Nginx** como proxy inverso en el puerto 80.

---

## URL pública de la API

http://54.211.67.54

## Recursos de AWS utilizados

| Recurso | Configuración |
|---|---|
| **VPC** | Default VPC `vpc-07d8aa55320a902ce` (compartida por EC2 y RDS) |
| **EC2** | Ubuntu Server LTS, tipo `t2.micro`, identificador `ec2-libros-[INICIALES]` |
| **Security Group EC2** | `ec2-libros-sg`: SSH (22) solo desde mi IP pública; HTTP (80) desde `0.0.0.0/0`. Puerto 3000 **no** expuesto a Internet. |
| **RDS** | MySQL 8.4, `db.t4g.micro` (capa gratuita), identificador `libros-db-[INICIALES]` |
| **Endpoint RDS** | `libros-db-bspm.cqx60sm88ze5.us-east-1.rds.amazonaws.com:3306` |
| **Security Group RDS** | `rds-ec2-3`: MySQL/Aurora (3306) **solo** desde el SG de EC2. Acceso público: **No**. |
| **Nginx** | Proxy inverso en puerto 80 → `127.0.0.1:3000` |
| **PM2** | Gestor de procesos para mantener la API corriendo |

> **Nota:** Ningún recurso sensible (`.env`, `.pem`, contraseñas) está incluido en el repositorio.

## Estructura del repositorio

.
├── src/
│ ├── app.js # Lógica de la API (rutas, validaciones)
│ └── db.js # Pool de conexión a RDS (mysql2)
├── db.sql # Script de creación de la base y tabla
├── evidencias/ # Capturas de verificación
├── package.json
├── package-lock.json
├── .env.example # Variables de entorno ficticias
├── .gitignore
└── README.md

## Ejecutar api

# Health
curl http://54.211.67.54/health

```bash
# Crear un libro
curl -X POST http://54.211.67.54/libros \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Cien años de soledad","autor":"García Márquez","anio_publicacion":1967}'

# Listar
curl http://54.211.67.54/libros

# Actualizar
curl -X PUT http://54.211.67.54/libros/1 \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Cien años de soledad (Ed. especial)","autor":"G. Márquez","anio_publicacion":1967}'

# Eliminar
curl -X DELETE http://54.211.67.54/libros/1

```

## CI/CD y enlaces de verificación

- **URL pública de la API:** `http://54.211.67.54`
- **Workflow CI (`.github/workflows/ci.yml`):** [Enlace a una ejecución exitosa en GitHub Actions]
- **Workflow CD (`.github/workflows/cd.yml`):** [Enlace a una ejecución exitosa en GitHub Actions]

## Pruebas automatizadas y ejecución con Docker

### Ejecutar pruebas (Jest + Supertest)
Las pruebas utilizan un doble/mock de la capa de datos y no requieren conexión a una instancia RDS real:

```bash
npm ci
npm test
```

Construir y probar la imagen Docker localmente
```bash
docker build -t api-libros:local .
docker run --rm -p 3000:3000 \
  -e PORT=3000 \
  -e DB_HOST=localhost \
  -e DB_PORT=3306 \
  -e DB_USER=usuario_prueba \
  -e DB_PASSWORD=password_prueba \
  -e DB_NAME=libros_db \
  api-libros:local
```

#### 3. Flujo de CI/CD y cómo verificar el despliegue
Explica brevemente cómo actúan `.github/workflows/ci.yml` y `.github/workflows/cd.yml`, cómo se protege el despliegue (solo en cambios incorporados a la rama principal, no en `pull_request`, con trabajos dependientes y validación de `/health` y `/libros` conservando/restaurando la versión anterior si falla) y cómo comprobar el despliegue en EC2[cite: 1]:

```markdown
## Despliegue automatizado (CD) y verificación

1. **Integración continua (`ci.yml`):** ejecuta `npm ci` y `npm test` en cada `push` y `pull_request` hacia la rama principal.
2. **Despliegue continuo (`cd.yml`):** en cambios en la rama principal (no en `pull_request`), ejecuta en orden: pruebas, construcción y publicación de la imagen Docker etiquetada con el SHA del commit (`$GITHUB_SHA`) en el registro de contenedores, y despliegue en EC2 usando GitHub Secrets.
3. **Aislamiento y proxy:** el contenedor corre en EC2 recibiendo las variables de RDS por entorno y escuchando a través de **Nginx** en el puerto `80` (sin exponer el puerto `3000` a Internet).
4. **Verificación post-despliegue:** el workflow comprueba `/health` y consulta `/libros`; si falla, detiene el despliegue y conserva o restaura la versión anterior.

Para verificar manualmente tras un despliegue:

```bash
curl -i [http://54.211.67.54/health](http://54.211.67.54/health)
curl -i [http://54.211.67.54/libros](http://54.211.67.54/libros)
```