# Simulador de Umidade Motomco

Simulador interativo de desconto de umidade, romaneio, balanço de massa, desvio do medidor de umidade (MUG) e quebra técnica, com prova e certificado. Versão 3, com fotos, etapas numeradas e narração gravada.

Site no ar: https://simuladordeumidade.netlify.app/

## Pastas

| Pasta ou arquivo | O que é |
|---|---|
| `publicar/` | Site pronto para publicar (Netlify ou GitHub Pages): `index.html`, fotos, voz, ícones e arquivos do app instalável. |
| `fonte/` | Scripts que montam o `index.html` a partir de `original.html`, servidor de teste e gerador do backup. |
| `BACKUP-SIMULADOR-v3.md` | Documentação completa: cálculos, valores padrão, roteiro das cenas, falas gravadas e as 69 perguntas da prova. |
| `ARTE-E-NARRACAO-v3.md` | Diagnóstico visual e roteiro de narração. |
| `original.html` | Versão anterior do site, guardada para voltar atrás. |

## Testar no computador

```
node fonte/servidor.js publicar 8090
```

Depois abra http://localhost:8090.

## Observações

- As fotos das cenas são ilustrativas e foram geradas por IA, exceto a do medidor Motomco 999 ES1.
- O fator comercial de desconto deve seguir a tabela da unidade ou do contrato.

Eng. Agrônomo Roney Smolareck · Motomco
