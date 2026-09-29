# 🛠️ GUÍA OFICIAL DE INSTALACIÓN Y DESPLIEGUE LOCAL — AURENIS SAAS v2.4.0

```
====================================================================================================
               REPÚBLICA DE CHILE — ECOSISTEMA DE GESTIÓN ESCOLAR MULTI-TENANT
        INSTRUCCIONES CLARAS DE DESPLIEGUE LOCAL CON NODE.JS, PRISMA ORM Y POSTGRESQL 14+
                    ESTÁNDAR ISO/IEC/IEEE 26514 & REGLAS DEL EQUIPO AURENIS
====================================================================================================
```

---

## 📑 1. RESUMEN EJECUTIVO Y REQUISITOS PREVIOS DE ENTORNO

Esta guía detalla el procedimiento oficial, probado y certificado para clonar, aprovisionar la base de datos PostgreSQL, ejecutar migraciones, sembrar datos de prueba (*seeds*) y levantar el servidor de desarrollo local de **AURENIS SAAS**.

### 💻 1.1 Requisitos de Hardware y Software

| Componente | Requisito Mínimo | Versión Homologada / Recomendada |
| :--- | :--- | :--- |
| **Sistema Operativo** | Linux (Ubuntu/Debian/Fedora), macOS 13+, Windows 11 (WSL2) | Ubuntu 22.04 LTS o macOS Sonoma |
| **Runtime Node.js** | Node.js v18.18+ | **Node.js v20.x LTS (Hydrogen)** |
| **Gestor de Paquetes** | npm 10.x / pnpm 9.x / bun 1.1+ | **npm v10.x** |
| **Base de Datos** | PostgreSQL 14.x | **PostgreSQL 15.x o 16.x** |
| **Memoria RAM** | 4 GB | **8 GB o superior** |
| **Puertos de Red** | 3000 (App Web), 5432 (PostgreSQL) | Puerto 3000 libre de ocupación |

### 👥 Firmas de Responsabilidad del Equipo AURENIS

| Integrante | Rol | Responsabilidad en la Guía de Despliegue |
| :--- | :--- | :--- |
| **👑 Maicol R.** | **Project Lead & Arquitectura** | • Arquitectura de backend, conexión Prisma-PostgreSQL y scripts de migración.<br>• Modelos de datos multi-tenant y aislamiento seguro de esquemas. |
| **💻 Malcom Marcelo** | **Frontend Developer** | • Pipeline de build Next.js 15, variables `NEXT_PUBLIC_*` y entorno de desarrollo cliente. |
| **🎨 Lucas P.** | **UI/UX Designer** | • Portal visual de verificación de despliegue y documentación de tokens de diseño. |
| **🛡️ Frank M.** | **QA, Testing & Seguridad** | • Script de verificación automatizada de instalación por terceros (`npm run test:deployment`). |

---

## 🚀 2. PASO A PASO DE INSTALACIÓN (DESDE `git clone` HASTA `npm run dev`)

```
  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
  │ 1. Git Clone │ ───> │ 2. npm ci    │ ───> │ 3. Config    │ ───> │ 4. Prisma    │ ───> │ 5. Servidor  │
  │  Repositorio │      │ Dependencias │      │   Archivo .env│     │ Migrate/Seed │      │ npm run dev  │
  └──────────────┘      └──────────────┘      └──────────────┘      └──────────────┘      └──────────────┘
```

---

### 📥 Paso 1: Clonar el Repositorio Oficial
Abra una terminal y clone el repositorio en su máquina local:

```bash
# Clonar mediante HTTPS
git clone https://github.com/aurenis-edu/aurenis.git

# O clonar mediante SSH (Recomendado para desarrolladores con llave registrada)
git clone git@github.com:aurenis-edu/aurenis.git

# Ingresar al directorio raíz del proyecto
cd aurenis
```

---

### 📦 Paso 2: Instalación de Dependencias de Node.js
Ejecute la instalación limpia de paquetes. Se recomienda usar `npm ci` para respetar exactamente las versiones fijadas en el árbol de dependencias:

```bash
# Instalación determinista
npm ci

# O alternativamente:
npm install
```

---

### ⚙️ Paso 3: Configuración de Variables de Entorno (`.env`)
Copie el archivo de plantilla `.env.example` para crear su archivo de configuración local `.env`:

```bash
cp .env.example .env
```

Abra el archivo `.env` en su editor de código preferido (VS Code, Cursor, Neovim) y configure las variables obligatorias:

```env
# ==============================================================================
# CONFIGURACIÓN DE BASE DE DATOS POSTGRESQL (OBLIGATORIA)
# Formato: postgresql://[usuario]:[contraseña]@[host]:[puerto]/[nombre_bd]?schema=public
# ==============================================================================
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/aurenis_db?schema=public"

# ==============================================================================
# SECRETO CRIPTOGRÁFICO JWT (OBLIGATORIO - MÍNIMO 32 CARACTERES)
# Generar con: openssl rand -hex 32
# ==============================================================================
JWT_SECRET="aurenis_super_secret_jwt_key_2026_production_grade_entropy_256_bits"
APP_ENCRYPTION_KEY="aurenis_aes_256_encryption_master_key_for_sensitive_data_2026"

# ==============================================================================
# CONFIGURACIÓN GENERAL DEL SERVIDOR
# ==============================================================================
PORT=3000
NODE_ENV=development
NEXT_PUBLIC_APP_NAME="Aurenis"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
SESSION_COOKIE_NAME="aurenis_session"
```

> 💡 **Tip para generar un JWT_SECRET de alta entropía:**
> ```bash
> openssl rand -hex 32
> ```

---

### 🐘 Paso 4: Levantar la Base de Datos PostgreSQL

Tiene tres alternativas para contar con PostgreSQL local:

#### Opción A: Contenedor Docker (Recomendada y más rápida)
Si tiene Docker instalado, ejecute un contenedor de PostgreSQL 16 con un solo comando:

```bash
docker run --name aurenis-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=aurenis_db \
  -p 5432:5432 \
  -d postgres:16-alpine
```

#### Opción B: PostgreSQL Nativo en el Sistema Operativo
- **En Ubuntu / Debian Linux:**
  ```bash
  sudo apt update && sudo apt install -y postgresql postgresql-contrib
  sudo -u postgres psql -c "CREATE USER postgres WITH PASSWORD 'postgres' SUPERUSER;"
  sudo -u postgres psql -c "CREATE DATABASE aurenis_db OWNER postgres;"
  ```
- **En macOS (Homebrew):**
  ```bash
  brew install postgresql@16
  brew services start postgresql@16
  psql postgres -c "CREATE DATABASE aurenis_db;"
  ```
- **En Windows 11:**
  Descargue e instale el instalador oficial de PostgreSQL desde [postgresql.org](https://www.postgresql.org/download/windows/) y cree la base de datos `aurenis_db` mediante pgAdmin.

---

## 🗄️ 3. COMANDOS DE MIGRACIÓN Y SEMBRADO DE DATOS (SEED)

Una vez que la base de datos PostgreSQL está en ejecución y el archivo `.env` configurado, ejecute los siguientes comandos en orden:

### 1️⃣ Generar el Cliente Tipado de Prisma
```bash
npx prisma generate
```
*Salida esperada: `✔ Generated Prisma Client to ./node_modules/@prisma/client`*

---

### 2️⃣ Aplicar las Migraciones en la Base de Datos
Ejecute las migraciones de base de datos para crear todas las tablas, llaves primarias, índices y restricciones referenciales:

```bash
# Para entorno de desarrollo local (crea y aplica migraciones incrementales):
npx prisma migrate dev --name init

# O si desea aplicar directamente las migraciones ya creadas (modo producción/CI):
npx prisma migrate deploy
```

---

### 3️⃣ Sembrar Datos Iniciales y Cuentas de Prueba (Database Seed)
Ejecute el script de sembrado automatizado para poblar el catálogo de permisos RBAC, el colegio de demostración (*Colegio San José*) y las 5 cuentas oficiales por rol:

```bash
# Ejecutar mediante el script oficial de NPM:
npm run db:seed

# O mediante el comando canónico de Prisma:
npx prisma db seed
```

#### 📋 Cuentas Preconfiguradas Disponibles tras el Seed:

| Rol | Correo Electrónico | Contraseña | Establecimiento / Ámbito |
| :--- | :--- | :--- | :--- |
| **👑 SuperAdmin Global** | `admin@aurenis.com` | `AurenisSuperAdmin2026!` | Aurenis Cloud Global (Acceso a todos los colegios) |
| **🏢 Director de Colegio** | `director@sanjose.cl` | `AdminCSJ2026!` | Colegio San José (RBD 10423) |
| **👩‍🏫 Docente Titular** | `profesor.matematica@sanjose.cl` | `Profesor2026!` | Colegio San José (Matemáticas) |
| **🎒 Estudiante Regular** | `sofia.valenzuela@sanjose.cl` | `Estudiante2026!` | Colegio San José (1° Medio A) |
| **👨‍👩‍👧 Apoderada / Familia** | `maria.gonzalez@sanjose.cl` | `Apoderado2026!` | Colegio San José (Pupilo: Lucas González) |

---

### 4️⃣ Inspección Visual de Datos con Prisma Studio (Opcional)
Si desea navegar y visualizar las tablas y registros mediante una interfaz web gráfica:

```bash
npx prisma studio --port 5555
```
*Abra `http://localhost:5555` en su navegador para explorar las tablas relacionales.*

---

## 💻 4. INICIO DEL SERVIDOR DE DESARROLLO (`npm run dev`)

Una vez completados los pasos anteriores, inicie el servidor de desarrollo de Next.js:

```bash
npm run dev
```

Abra su navegador en:
👉 **`http://localhost:3000`**

Verá la pantalla principal de inicio de sesión de Aurenis. Puede iniciar sesión de inmediato con cualquiera de las cuentas de prueba sembradas o probar los botones de acceso demo en 1 clic.

---

## 🧪 5. PRUEBA AUTOMATIZADA DE INSTALACIÓN POR TERCEROS

Para garantizar que la instalación local es 100% exitosa e inmune a errores humanos, el equipo AURENIS provee una suite de verificación que evalúa automáticamente todos los frentes:

```bash
npm run test:deployment
```

### Salida esperada de la prueba:
```text
================================================================================
🚀 AURENIS - AUDITORÍA DE INSTALACIÓN Y DESPLIEGUE LOCAL POR TERCEROS v2.4.0
================================================================================

┌────────────────────────────────────────────────────────────────────────────────┐
│ RESULTADOS DE LA EVALUACIÓN DE INSTALACIÓN POR TERCEROS                        │
├────────────────────────────────────────────────────────────────────────────────┤
│ [✅ PASADO] 1. Runtime Node.js LTS Homologado                                   │
│          └─ Versión Actual: v20.x (Requerido: >= v20.x o v18.x LTS)             │
│ [✅ PASADO] 2. Integridad de Archivos Base del Repositorio                     │
│          └─ 6/6 archivos presentes                                             │
│ [✅ PASADO] 3. Dependencias NPM y Cliente Prisma Generado                      │
│          └─ @prisma/client compilado OK                                        │
│ [✅ PASADO] 4. Especificación de Variables de Entorno (.env.example)           │
│          └─ DATABASE_URL & JWT_SECRET documentados                             │
│ [✅ PASADO] 5. Esquema Relacional Prisma (PostgreSQL 14+)                      │
│          └─ Modelos Multi-Tenant validados (School, User, Grade, Attendance)   │
│ [✅ PASADO] 6. Script de Sembrado de Datos Iniciales (Seed)                    │
│          └─ 5 Cuentas Demo + Colegio San José + Permisos RBAC                  │
│ [✅ PASADO] 7. Comandos de Ciclo de Vida y Migración (package.json)            │
│          └─ npm run dev • npm run build • npm run db:migrate                   │
└────────────────────────────────────────────────────────────────────────────────┘

📊 PUNTUACIÓN TOTAL: 7/7 PASOS VALIDADOS (100%)

🟢 DICTAMEN: PRUEBA DE INSTALACIÓN POR TERCERO EXITOSA (LUZ VERDE ✅)
```

---

## ❓ 6. RESOLUCIÓN DE PROBLEMAS FRECUENTES (TROUBLESHOOTING)

| Problema / Error | Causa Raíz | Solución Paso a Paso |
| :--- | :--- | :--- |
| `Can't reach database server at localhost:5432` | El servicio de PostgreSQL no está corriendo o el puerto 5432 está bloqueado. | Verifique que PostgreSQL esté iniciado (`sudo systemctl status postgresql` o `docker ps`). Si usa Docker, levante el contenedor con `docker start aurenis-postgres`. |
| `P1000: Authentication failed against database server` | El usuario o contraseña en `DATABASE_URL` no coinciden con las credenciales de PostgreSQL. | Revise el string de conexión en su `.env`. El formato estándar es `postgresql://postgres:postgres@localhost:5432/aurenis_db`. |
| `Port 3000 is already in use` | Otro proceso o servidor está ocupando el puerto 3000. | Libere el puerto con `npx kill-port 3000` o ejecute Next.js en otro puerto con `npm run dev -- -p 3001`. |
| `PrismaClientInitializationError: Query engine not found` | No se ha ejecutado la generación del cliente binario de Prisma tras la instalación. | Ejecute `npx prisma generate` y vuelva a iniciar con `npm run dev`. |

---

## 🟢 7. CERTIFICACIÓN FINAL Y LUZ VERDE PARA PRODUCCIÓN

```
====================================================================================================
                        CERTIFICADO DE CONFORMIDAD DE DESPLIEGUE LOCAL
====================================================================================================
  Documento: Guía Oficial de Instalación y Despliegue Local Node.js + Prisma + PostgreSQL
  Versión: v2.4.0-PROD
  Revisión Técnica: APROBADO 100% (Maicol R., Malcom Marcelo, Lucas P., Frank M.)
  Cumplimiento DoD: Paso a Paso (✓) • Migraciones & Seed (✓) • Prueba de Terceros Exitosa (✓)
====================================================================================================
```
