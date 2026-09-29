# Aurenis — Runbook de Respuesta a Incidentes de Seguridad

**Última actualización:** Septiembre 2026  
**Responsable Primario:** Equipo de Seguridad e Infraestructura (`seguridad@aurenis.cl`)

---

## 1. Flujo de Respuesta Inmediata (Nivel 1 — PagerDuty / Slack Alert)

### Alerta: `[CRITICAL_SECURITY_ALERT] Redis down during AUTH rate limit check`
* **Severidad:** P1 - Alta Disponibilidad / Seguridad
* **Disparador:** El servicio Redis (Upstash) se encuentra inaccesible durante intentos de autenticación. El sistema entra automáticamente en modo **Fail-Closed conservador local** (máximo 3 intentos por IP/usuario en la instancia activa de Cloud Run).

#### Protocolo de Acción (Paso a Paso)
1. **Verificar Estado de Upstash / Redis:**
   - Ingresar a la consola de Upstash / Cloud MemoryStore y verificar métricas de latencia, memoria y conectividad.
   - Probar conectividad manual con la CLI de Redis utilizando las credenciales de respaldo.
2. **Revisar Salud de Instancias en Cloud Run:**
   - Verificar si hubo un pico anormal de tráfico o ataque de denegación de servicio (DDoS) dirigido a los endpoints `/api/auth/login` o `/api/auth/forgot-password`.
3. **Restablecer Conexión de Redis:**
   - Si la instancia de Redis expiró o falló por límites de cuota, escalar la instancia en Upstash/GCP o activar la URL de Failover (`UPSTASH_REDIS_REST_URL_BACKUP`).
4. **Verificación de Normalidad:**
   - Ejecutar el script `npx tsx scripts/security-hardening-test.ts` para confirmar el restablecimiento del rate limiter distribuido.
   - Resolver el incidente en PagerDuty e informar en `#incidencias-seguridad`.

---

## 2. Alerta: Intento de Inyección o Compromiso de Integridad (AuditLog)
* **Severidad:** P1 - Seguridad de Datos Personales (Ley 21.719)
* **Disparador:** Múltiples errores 403 en solicitudes de ejercicio de Derechos ARCO / Olvido o intentos no autorizados sobre registros de estudiantes.

#### Protocolo de Acción
1. Bloquear preventivamente el token/cuenta involucrada desde la consola de administración.
2. Extraer los registros del `AuditLog` filtrados por la IP y `userId` sospechoso.
3. Evaluar si existió alguna exfiltración de datos no autorizada.
4. Notificar a la DPO (Data Protection Officer) de Aurenis en caso de brecha confirmada dentro del plazo legal de 48 horas.

---

## 3. Matriz de Contactos de Emergencia

| Rol | Nombre | Contacto / PagerDuty |
|---|---|---|
| Lider de Seguridad | Frank M. | PagerDuty Escalación L1 |
| Lider de Infraestructura | Malcom Marcelo | PagerDuty Escalación L1 |
| Backend & Data Officer | Lucas P. / Maicol R. | Guardia On-Call |
| Asesor Legal DPO | Carlos M. | `dpo@aurenis.cl` |
