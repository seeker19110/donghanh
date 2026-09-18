[CmdletBinding()]
param(
  [ValidateSet('start', 'stop', 'test')]
  [string]$Action = 'test',
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]]$PlaywrightArgs
)

$ErrorActionPreference = 'Stop'
$containerName = 'dhcb-e2e-postgres'
$port = 55432
$databaseUrl = "postgresql://dhcb_e2e:dhcb_e2e@127.0.0.1:$port/dhcb_e2e"

function Test-ContainerRunning {
  $name = docker ps --filter "name=^/${containerName}$" --format '{{.Names}}'
  return $LASTEXITCODE -eq 0 -and $name -eq $containerName
}

function Start-DisposablePostgres {
  docker info *> $null
  if ($LASTEXITCODE -ne 0) { throw 'Docker daemon is not ready.' }

  if (Test-ContainerRunning) {
    Write-Host "E2E PostgreSQL is already running on port $port."
    return
  }

  $existingName = docker ps --all --filter "name=^/${containerName}$" --format '{{.Names}}'
  if ($LASTEXITCODE -eq 0 -and $existingName -eq $containerName) {
    throw "Container $containerName exists but is not running. Run '.\\scripts\\e2e-postgres.ps1 stop' before retrying."
  }

  docker run --detach --rm --name $containerName --publish "127.0.0.1:${port}:5432" `
    --env POSTGRES_DB=dhcb_e2e --env POSTGRES_USER=dhcb_e2e --env POSTGRES_PASSWORD=dhcb_e2e `
    postgres:16-alpine
  if ($LASTEXITCODE -ne 0) { throw 'Could not start E2E PostgreSQL.' }

  for ($attempt = 1; $attempt -le 30; $attempt++) {
    docker exec $containerName pg_isready --username dhcb_e2e --dbname dhcb_e2e *> $null
    if ($LASTEXITCODE -eq 0) { return }
    Start-Sleep -Seconds 1
  }
  throw 'E2E PostgreSQL was not ready after 30 seconds.'
}

if ($Action -eq 'stop') {
  if (Test-ContainerRunning) {
    docker stop $containerName *> $null
    if ($LASTEXITCODE -ne 0) { throw 'Could not stop E2E PostgreSQL.' }
    Write-Host 'Stopped disposable E2E PostgreSQL; its test data was removed.'
  } else {
    Write-Host 'E2E PostgreSQL is not running.'
  }
  exit 0
}

Start-DisposablePostgres
if ($Action -eq 'start') { exit 0 }

$env:DATABASE_URL = $databaseUrl
$env:MIGRATE_DATABASE_URL = $databaseUrl
$env:TTS_ENCRYPTION_MASTER_KEY = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='
$env:E2E_SERVER_MODE = 'production'

npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
npm run migrate:pg
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
npm run test:e2e -- @PlaywrightArgs
exit $LASTEXITCODE
