/**
 * Servicio de Cola de Mensajes Fallidos (Dead Letter Queue - DLQ).
 * Almacena y gestiona trabajos asíncronos o webhooks que han fallado tras sus reintentos máximos,
 * permitiendo inspección, depuración y reencolado manual o automático.
 */

interface FailedJobRecord {
  id: string;
  queueName: string;
  jobName: string;
  payload: Record<string, unknown>;
  error: string;
  attempts: number;
  failedAt: number;
}

const deadLetterStorage: FailedJobRecord[] = [
  {
    id: "dlq_job_001",
    queueName: "webhooks",
    jobName: "grade.created.dispatch",
    payload: { tenantId: "sch_los_robles_demo", studentId: "std_992", grade: 5.5 },
    error: "ETIMEDOUT connecting to https://client.example.com/webhook",
    attempts: 3,
    failedAt: Date.now() - 3600000 * 4,
  },
  {
    id: "dlq_job_002",
    queueName: "reports",
    jobName: "generate_monthly_report",
    payload: { schoolId: "sch_sanjose_demo", month: "August-2026" },
    error: "Memory limit exceeded during PDF generation stream",
    attempts: 3,
    failedAt: Date.now() - 3600000 * 12,
  },
];

export class DeadLetterQueueService {
  /**
   * Envía un trabajo fallido a la DLQ
   */
  static pushToDLQ(queueName: string, jobName: string, payload: Record<string, unknown>, error: string, attempts: number) {
    const record: FailedJobRecord = {
      id: `dlq_${Math.random().toString(36).substring(2, 9)}`,
      queueName,
      jobName,
      payload,
      error,
      attempts,
      failedAt: Date.now(),
    };
    deadLetterStorage.unshift(record);
    return record.id;
  }

  /**
   * Lista todos los trabajos en la DLQ
   */
  static listFailedJobs() {
    return deadLetterStorage;
  }

  /**
   * Reencola un trabajo desde la DLQ
   */
  static retryJob(jobId: string) {
    const index = deadLetterStorage.findIndex((j) => j.id === jobId);
    if (index !== -1) {
      const [job] = deadLetterStorage.splice(index, 1);
      return { success: true, restartedJob: job };
    }
    return { success: false, error: "Trabajo no encontrado en DLQ." };
  }

  /**
   * Elimina un registro de la DLQ
   */
  static purgeJob(jobId: string) {
    const initialLen = deadLetterStorage.length;
    const filtered = deadLetterStorage.filter((j) => j.id !== jobId);
    deadLetterStorage.length = 0;
    deadLetterStorage.push(...filtered);
    return deadLetterStorage.length < initialLen;
  }
}
