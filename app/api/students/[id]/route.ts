import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware/authorization";
import { withErrorHandler } from "@/lib/middleware/error-handler";
import { getStudentById, updateStudent, deleteStudent, StudentServiceError } from "@/lib/services/student.service";
import { UpdateStudentSchema } from "@/lib/validations/student.schema";
import { PERMISSIONS } from "@/lib/constants/permissions";

// GET /api/students/:id - Obtener un estudiante específico
export const GET = withAuth(
  withErrorHandler(async (req: NextRequest, context) => {
    const studentId = context.params?.id;
    if (!studentId) {
      return NextResponse.json({ error: "ID de estudiante requerido" }, { status: 400 });
    }

    // Verificar permiso para ver estudiantes
    if (!context.isSystemAdmin && !context.permissions.includes(PERMISSIONS.PEOPLE_STUDENTS_MANAGE)) {
      return NextResponse.json(
        { error: "No tienes permiso para ver estudiantes" },
        { status: 403 }
      );
    }

    try {
      const student = await getStudentById(studentId, context.activeSchoolId, context.isSystemAdmin);

      return NextResponse.json({
        success: true,
        data: student,
      });
    } catch (error) {
      if (error instanceof StudentServiceError) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      throw error;
    }
  })
);

// PUT /api/students/:id - Actualizar un estudiante
export const PUT = withAuth(
  withErrorHandler(async (req: NextRequest, context) => {
    const studentId = context.params?.id;
    if (!studentId) {
      return NextResponse.json({ error: "ID de estudiante requerido" }, { status: 400 });
    }

    // Verificar permiso para gestionar estudiantes
    if (!context.isSystemAdmin && !context.permissions.includes(PERMISSIONS.PEOPLE_STUDENTS_MANAGE)) {
      return NextResponse.json(
        { error: "No tienes permiso para actualizar estudiantes" },
        { status: 403 }
      );
    }

    const body = await req.json();
    
    // Validar con Zod
    const validated = UpdateStudentSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { 
          error: "Datos inválidos", 
          code: "VALIDATION_ERROR",
          details: validated.error.flatten() 
        },
        { status: 400 }
      );
    }

    try {
      const updatedStudent = await updateStudent(
        studentId, 
        validated.data, 
        context.userId,
        context.activeSchoolId
      );

      return NextResponse.json({
        success: true,
        message: "Estudiante actualizado exitosamente",
        data: updatedStudent,
      });
    } catch (error) {
      if (error instanceof StudentServiceError) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      throw error;
    }
  })
);

// DELETE /api/students/:id - Soft delete de un estudiante
export const DELETE = withAuth(
  withErrorHandler(async (req: NextRequest, context) => {
    const studentId = context.params?.id;
    if (!studentId) {
      return NextResponse.json({ error: "ID de estudiante requerido" }, { status: 400 });
    }

    // Verificar permiso para gestionar estudiantes
    if (!context.isSystemAdmin && !context.permissions.includes(PERMISSIONS.PEOPLE_STUDENTS_MANAGE)) {
      return NextResponse.json(
        { error: "No tienes permiso para eliminar estudiantes" },
        { status: 403 }
      );
    }

    try {
      const result = await deleteStudent(
        studentId, 
        context.userId,
        context.activeSchoolId
      );

      return NextResponse.json({
        success: true,
        message: "Estudiante eliminado exitosamente",
        data: result,
      });
    } catch (error) {
      if (error instanceof StudentServiceError) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      throw error;
    }
  })
);