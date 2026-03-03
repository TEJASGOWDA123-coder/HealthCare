$loginUrl = "http://localhost:8080/auth/login"
$body = @{
    email = "admin@hospitalA.com"
    password = "admin123"
} | ConvertTo-Json

Write-Host "Logging in..."
$response = Invoke-RestMethod -Uri $loginUrl -Method Post -Body $body -ContentType "application/json"
$token = $response.token

Write-Host "Token received. Submitting admission..."

$admissionUrl = "http://localhost:8080/api/v1/admissions"
$admissionBody = @{
    patientId = 1
    patientName = "Live Test Patient"
    admissionDate = "2026-03-03"
    roomNumber = "302-B"
    doctorInCharge = "Dr. Coder"
    medicalHistory = '{"note": "Created via terminal test"}'
} | ConvertTo-Json

$headers = @{
    Authorization = "Bearer $token"
}

try {
    $admissionResponse = Invoke-RestMethod -Uri $admissionUrl -Method Post -Body $admissionBody -ContentType "application/json" -Headers $headers
    $admissionResponse | ConvertTo-Json
    Write-Host "✅ Success! Saved ID: $($admissionResponse.id)"
} catch {
    Write-Host "❌ Failed!"
    Write-Host $_.Exception.Message
    $_.ErrorDetails.Message
}
