# Pruebas cURL - API Aurenis

A continuación se incluyen ejemplos de pruebas cURL para interactuar con los endpoints documentados en la especificación OpenAPI (`docs/openapi.yaml`).

## 1. Autenticación (Login)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "director@sanjose.cl",
    "password": "AdminCSJ2026!"
  }' -c cookies.txt
```

## 2. Seleccionar Contexto Escolar (Multi-Tenant)
*Nota: Requiere cookie de sesión parcial.*
```bash
curl -X POST http://localhost:3000/api/auth/select-school \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -c cookies.txt \
  -d '{
    "schoolId": "<UUID_DEL_COLEGIO>"
  }'
```

## 3. Listar todos los colegios (System Admin)
*Nota: Requiere autenticación de System Admin.*
```bash
curl -X GET http://localhost:3000/api/system/schools \
  -b cookies.txt
```

## 4. Crear un Nuevo Colegio (System Admin)
```bash
curl -X POST http://localhost:3000/api/system/schools \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Liceo Bicentenario",
    "slug": "liceo-bicentenario",
    "adminFirstName": "Ana",
    "adminLastName": "Pérez",
    "adminEmail": "ana.perez@liceo.cl",
    "adminPassword": "PasswordFuerte2026!",
    "adminRut": "12345678-9"
  }'
```

## 5. Actualizar Configuración Institucional
```bash
curl -X PATCH http://localhost:3000/api/schools/<UUID_DEL_COLEGIO>/settings \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "minPassingGrade": 4.0,
    "maxGrade": 7.0,
    "academicTermType": "SEMESTER"
  }'
```

## 6. Cerrar Sesión
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt \
  -c cookies.txt
```
