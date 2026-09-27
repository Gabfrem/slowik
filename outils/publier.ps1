# Slowik - publie les modifications sur GitHub (le site se met a jour en 1 a 2 minutes).
Set-Location (Split-Path $PSScriptRoot -Parent)
git add -A
if (-not (git status --porcelain)) { Write-Host 'Rien a publier.'; exit 0 }
$msg = Read-Host 'Description de la mise a jour (Entree = "Mise a jour")'
if (-not $msg) { $msg = 'Mise a jour' }
git commit -m $msg
git push
Write-Host 'Publie ! Le site sera a jour sur https://gabfrem.github.io/slowik/ dans 1 a 2 minutes.'
