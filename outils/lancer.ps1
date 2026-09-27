# Slowik - lanceur : ouvre l'application dans sa propre fenetre (mode application d'Edge ou de Chrome).
# Edge et Chrome n'acceptent que de l'ASCII dans --app : le chemin (qui peut contenir des accents,
# comme "Telechargements") est donc converti en adresse file:/// encodee.

$page = Join-Path (Split-Path $PSScriptRoot -Parent) 'index.html'
$url = ([System.Uri]$page).AbsoluteUri
$options = @("--app=$url", '--window-size=1360,900')

function Find-Browser([string]$relativePath) {
  foreach ($root in @(${env:ProgramFiles(x86)}, $env:ProgramFiles, $env:LOCALAPPDATA)) {
    if (-not $root) { continue }
    $candidate = Join-Path $root $relativePath
    if (Test-Path $candidate) { return $candidate }
  }
  return $null
}

$browser = Find-Browser 'Microsoft\Edge\Application\msedge.exe'
if (-not $browser) { $browser = Find-Browser 'Google\Chrome\Application\chrome.exe' }

if ($browser) {
  Start-Process -FilePath $browser -ArgumentList $options
} else {
  Start-Process -FilePath $page
}
