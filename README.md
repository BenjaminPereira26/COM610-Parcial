# COM610-Parcial

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

