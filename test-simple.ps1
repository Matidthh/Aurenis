# Script simplificado de prueba - solo login y GET students
Write-Output "Iniciando pruebas básicas..."

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
    
    # 3. Probar GET /api/students con búsqueda
    Write-Output "`n3. Probando GET /api/students con búsqueda..."
    $searchResponse = Invoke-RestMethod -Uri 'http://localhost:3000/api/students?page=1&limit=10&search=test' -Method GET -WebSession $session
    Write-Output "✅ GET /api/students con búsqueda exitoso"
    Write-Output "Resultados: $($searchResponse.data.Count)"
    
    Write-Output "`n✅ Pruebas básicas completadas exitosamente"
    
} catch {
    Write-Output "❌ Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        Write-Output "Status: $($_.Exception.Response.StatusCode.value__)"
    }
}