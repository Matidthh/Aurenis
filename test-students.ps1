$headers = @{'Content-Type'='application/json'}
$body = '{"email":"admin@aurenis.com","password":"AurenisSuperAdmin2026!"}'

try {
    $response = Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/login' -Method POST -Headers $headers -Body $body
    Write-Output "Login exitoso:"
    Write-Output ($response | ConvertTo-Json)
    
    # Guardar la cookie de sesión
    $sessionCookie = $response.Headers['Set-Cookie']
    Write-Output "Cookie obtenida"
    
    # Probar GET /api/students
    $headers2 = @{'Content-Type'='application/json'; 'Cookie'=$sessionCookie}
    $studentsResponse = Invoke-RestMethod -Uri 'http://localhost:3000/api/students' -Method GET -Headers $headers2
    Write-Output "GET /api/students:"
    Write-Output ($studentsResponse | ConvertTo-Json)
    
} catch {
    Write-Output "Error: $($_.Exception.Message)"
    Write-Output "Status: $($_.Exception.Response.StatusCode.value__)"
}