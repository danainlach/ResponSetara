# PowerShell script to prepare the Namecheap cPanel Shared Hosting deployment package
# Saves output to web-app/responsetara-deploy.zip

$ErrorActionPreference = "Stop"

$workspaceRoot = "d:\ResponSetara\web-app"
$deployDir = "$workspaceRoot\tmp-deploy"
$zipFile = "$workspaceRoot\responsetara-deploy.zip"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Preparing ResponSetara Namecheap Deployment Package" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# 1. Compile assets locally
Write-Host "Step 1: Running npm run build locally..." -ForegroundColor Yellow
cd $workspaceRoot
npm.cmd run build

# 2. Cleanup previous runs
if (Test-Path $deployDir) {
    Remove-Item -Path $deployDir -Recurse -Force
}
if (Test-Path $zipFile) {
    Remove-Item -Path $zipFile -Force
}

# 3. Create target directory structure
Write-Host "Step 2: Creating temporary directory structure..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "$deployDir\responsetara-app" | Out-Null
New-Item -ItemType Directory -Force -Path "$deployDir\public_html" | Out-Null

# 4. Copy Laravel core files (excluding development junk)
Write-Host "Step 3: Copying core application files..." -ForegroundColor Yellow
$coreFolders = @("app", "bootstrap", "config", "database", "resources", "routes")
foreach ($folder in $coreFolders) {
    Copy-Item -Path "$workspaceRoot\$folder" -Destination "$deployDir\responsetara-app\$folder" -Recurse -Force
}

# Copy specific root files
Copy-Item -Path "$workspaceRoot\artisan" -Destination "$deployDir\responsetara-app\artisan" -Force
Copy-Item -Path "$workspaceRoot\composer.json" -Destination "$deployDir\responsetara-app\composer.json" -Force
Copy-Item -Path "$workspaceRoot\composer.lock" -Destination "$deployDir\responsetara-app\composer.lock" -Force

# Remove database.sqlite if it was copied
if (Test-Path "$deployDir\responsetara-app\database\database.sqlite") {
    Remove-Item -Path "$deployDir\responsetara-app\database\database.sqlite" -Force
}

# Create clean empty storage folder structure
New-Item -ItemType Directory -Force -Path "$deployDir\responsetara-app\storage\app\public" | Out-Null
New-Item -ItemType Directory -Force -Path "$deployDir\responsetara-app\storage\framework\cache" | Out-Null
New-Item -ItemType Directory -Force -Path "$deployDir\responsetara-app\storage\framework\sessions" | Out-Null
New-Item -ItemType Directory -Force -Path "$deployDir\responsetara-app\storage\framework\views" | Out-Null
New-Item -ItemType Directory -Force -Path "$deployDir\responsetara-app\storage\logs" | Out-Null

# 5. Copy public folder files
Write-Host "Step 4: Copying public web assets..." -ForegroundColor Yellow
Copy-Item -Path "$workspaceRoot\public\*" -Destination "$deployDir\public_html" -Recurse -Force

# Remove local public/hot or temp files if any
if (Test-Path "$deployDir\public_html\hot") {
    Remove-Item -Path "$deployDir\public_html\hot" -Force
}

# 6. Apply cPanel specific configuration templates
Write-Host "Step 5: Applying cPanel-specific configuration templates..." -ForegroundColor Yellow
Copy-Item -Path "$workspaceRoot\docs\cpanel-files\index.php" -Destination "$deployDir\public_html\index.php" -Force
Copy-Item -Path "$workspaceRoot\docs\cpanel-files\.htaccess" -Destination "$deployDir\public_html\.htaccess" -Force

# 7. Compress into ZIP archive
Write-Host "Step 6: Packaging deployment files into ZIP archive..." -ForegroundColor Yellow
Compress-Archive -Path "$deployDir\*" -DestinationPath $zipFile -Force

# 8. Cleanup temporary directory
Write-Host "Step 7: Cleaning up temporary directories..." -ForegroundColor Yellow
Remove-Item -Path $deployDir -Recurse -Force

Write-Host "`nDeployment package successfully created at:" -ForegroundColor Green
Write-Host "$zipFile" -ForegroundColor Green
Write-Host "Ready for upload to cPanel root (/home/CPANEL_USER/)!" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
