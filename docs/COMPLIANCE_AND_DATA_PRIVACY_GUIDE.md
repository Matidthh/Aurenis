# ⚖️ GUÍA DE CUMPLIMIENTO NORMATIVO, PRIVACIDAD ESCOLAR Y PROTECCIÓN DE DATOS — AURENIS v1.0

**Documento:** Manual de Cumplimiento Regulatorio, Circular N° 482 y Protección de la Niñez  
**Plataforma:** AURENIS — Sistema de Gestión Académica y Multi-Tenant Escolar  
**Fecha:** Septiembre de 2026  
**Clasificación:** Legal / Cumplimiento / Privacidad de la Información  

---

## 1. Alcance y Compromiso Regulatorio

AURENIS está diseñado para satisfacer y superar las exigencias técnicas y operacionales del marco regulatorio educacional chileno e internacional, garantizando que el tratamiento de datos de estudiantes, apoderados y docentes cumpla con los más altos estándares de privacidad y seguridad de la información.

---

## 2. Circular N° 482 de la Superintendencia de Educación (Chile)
### Requisitos del Libro de Clases Digital y Solución Técnica en Aurenis

| Requisito Circular N° 482 | Exigencia Técnica | Implementación en AURENIS v1.0 | Estado de Conformidad |
| :--- | :--- | :--- | :---: |
| **Inalterabilidad de Registros** | Las calificaciones y asistencias no deben ser modificables sin trazabilidad una vez cerradas. | Validación de `AcademicPeriod.isClosed` que bloquea mutaciones; auditoría diff obligatoria. | 🟢 **100% Conforme** |
| **No Repudio & Autenticación** | Toda acción debe estar vinculada de forma inequívoca al usuario que la realizó. | Sesiones criptográficas JWT con cookies `HttpOnly`, `SameSite=Lax` y registro de `userId` en `AuditLog`. | 🟢 **100% Conforme** |
| **Registro Horario de Asistencia** | La asistencia debe registrarse por jornada y bloque de clases. | Modelo `AttendanceRecord` vinculado a fecha, curso y estado (`PRESENT`, `ABSENT_JUSTIFIED`, etc.). | 🟢 **100% Conforme** |
| **Disponibilidad & Exportación** | Capacidad de emitir certificados y concentraciones de notas oficiales. | Reportes de notas consolidados por curso, periodo y alumno. | 🟢 **100% Conforme** |
| **Pista de Auditoría Electrónica** | Bitácora inmutable de eventos con fecha, hora, IP y detalle de cambios. | Tabla `AuditLog` append-only en la base de datos relacional. | 🟢 **100% Conforme** |

---

## 3. Protección de Datos de Menores (Ley N° 19.628, Ley N° 21.430 y GDPR Art. 8)

### 3.1 Datos Sensibles y Diagnósticos de Salud (`medicalNotes`)
- **Norma Aplicable:** Art. 10 de la Ley N° 19.628 prohíbe el tratamiento de datos sensibles salvo autorización expresa de la ley o consentimiento de los titulares.
- **Control Técnico:** El campo `medicalNotes` del perfil del estudiante está segregado en el modelo de persistencia y no se incluye en respuestas JSON de endpoints generales de alumnos o profesores.
- **Acceso:** Restringido exclusivamente al equipo directivo (`SCHOOL_ADMIN`) y personal de salud escolar autorizado.

### 3.2 Medidas Cautelares de Familia y Derechos de Custodia (`canPickUp`)
- **Norma Aplicable:** Ley N° 21.430 sobre Protección Integral de los Derechos de la Niñez y Adolescencia.
- **Control Técnico:** 
  - La asignación de facultades de retiro físico de un alumno (`canPickUp: true/false`) requiere rol `SCHOOL_ADMIN`.
  - Los apoderados con medidas judiciales de alejamiento o pérdida de patria potestad no pueden ser vinculados como contactos autorizados.
  - Toda modificación en la tabla `StudentGuardian` genera un evento de auditoría de seguridad clasificado como `SECURITY_EVENT`.

### 3.3 Trazabilidad y Ubicación Física
- Los horarios de clases (`ScheduleBlock`) y la asistencia diaria no son públicos ni indexables por buscadores.
- La consulta de notas y asistencia para estudiantes y apoderados está acotada estrictamente a sus propios pupilos (Anti-IDOR / RBAC `GRADES_VIEW`).

---

## 4. Derechos ARCO de los Titulares (Acceso, Rectificación, Cancelación y Oposición)

AURENIS provee los mecanismos para que los apoderados titulares ejerzan sus derechos legales sobre los datos de sus pupilos:

1. **Derecho de Acceso:** El apoderado puede consultar la ficha completa de su pupilo, su historial de calificaciones y asistencia desde el portal institucional.
2. **Derecho de Rectificación:** La corrección de datos de identificación (RUT, nombres, fecha de nacimiento) se gestiona a través de la secretaría escolar con rol `SCHOOL_ADMIN`.
3. **Derecho de Supresión / Retención:** Los datos académicos oficiales se conservan según los plazos legales fijados por el Ministerio de Educación; los datos no esenciales pueden ser depurados a solicitud del titular.

---

## 5. Matriz de Responsabilidad en el Tratamiento de Datos

- **Responsable del Tratamiento (*Data Controller*):** El establecimiento educacional (Colegio/Institución) que matricula al estudiante.
- **Encargado del Tratamiento (*Data Processor*):** AURENIS como proveedor de la plataforma SaaS cloud.
- **Delegado de Protección de Datos (DPO):** Contacto oficial en `dpo@aurenis.com` para consultas y requerimientos normativos.
