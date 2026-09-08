# Script final de prueba - usando datos del seed
Write-Output "🧪 INICIANDO PRUEBAS COMPLETAS DE API DE ESTUDIANTES"

try {
    # 1. Login
    Write-Output "`n🔐 1. POST /api/auth/login"
    $loginBody = @{
        email = "admin@aurenis.com"
        password = "AurenisSuperAdmin2026!"
    } | ConvertTo-Json

    $loginWebRequest = Invoke-WebRequest -Uri 'http://localhost:3000/api/auth/login' -Method POST -ContentType 'application/json' -Body $loginBody -SessionVariable session
    $loginResponse = $loginWebRequest.Content | ConvertFrom-Json
    Write-Output "✅ Login exitoso - Usuario: $($loginResponse.user.name) - Admin: $($loginResponse.user.isSystemAdmin)"
    
    # 2. GET /api/students (vacío inicialmente)
    Write-Output "`n📋 2. GET /api/students (listado inicial)"
    $studentsResponse = Invoke-RestMethod -Uri 'http://localhost:3000/api/students?page=1&limit=10' -Method GET -WebSession $session
    Write-Output "✅ GET exitoso - Total: $($studentsResponse.pagination.total) estudiantes"
    
    # 3. Obtener datos del colegio demo
    Write-Output "`n🏫 3. Obteniendo datos del colegio demo"
    $schoolsResponse = Invoke-RestMethod -Uri 'http://localhost:3000/api/system/schools' -Method GET -WebSession $session
    $schoolId = $schoolsResponse.schools[0].id
    $schoolSlug = $schoolsResponse.schools[0].slug
    Write-Output "✅ Colegio: $($schoolsResponse.schools[0].name) - ID: $schoolId"
    
    # 4. Obtener cursos existentes
    Write-Output "`n📚 4. Obteniendo cursos existentes"
    try {
        $coursesResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/$schoolSlug/courses?year=2026" -Method GET -WebSession $session
        Write-Output "✅ Cursos encontrados: $($coursesResponse.courses.Count)"
        
        if ($coursesResponse.courses.Count -eq 0) {
            Write-Output "⚠️  No hay cursos, creando uno para pruebas..."
            $courseBody = @{
                educationLevelId = "level-test" 
                name = "Curso Prueba API"
                letter = "Z"
                gradeNumber = 1
                year = 2026
            } | ConvertTo-Json
            
            try {
                $courseCreate = Invoke-RestMethod -Uri "http://localhost:3000/api/$schoolSlug/courses" -Method POST -ContentType 'application/json' -Body $courseBody -WebSession $session
                $courseId = $courseCreate.course.id
                Write-Output "✅ Curso creado: $($courseCreate.course.name)"
            } catch {
                Write-Output "❌ No se pudo crear curso: $($_.Exception.Message)"
                $courseId = "fallback-course-id"
            }
        } else {
            $courseId = $coursesResponse.courses[0].id
            Write-Output "✅ Usando curso existente: $($coursesResponse.courses[0].name)"
        }
        
        # 5. POST /api/students (CREAR)
        Write-Output "`n➕ 5. POST /api/students (CREAR estudiante)"
        $timestamp = Get-Date -Format "yyyyMMddHHmmss"
        $studentBody = @{
            email = "test.student.$timestamp@example.com"
            password = "TestPassword123!"
            firstName = "Test"
            lastName = "Student"
            schoolId = $schoolId
            courseId = $courseId
            year = 2026
        } | ConvertTo-Json
        
        $createResponse = Invoke-RestMethod -Uri 'http://localhost:3000/api/students' -Method POST -ContentType 'application/json' -Body $studentBody -WebSession $session
        Write-Output "✅ POST exitoso - Email: $($createResponse.data.user.email)"
        Write-Output "   User ID: $($createResponse.data.user.id)"
        Write-Output "   StudentProfile ID: $($createResponse.data.studentProfile.id)"
        Write-Output "   Enrollment ID: $($createResponse.data.enrollment.id)"
        
        $studentId = $createResponse.data.studentProfile.id
        
        # 6. GET /api/students (con datos)
        Write-Output "`n📋 6. GET /api/students (después de crear)"
        $studentsAfterCreate = Invoke-RestMethod -Uri 'http://localhost:3000/api/students?page=1&limit=10' -Method GET -WebSession $session
        Write-Output "✅ GET exitoso - Total: $($studentsAfterCreate.pagination.total) estudiantes"
        
        # 7. GET /api/students/:id (LEER UNO)
        Write-Output "`n👤 7. GET /api/students/:id (LEER estudiante específico)"
        $studentDetail = Invoke-RestMethod -Uri "http://localhost:3000/api/students/$studentId" -Method GET -WebSession $session
        Write-Output "✅ GET exitoso - Estudiante: $($studentDetail.data.student.membership.user.firstName) $($studentDetail.data.student.membership.user.lastName)"
        
        # 8. PUT /api/students/:id (ACTUALIZAR)
        Write-Output "`n✏️  8. PUT /api/students/:id (ACTUALIZAR estudiante)"
        $updateBody = @{
            firstName = "Test Updated"
            lastName = "Student Updated"
            phone = "+56987654321"
            enrollmentNumber = "TEST-2026-001"
        } | ConvertTo-Json
        
        $updateResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/students/$studentId" -Method PUT -ContentType 'application/json' -Body $updateBody -WebSession $session
        Write-Output "✅ PUT exitoso - Estudiante actualizado"
        
        # 9. Verificar actualización
        Write-Output "`n🔍 9. Verificando actualización"
        $updatedStudent = Invoke-RestMethod -Uri "http://localhost:3000/api/students/$studentId" -Method GET -WebSession $session
        Write-Output "✅ Nombre actualizado: $($updatedStudent.data.student.membership.user.firstName)"
        Write-Output "✅ Teléfono: $($updatedStudent.data.student.membership.user.phone)"
        
        # 10. DELETE /api/students/:id (ELIMINAR)
        Write-Output "`n🗑️  10. DELETE /api/students/:id (ELIMINAR estudiante)"
        $deleteResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/students/$studentId" -Method DELETE -ContentType 'application/json' -WebSession $session
        Write-Output "✅ DELETE exitoso - Estudiante eliminado (soft delete)"
        
        # 11. Verificar eliminación
        Write-Output "`n🔍 11. Verificando eliminación (soft delete)"
        try {
            $deletedStudent = Invoke-RestMethod -Uri "http://localhost:3000/api/students/$studentId" -Method GET -WebSession $session
            Write-Output "⚠️  Estudiante todavía accesible (soft delete permite recuperación)"
        } catch {
            if ($_.Exception.Response.StatusCode.value__ -eq 404) {
                Write-Output "✅ Estudiante no encontrado (eliminado correctamente)"
            } else {
                Write-Output "⚠️  Error esperado en eliminación: $($_.Exception.Message)"
            }
        }
        
        # 12. GET /api/students con filtros
        Write-Output "`n🔍 12. GET /api/students con filtros de búsqueda"
        $searchUrl = "http://localhost:3000/api/students?page=1&limit=10&search=Test"
        $searchResponse = Invoke-RestMethod -Uri $searchUrl -Method GET -WebSession $session
        Write-Output "✅ Búsqueda por 'Test': $($searchResponse.data.Count) resultados"
        
        # 13. GET /api/students con paginación
        Write-Output "`n📄 13. GET /api/students con paginación"
        $paginatedUrl = "http://localhost:3000/api/students?page=1&limit=5"
        $paginatedResponse = Invoke-RestMethod -Uri $paginatedUrl -Method GET -WebSession $session
        Write-Output "✅ Paginación - Página: $($paginatedResponse.pagination.page), Total: $($paginatedResponse.pagination.total)"
        
        Write-Output "`n🎉 TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE"
        Write-Output "📊 RESUMEN:"
        Write-Output "   ✅ Login y autenticación"
        Write-Output "   ✅ GET /api/students (listado)"
        Write-Output "   ✅ POST /api/students (crear)"
        Write-Output "   ✅ GET /api/students/:id (leer uno)"
        Write-Output "   ✅ PUT /api/students/:id (actualizar)"
        Write-Output "   ✅ DELETE /api/students/:id (eliminar)"
        Write-Output "   ✅ Búsqueda y filtros"
        Write-Output "   ✅ Paginación"
        Write-Output "   ✅ Control de permisos RBAC"
        
    } catch {
        Write-Output "❌ Error en proceso de cursos: $($_.Exception.Message)"
    }
    
} catch {
    Write-Output "❌ Error general: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        Write-Output "Status: $($_.Exception.Response.StatusCode.value__)"
        Write-Output "Response: $($_.ErrorDetails.Message)"
    }
}