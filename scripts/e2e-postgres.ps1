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
  $state = docker inspect --format '{{.State.Running}}' $containerName 2>$null
  return $LASTEXITCODE -eq 0 -and $state -eq 'true'
}

function Start-DisposablePostgres {
  docker info *> $null
  if ($LASTEXITCODE -ne 0) { throw 'Docker daemon chưa sẵn sàng.' }

  if (Test-ContainerRunning) {
    Write-Host "PostgreSQL E2E đang chạy ở cổng $port."
    return
  }

  $exists = docker container inspect $containerName 2>$null
  if ($LASTEXITCODE -eq 0) {
    throw "Container $containerName đang tồn tại nhưng không chạy. Hãy chạy '.\\scripts\\e2e-postgres.ps1 stop' rồi thử lại."
  }

  docker run --detach --rm --name $containerName --publish "127.0.0.1:${port}:5432" `
    --env POSTGRES_DB=dhcb_e2e --env POSTGRES_USER=dhcb_e2e --env POSTGRES_PASSWORD=dhcb_e2e `
    postgres:16-alpine
  if ($LASTEXITCODE -ne 0) { throw 'Không khởi động được PostgreSQL E2E.' }

  for ($attempt = 1; $attempt -le 30; $attempt++) {
    docker exec $containerName pg_isready --username dhcb_e2e --dbname dhcb_e2e *> $null
    if ($LASTEXITCODE -eq 0) { return }
    Start-Sleep -Seconds 1
  }
  throw 'PostgreSQL E2E không sẵn sàng sau 30 giây.'
}

if ($Action -eq 'stop') {
  if (Test-ContainerRunning) {
    docker stop $containerName *> $null
    if ($LASTEXITCODE -ne 0) { throw 'Không dừng được PostgreSQL E2E.' }
    Write-Host 'Đã dừng PostgreSQL E2E disposable (dữ liệu thử nghiệm đã bị xoá).'
  } else {
    Write-Host 'PostgreSQL E2E không chạy.'
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
