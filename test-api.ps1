# Script simplificado de prueba para endpoints de estudiantes
Write-Output "Iniciando pruebas de API..."

try {
    # 1. Login
    Write-Output "`n1. Probando POST /api/auth/login..."
    $loginBody = @{
        email = "admin@aurenis.com"
        password = "AurenisSuperAdmin2026!"
    } | ConvertTo-Json

    $loginWebRequest = Invoke-WebRequest -Uri 'http://localhost:3000/api/auth/login' -Method POST -ContentType 'application/json' -Body $loginBody -SessionVariable session
    $loginResponse = $loginWebRequest.Content | ConvertFrom-Json
    Write-Output "✅ Login exitoso"
    Write-Output "Usuario: $($loginResponse.user.name)"
    Write-Output "Redirect: $($loginResponse.redirectUrl)"
    
    # 2. GET /api/students
    Write-Output "`n2. Probando GET /api/students..."
    $studentsResponse = Invoke-RestMethod -Uri 'http://localhost:3000/api/students?page=1&limit=10' -Method GET -WebSession $session
    Write-Output "✅ GET /api/students exitoso"
    Write-Output "Total: $($studentsResponse.pagination.total)"
    Write-Output "Estudiantes: $($studentsResponse.data.Count)"
    
    # 3. Obtener colegios y cursos para pruebas
    Write-Output "`n3. Obteniendo datos para pruebas..."
    $schoolsResponse = Invoke-RestMethod -Uri 'http://localhost:3000/api/system/schools' -Method GET -WebSession $session
    Write-Output "Colegios encontrados: $($schoolsResponse.schools.Count)"
    
    if ($schoolsResponse.schools.Count -gt 0) {
        $schoolId = $schoolsResponse.schools[0].id
        $schoolSlug = $schoolsResponse.schools[0].slug
        Write-Output "Usando schoolId: $schoolId, slug: $schoolSlug"
        
        # Obtener cursos
        $coursesResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/$schoolSlug/courses?year=2026" -Method GET -WebSession $session
        Write-Output "Cursos encontrados: $($coursesResponse.courses.Count)"
        
        if ($coursesResponse.courses.Count -gt 0) {
            $courseId = $coursesResponse.courses[0].id
            Write-Output "Usando courseId: $courseId"
            
            # 4. POST /api/students
            Write-Output "`n4. Probando POST /api/students..."
            $studentBody = @{
                email = "test.student$(Get-Random).@example.com"
                password = "Test123456"
                firstName = "Test"
                lastName = "Student"
                schoolId = $schoolId
                courseId = $courseId
                year = 2026
            } | ConvertTo-Json
            
            try {
                $createResponse = Invoke-RestMethod -Uri 'http://localhost:3000/api/students' -Method POST -ContentType 'application/json' -Body $studentBody -WebSession $session
                Write-Output "✅ POST /api/students exitoso"
                Write-Output "Estudiante creado: $($createResponse.data.user.email)"
                
                # 5. PUT /api/students/:id
                Write-Output "`n5. Probando PUT /api/students/:id..."
                $studentId = $createResponse.data.studentProfile.id
                $updateBody = @{
                    firstName = "Test Updated"
                    lastName = "Student Updated"
                } | ConvertTo-Json
                
                $updateResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/students/$studentId" -Method PUT -ContentType 'application/json' -Body $updateBody -WebSession $session
                Write-Output "✅ PUT /api/students/:id exitoso"
                
                # 6. DELETE /api/students/:id
                Write-Output "`n6. Probando DELETE /api/students/:id..."
                $deleteResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/students/$studentId" -Method DELETE -ContentType 'application/json' -WebSession $session
                Write-Output "✅ DELETE /api/students/:id exitoso"
                
            } catch {
                Write-Output "❌ Error en operaciones CRUD: $($_.Exception.Message)"
            }
        } else {
            Write-Output "⚠️  No hay cursos disponibles para crear estudiantes"
        }
    } else {
        Write-Output "⚠️  No hay colegios disponibles"
    }
    
    Write-Output "`n✅ Pruebas completadas"
    
} catch {
    Write-Output "❌ Error general: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        Write-Output "Status: $($_.Exception.Response.StatusCode.value__)"
    }
}