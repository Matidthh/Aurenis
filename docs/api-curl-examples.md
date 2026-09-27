# 🧪 SUITE DE EJEMPLOS DE LLAMADAS cURL — API AURENIS v2.4.0

**Documento:** Guía Ejecutable de Peticiones cURL y Validación de Endpoints  
**Autor Principal:** **Maicol R.** (*Backend & Architecture Lead*)  
**Validación QA & Pentesting:** **Frank M.** (*QA Lead & Ciberseguridad*)  
**Entorno de Pruebas:** Local (`http://localhost:3000`) o Staging  

---

## 📌 Guía de Uso del Archivo de Cookies

Para ejecutar las pruebas autenticadas, almacene la cookie de sesión tras el login usando el parámetro `-c cookies.txt` (cookie jar) y reutilícela en peticiones subsecuentes mediante `-b cookies.txt`.

---

## 🔐 1. MÓDULO DE AUTENTICACIÓN Y SESIONES

### 1.1 Iniciar Sesión como Director (School Admin)
```bash
curl -i -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies_admin.txt \
  -d '{
    "email": "carlos.mendoza@sanjose.cl",
    "password": "Password123!"
  }'
```
*Respuesta esperada:* `HTTP/1.1 200 OK`, cabecera `Set-Cookie: aurenis_session=...` y JSON con `"success": true`.

---

### 1.2 Iniciar Sesión como Docente
```bash
curl -i -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies_teacher.txt \
  -d '{
    "email": "roberto.gonzalez@sanjose.cl",
    "password": "Password123!"
  }'
```

---

### 1.3 Inspeccionar la Sesión Activa (`/api/auth/me`)
```bash
curl -i -X GET http://localhost:3000/api/auth/me \
  -b cookies_admin.txt
```

---

### 1.4 Conmutación de Colegio Activo (Multi-Tenant Switch)
```bash
curl -i -X POST http://localhost:3000/api/auth/select-school \
  -H "Content-Type: application/json" \
  -b cookies_admin.txt \
  -c cookies_admin.txt \
  -d '{
    "schoolId": "d3b07384-d113-468e-9767-f705e4fb0288"
  }'
```

---

### 1.5 Cerrar Sesión
```bash
curl -i -X POST http://localhost:3000/api/auth/logout \
  -b cookies_admin.txt \
  -c cookies_admin.txt
```

---

## 🏢 2. MÓDULO DE BÚSQUEDA Y CONFIGURACIÓN INSTITUCIONAL

### 2.1 Búsqueda de Instituciones
```bash
curl -i -X GET "http://localhost:3000/api/schools/search?q=San%20Jose" \
  -b cookies_admin.txt
```

---

### 2.2 Consultar Configuración del Colegio
```bash
curl -i -X GET http://localhost:3000/api/schools/colegio-san-jose/settings \
  -b cookies_admin.txt
```

---

### 2.3 Actualizar Parámetros del Decreto 67 (School Admin)
```bash
curl -i -X PATCH http://localhost:3000/api/schools/colegio-san-jose/settings \
  -H "Content-Type: application/json" \
  -b cookies_admin.txt \
  -d '{
    "minPassingGrade": 4.0,
    "maxGrade": 7.0,
    "minAttendancePercentage": 85.0,
    "academicTermType": "SEMESTER",
    "allowTeacherGradeEdit": true,
    "requireAdminApprovalForGradeChange": false
  }'
```

---

## 📅 3. MÓDULO DE PERIODOS ACADÉMICOS

### 3.1 Listar Periodos Académicos
```bash
curl -i -X GET http://localhost:3000/api/schools/colegio-san-jose/academic-periods \
  -b cookies_admin.txt
```

---

### 3.2 Crear Nuevo Periodo Académico
```bash
curl -i -X POST http://localhost:3000/api/schools/colegio-san-jose/academic-periods \
  -H "Content-Type: application/json" \
  -b cookies_admin.txt \
  -d '{
    "name": "Segundo Semestre 2026",
    "code": "2026-S2",
    "startDate": "2026-08-01T00:00:00.000Z",
    "endDate": "2026-12-20T23:59:59.000Z",
    "isCurrent": false
  }'
```

---

## 📚 4. MÓDULO DE CURSOS Y ASIGNATURAS

### 4.1 Listar Asignaturas
```bash
curl -i -X GET http://localhost:3000/api/schools/colegio-san-jose/subjects \
  -b cookies_admin.txt
```

---

### 4.2 Listar Cursos con Matrícula
```bash
curl -i -X GET http://localhost:3000/api/schools/colegio-san-jose/courses \
  -b cookies_admin.txt
```

---

### 4.3 Crear un Nuevo Curso
```bash
curl -i -X POST http://localhost:3000/api/schools/colegio-san-jose/courses \
  -H "Content-Type: application/json" \
  -b cookies_admin.txt \
  -d '{
    "name": "3° Medio Científico-Humanista",
    "gradeLevel": "TERCERO_MEDIO",
    "section": "A"
  }'
```

---

## 👨‍🎓 5. MÓDULO DE ESTUDIANTES (PROTECCIÓN NNA & CIFRADO)

### 5.1 Listar Estudiantes (Filtrado por Curso)
```bash
curl -i -X GET "http://localhost:3000/api/schools/colegio-san-jose/students?courseId=c-1medio-a" \
  -b cookies_admin.txt
```

---

### 5.2 Matricular Nuevo Estudiante (Datos Sensibles Cifrados en Backend)
```bash
curl -i -X POST http://localhost:3000/api/schools/colegio-san-jose/students \
  -H "Content-Type: application/json" \
  -b cookies_admin.txt \
  -d '{
    "firstName": "Agustín",
    "lastName": "Morales Rivas",
    "rut": "23.890.123-4",
    "birthDate": "2010-09-12",
    "gender": "MALE",
    "email": "agustin.morales@estudiantes.cl",
    "courseId": "c-1medio-a",
    "medicalNotes": "Asma estacional controlada",
    "emergencyContact": "+56 9 7788 9900"
  }'
```

---

## 👨‍🏫 6. MÓDULO DE DOCENTES Y ASIGNACIONES

### 6.1 Listar Planta Docente
```bash
curl -i -X GET http://localhost:3000/api/schools/colegio-san-jose/teachers \
  -b cookies_admin.txt
```

---

### 6.2 Asignar Docente a Asignatura y Curso
```bash
curl -i -X POST http://localhost:3000/api/schools/colegio-san-jose/teachers/teacher-uuid/assign \
  -H "Content-Type: application/json" \
  -b cookies_admin.txt \
  -d '{
    "courseId": "c-1medio-a",
    "subjectId": "sub-matematica",
    "academicPeriodId": "period-2026-s1"
  }'
```

---

## 📝 7. MÓDULO DE CALIFICACIONES Y LIBRO DE CLASES

### 7.1 Obtener Matriz Consolidada de Calificaciones (Sábana de Notas)
```bash
curl -i -X GET "http://localhost:3000/api/schools/colegio-san-jose/grades/matrix?courseId=c-1medio-a&subjectId=sub-matematica&periodId=period-2026-s1" \
  -b cookies_teacher.txt
```

---

### 7.2 Programar Nueva Evaluación (Assessment)
```bash
curl -i -X POST http://localhost:3000/api/schools/colegio-san-jose/grades/assessments \
  -H "Content-Type: application/json" \
  -b cookies_teacher.txt \
  -d '{
    "title": "Evaluación Solemne de Álgebra",
    "description": "Unidad 2: Sistemas de ecuaciones lineales",
    "date": "2026-05-20",
    "weight": 30.0,
    "courseId": "c-1medio-a",
    "subjectId": "sub-matematica",
    "academicPeriodId": "period-2026-s1"
  }'
```

---

### 7.3 Registrar Calificación Individual
```bash
curl -i -X POST http://localhost:3000/api/schools/colegio-san-jose/grades \
  -H "Content-Type: application/json" \
  -b cookies_teacher.txt \
  -d '{
    "assessmentId": "assessment-uuid",
    "studentProfileId": "student-profile-uuid",
    "value": 6.8,
    "isExempt": false,
    "feedback": "Desarrollo impecable y procedimiento ordenado"
  }'
```

---

### 7.4 Carga Masiva de Calificaciones (Bulk Insert)
```bash
curl -i -X POST http://localhost:3000/api/schools/colegio-san-jose/grades/bulk \
  -H "Content-Type: application/json" \
  -b cookies_teacher.txt \
  -d '{
    "assessmentId": "assessment-uuid",
    "grades": [
      { "studentProfileId": "student-01", "value": 6.5, "isExempt": false },
      { "studentProfileId": "student-02", "value": 5.2, "isExempt": false },
      { "studentProfileId": "student-03", "value": 1.0, "isExempt": true, "feedback": "Licencia Médica" }
    ]
  }'
```

---

## 📦 8. MÓDULO DE EXPORTACIÓN Y BACKUP

### 8.1 Descargar Copia de Seguridad Institucional (.ZIP)
```bash
curl -i -X GET http://localhost:3000/api/schools/colegio-san-jose/export \
  -b cookies_admin.txt \
  --output backup_colegio_san_jose.zip
```

---

## 👑 9. MÓDULO DE SUPERADMIN (CONTROL PLANE)

### 9.1 Listar Todos los Colegios de la Plataforma
```bash
curl -i -X GET http://localhost:3000/api/system/schools \
  -b cookies_superadmin.txt
```

---

### 9.2 Aprovisionar Nuevo Colegio Institucional
```bash
curl -i -X POST http://localhost:3000/api/system/schools \
  -H "Content-Type: application/json" \
  -b cookies_superadmin.txt \
  -d '{
    "name": "Liceo Experimental Manuel de Salas",
    "slug": "liceo-manuel-de-salas",
    "address": "Brown Norte 105, Ñuñoa",
    "phone": "+56 2 2977 1234",
    "adminFirstName": "Elena",
    "adminLastName": "Valenzuela",
    "adminEmail": "directora@lms.cl",
    "adminPassword": "PasswordSuper2026!",
    "adminRut": "11.223.344-5"
  }'
```

---

## 🛡️ 10. PRUEBAS DE SEGURIDAD Y PENTESTING (CONTROL DE BOLA / IDOR)

### 10.1 Intento de Acceso No Autorizado de Alumno a Calificaciones Ajenas (Debe fallar con HTTP 403)
```bash
curl -i -X GET "http://localhost:3000/api/schools/colegio-san-jose/grades?studentId=student-ajeno-uuid" \
  -b cookies_student.txt
```
*Respuesta esperada:* `HTTP/1.1 403 Forbidden`  
```json
{
  "error": "Acceso denegado. No está autorizado para consultar calificaciones de otro estudiante."
}
```

---

### 10.2 Intento de Manipulación de Nota por Usuario sin Permiso (Debe fallar con HTTP 403)
```bash
curl -i -X POST http://localhost:3000/api/schools/colegio-san-jose/grades \
  -H "Content-Type: application/json" \
  -b cookies_student.txt \
  -d '{
    "assessmentId": "assessment-uuid",
    "studentProfileId": "student-profile-uuid",
    "value": 7.0
  }'
```
*Respuesta esperada:* `HTTP/1.1 403 Forbidden`
