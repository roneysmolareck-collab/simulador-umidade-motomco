# Cria o repositório público simulador-umidade-motomco na conta logada e envia o projeto
$ErrorActionPreference = 'Stop'
$gh = 'C:\Users\comercial.roney\Videos\estudio\ferramentas\gh\bin\gh.exe'
Set-Location $PSScriptRoot

& $gh auth status
if ($LASTEXITCODE -ne 0) { Write-Host 'Faça o login do GitHub primeiro.'; exit 1 }

# identidade do commit: usuário do GitHub e e-mail noreply (não expõe o e-mail pessoal)
$login = & $gh api user --jq .login
$id = & $gh api user --jq .id
$nome = & $gh api user --jq '.name // .login'
git config user.name "$nome"
git config user.email "$id+$login@users.noreply.github.com"

& $gh auth setup-git
git add -A
git commit -q -m "Simulador de Umidade Motomco v3" -m "Fotos nas etapas, cartões Romaneio e Balanço de massa, narração gravada, app instalável e backup em Markdown." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"

& $gh repo create simulador-umidade-motomco --public --source . --remote origin --push --description "Simulador de umidade, romaneio, balanço de massa e quebra técnica - Motomco"
Write-Host ''
Write-Host "Pronto: https://github.com/$login/simulador-umidade-motomco"
