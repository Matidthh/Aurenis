import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Endpoint de Diagnóstico y Pruebas de Provocación de Errores en Base de Datos PostgreSQL
 * Responsable de autoría: Malcom Marcelo (Arquitectura Backend & Manejo de Excepciones DB) & Lucas P. (Contratos API)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const scenario = body.scenario || "unique_violation";
    const customMessage = body.customMessage;

    // Simulación de latencia real de round-trip de base de datos
    await new Promise((resolve) => setTimeout(resolve, 350));

    switch (scenario) {
      case "unique_violation":
        return NextResponse.json(
          {
            error:
              customMessage ||
              "Violación de restricción de unicidad: El RUT o correo institucional ya se encuentra registrado en PostgreSQL.",
            code: "P2002",
            pgCode: "23505",
            status: 409,
            table: "Student",
            constraint: "Student_rut_key",
            details: {
              target: ["rut"],
              fieldErrors: {
                rut: ["Este RUT ya existe en el padrón escolar de la base de datos."],
              },
              formErrors: [
                "No se pudo guardar el registro debido a duplicidad de datos únicos.",
              ],
            },
            timestamp: new Date().toISOString(),
          },
          { status: 409 }
        );

      case "foreign_key_violation":
        return NextResponse.json(
          {
            error:
              customMessage ||
              "Violación de integridad referencial: La asignatura o curso indicado no existe o fue dado de baja en PostgreSQL.",
            code: "P2003",
            pgCode: "23503",
            status: 422,
            table: "SubjectEnrollment",
            field: "courseId",
            details: {
              fieldErrors: {
                courseId: [
                  "El identificador del curso no corresponde a ningún registro activo.",
                ],
              },
              formErrors: [
                "Error de coherencia relacional: La referencia foránea no es válida.",
              ],
            },
            timestamp: new Date().toISOString(),
          },
          { status: 422 }
        );

      case "connection_timeout":
        return NextResponse.json(
          {
            error:
              customMessage ||
              "Tiempo de espera agotado al conectar con el servidor PostgreSQL (Connection Pool Timeout).",
            code: "P1001",
            pgCode: "08006",
            status: 503,
            details: {
              formErrors: [
                "El servidor de base de datos demoró más de 5000ms en responder. Por favor intente nuevamente.",
              ],
            },
            timestamp: new Date().toISOString(),
          },
          { status: 503 }
        );

      case "deadlock_detected":
        return NextResponse.json(
          {
            error:
              customMessage ||
              "Transacción abortada: Conflicto de bloqueo concurrente detectado en PostgreSQL (Deadlock / 40P01).",
            code: "P2034",
            pgCode: "40P01",
            status: 409,
            details: {
              formErrors: [
                "Otra transacción estaba modificando simultáneamente los mismos registros. Se canceló la operación para preservar la integridad.",
              ],
            },
            timestamp: new Date().toISOString(),
          },
          { status: 409 }
        );

      case "unhandled_db_crash":
      default:
        return NextResponse.json(
          {
            error:
              customMessage ||
              "Falla crítica no controlada en el motor de base de datos PostgreSQL. Error de ejecución SQL 500.",
            code: "INTERNAL_SERVER_ERROR",
            pgCode: "XX000",
            status: 500,
            details: {
              formErrors: [
                "Ocurrió un error inesperado al ejecutar la sentencia transaccional. La operación fue revertida (ROLLBACK).",
              ],
            },
            timestamp: new Date().toISOString(),
          },
          { status: 500 }
        );
    }
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "Excepción no controlada en el manejador del servidor: " + (err.message || String(err)),
        code: "SERVER_HANDLER_CRASH",
        status: 500,
      },
      { status: 500 }
    );
  }
}
