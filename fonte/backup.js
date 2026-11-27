// Gera BACKUP-SIMULADOR-v3.md a partir do index.html e das falas gravadas
const fs = require('fs'), path = require('path');
const D = process.argv[2];
const h = fs.readFileSync(path.join(D, 'index.html'), 'utf8');
const pega = (nome, abre, fecha) => {
  const i = h.indexOf('const ' + nome + '='); let j = h.indexOf(abre, i), n = 0, k = j;
  for (; k < h.length; k++) { if (h[k] === abre) n++; else if (h[k] === fecha) { n--; if (!n) break; } }
  return Function('return ' + h.slice(j, k + 1))();
};
const PERG = pega('PERGUNTAS', '[', ']'), GRAOS = pega('GRAOS', '{', '}'), TOL = pega('TOL', '{', '}');
const FALAS = JSON.parse(fs.readFileSync(path.join(D, 'fonte', 'falas.json'), 'utf8'));
const L = []; const p = s => L.push(s);
const tab = (cab, linhas) => { p('| ' + cab.join(' | ') + ' |'); p('|' + cab.map(() => '---').join('|') + '|'); linhas.forEach(r => p('| ' + r.join(' | ') + ' |')); p(''); };

p('# Simulador de Umidade Motomco · backup da versão 3'); p('');
p('Backup em texto de tudo o que foi gerado para a v3 do site simuladordeumidade.netlify.app: estrutura, cálculos, valores padrão, roteiro das cenas, narração gravada, perguntas da prova, fotos e como reconstruir.'); p('');
p('Gerado em 27/11/2026. Pasta do projeto: `testes/simulador-umidade-v2/`.'); p('');

p('## 1. Arquivos'); p('');
tab(['Arquivo ou pasta', 'O que é'], [
  ['`publicar/`', 'Pasta pronta para arrastar no Netlify (index.html, manifest, sw.js, ícones, fotos/, voz/). 6 MB.'],
  ['`index.html`', 'O simulador completo, em página única (1,1 MB).'],
  ['`original.html`', 'Cópia exata do site que estava no ar antes da v3, para voltar atrás.'],
  ['`fotos/`', '12 fotos JPG das cenas e dos cartões (geradas por IA, 1376×768).'],
  ['`fotos-ia/`', 'As mesmas fotos em PNG original e JPG.'],
  ['`voz/`', '46 falas MP3 da narração (voz Tiago Macedo, 64 kbps mono).'],
  ['`amostras-voz/`', 'As 3 amostras usadas para escolher o narrador.'],
  ['`manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png`', 'App instalável (PWA): nome, ícone e funcionamento sem internet.'],
  ['`ARTE-E-NARRACAO-v3.md`', 'Diagnóstico visual e roteiro de narração com números.'],
  ['`fonte/`', 'Scripts que montam o index.html a partir do original, servidor de teste e este gerador de backup.']]);

p('## 2. Tela inicial'); p('');
p('- Título: **Simulador de umidade e quebra técnica**, com foto da unidade armazenadora ao fundo.');
p('- Aviso: "Uma safra inteira de trabalho merece um recebimento transparente. O fator comercial deve seguir a tabela da unidade ou do contrato." Nota: "Imagens ilustrativas geradas por IA."'); p('');
tab(['Cartão', 'Etiqueta', 'Foto', 'Texto do cartão'], [
  ['Entrega', 'Produtor', '01-colheita', 'Da lavoura até a balança: quanto o produtor perde entregando úmido e quanto ganha com 2 pontos a menos.'],
  ['Recebimento', 'Cooperativa', '04-calador', 'Calador, leitura no MUG e a diferença que um desvio gera em 30 ou 40 cargas por dia.'],
  ['Quebra técnica', 'Expedição', '10-expedicao', 'Grão que saiu do silo abaixo de 14%: quantas sacas a mais fecham o peso do caminhão.'],
  ['Romaneio', 'Classificação', '06-classificacao', 'Classificação completa da carga: impureza, umidade e avariados em sequência, até o peso líquido e o valor a receber.'],
  ['Para onde foi o peso?', 'Balanço de massa', '09-armazem', 'Balanço de massa da entrada à expedição: limpeza, secagem e armazenagem. A diferença está dentro do esperado?'],
  ['Especialista', 'Prova', 'avatar', 'Prova de 20 perguntas sobre classificação, umidade e quebra técnica, com certificado ao final.']]);

p('## 3. Grãos, padrões e preços de referência'); p('');
tab(['Grão', 'Umidade padrão', 'Norma citada', 'Impureza tolerada', 'Avariados tolerados', 'Preços cadastrados (R$/sc 60 kg)'],
  Object.entries(GRAOS).map(([k, g]) => [g.nome, String(g.ref).replace('.', ',') + '%', g.norma, TOL[k] ? TOL[k].imp + '%' : '-', TOL[k] ? TOL[k].ava + '%' : '-',
    Object.values(g.precos || {}).map(x => x.v.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + ' (' + x.f + ')').join('; ') || 'sem cotação']));
p('Tolerâncias de impureza e avariados são referências comerciais comuns, não norma. Conferir o tipo e a tabela do contrato.'); p('');

p('## 4. Cálculos'); p('');
p('### Desconto de umidade (Configurações)'); p('');
p('- **Fator por ponto** (padrão): `desconto % = (U medida − U padrão) × fator`. Fator padrão: 1,5% por ponto.');
p('- **Água + quebra**: `desconto % = (U medida − U padrão) × 100 ÷ (100 − U padrão) + quebra técnica`. Quebra padrão: 0,5%.');
p('- Exemplo do vídeo: 30.000 kg a 16%, referência 14% → correção física `30.000 × 2 ÷ 86 = 697,67 kg`; peso corrigido 29.302,33 kg.'); p('');
p('### Entrega'); p('');
p('- Desconto em kg = peso × desconto %; sacas = kg ÷ 60; reais = sacas × preço.');
p('- Dica: a mesma carga com 2 pontos a menos (limitado ao padrão); ganho por carga e na safra.'); p('');
p('### Recebimento (desvio do MUG)'); p('');
p('- Diferença por carga = peso × (desconto pela leitura − desconto pela umidade real).');
p('- Na safra = diferença × cargas por dia × dias. Comparação para desvios de 0,5; 1,0; 1,5 ponto e o valor digitado.'); p('');
p('### Quebra técnica'); p('');
p('- Quebra % = (Ui − Uf) × 100 ÷ (100 − Uf). Fator por ponto = 100 ÷ (100 − Uf).');
p('- Estoque usado para fechar o caminhão = P × (100 − Uf) ÷ (100 − Ui). Tolerância = meses × % ao mês.');
p('- Tabela de supersecagem ponto a ponto, de 13,5% a 11%.'); p('');
p('### Romaneio (ordem dos descontos)'); p('');
p('1. Peso da carga = peso bruto − tara.');
p('2. Impureza: `(I − I tolerada) × 100 ÷ (100 − I tolerada)`, sobre o peso da carga.');
p('3. Umidade: pelo modelo escolhido, sobre o peso que sobrou.');
p('4. Avariados: pontos acima da tolerância, sobre o que sobrou.');
p('5. Valor = peso líquido ÷ 60 × preço − taxa de secagem (R$/t, se houver).'); p('');
p('Exemplo padrão: bruto 45.000 kg, tara 15.000 kg, umidade 16%, impureza 1,8%, avariados 8,5% → líquido 28.721 kg (fator 1,5).'); p('');
p('### Balanço de massa'); p('');
p('- Limpeza = peso recebido × impureza retirada %.');
p('- Água = peso após limpeza × (1 − (100 − Ui) ÷ (100 − Uf)).');
p('- Quebra operacional aceita = peso após secagem × meses × % ao mês.');
p('- Esperado = recebido − limpeza − água − operação. Diferença = expedido − esperado; até ±0,1% conta como dentro do controle.');
p('- Exemplo padrão: 1.000 t a 16%, limpeza 1,2%, saída 13,5%, 4 meses × 0,1%, expedido 945 t → esperado 955,61 t, faltam 10.607 kg.'); p('');

p('## 5. Cenas e narração gravada'); p('');
p('Cada cartão mostra etapas numeradas com uma foto, o visor da balança, a tela do medidor Motomco e a etiqueta do resultado. A voz gravada fala sem números; a legenda mostra a fala e, abaixo, a frase com os números da simulação.'); p('');
const variante = { pr4a: 'acima do padrão', pr4b: 'no padrão', pr5a: 'com desconto', pr5b: 'sem desconto', pr6a: 'no padrão', pr6b: 'desconto pequeno', pr6c: 'desconto médio', pr6d: 'desconto alto', un4a: 'MUG lê abaixo', un4b: 'MUG lê acima', un4c: 'desvio sem efeito', un5a: 'com diferença', un5b: 'sem diferença', ex1a: 'com supersecagem', ex1b: 'sem supersecagem', ex3a: 'com quebra', ex3b: 'sem quebra', ex4a: 'com quebra', ex4b: 'sem quebra', ex5a: 'acima da tolerância', ex5b: 'dentro da tolerância', ba5a: 'balanço fecha', ba5b: 'falta peso' };
const cenas = [
  ['Entrega', [['Colheita', '01-colheita', ['pr0']], ['Umidade desconhecida', '11-produtor', ['pr1']], ['Transporte', '02-estrada', ['pr2']], ['Pesagem', '03-balanca', ['pr3']], ['Medição da umidade', '05-medidor', ['pr4a', 'pr4b']], ['Desconto', '07-romaneio', ['pr5a', 'pr5b']], ['Resultado', '11-produtor', ['pr6a', 'pr6b', 'pr6c', 'pr6d']]]],
  ['Recebimento', [['Chegada da carga', '02-estrada', ['un0']], ['Pesagem', '03-balanca', ['un1']], ['Amostragem', '04-calador', ['un2']], ['Leitura do medidor', '05-medidor', ['un3']], ['Diferença no desconto', '07-romaneio', ['un4a', 'un4b', 'un4c']], ['Na safra', '12-unidade', ['un5a', 'un5b']], ['Solução', '05-medidor', ['un6']]]],
  ['Quebra técnica', [['Carregamento', '10-expedicao', ['ex0']], ['Armazenagem', '09-armazem', ['ex1a', 'ex1b']], ['Pesagem', '03-balanca', ['ex2']], ['Medição', '05-medidor', ['ex3a', 'ex3b']], ['Sacas a mais', '10-expedicao', ['ex4a', 'ex4b']], ['No período (só com quebra)', '12-unidade', ['ex5a', 'ex5b']], ['Controle', '08-secador', ['ex6']]]],
  ['Romaneio', [['Entrega da produção', '01-colheita', ['ro0']], ['Pesagem', '03-balanca', ['ro1']], ['Amostragem', '04-calador', ['ro2']], ['Medição da umidade', '05-medidor', ['ro3']], ['Classificação e descontos', '06-classificacao', ['ro4']], ['Resultado', '07-romaneio', ['ro5']]]],
  ['Para onde foi o peso?', [['A chegada', '03-balanca', ['ba0']], ['A umidade', '05-medidor', ['ba1']], ['A secagem', '08-secador', ['ba2']], ['A armazenagem', '09-armazem', ['ba3']], ['A expedição', '10-expedicao', ['ba4']], ['O controle', '12-unidade', ['ba5a', 'ba5b']]]]];
for (const [nome, etapas] of cenas) {
  p('### ' + nome); p('');
  const linhas = [];
  etapas.forEach((e, i) => e[2].forEach((c, j) => linhas.push([j ? '' : i + 1, j ? '' : e[0], j ? '' : e[1], 'voz/' + c + '.mp3' + (variante[c] ? ' (' + variante[c] + ')' : ''), FALAS[c]])));
  tab(['#', 'Etapa', 'Foto', 'Arquivo de voz', 'Fala gravada'], linhas);
}
p('Narrador: Tiago Macedo, 46 falas. Fechamento dos roteiros: "Uma safra inteira de trabalho merece um recebimento transparente. Medir, classificar e calcular corretamente faz toda a diferença."'); p('');

p('## 6. Fotos geradas por IA'); p('');
tab(['Arquivo', 'Descrição pedida ao gerador'], [
  ['01-colheita', 'Colheitadeira descarregando soja num caminhão graneleiro na lavoura, fim de tarde, céu limpo.'],
  ['02-estrada', 'Caminhão graneleiro carregado em estrada de terra vermelha rumo a uma unidade com silos ao fundo.'],
  ['03-balanca', 'Caminhão carregado na balança rodoviária de uma cooperativa, silos e secador ao fundo, vista lateral.'],
  ['04-calador', 'Calador pneumático baixando a sonda na soja dentro da carroceria, no recebimento.'],
  ['05-medidor', 'Técnica despejando amostra de soja num medidor de umidade de bancada com tela em branco, em laboratório.'],
  ['06-classificacao', 'Mesa de classificação com peneiras e bandejas separando soja limpa, impurezas e grãos avariados.'],
  ['07-romaneio', 'Produtor no balcão da cooperativa conferindo o ticket de pesagem com uma atendente.'],
  ['08-secador', 'Torre de secador de grãos com elevadores e vapor subindo, céu azul.'],
  ['09-armazem', 'Interior de armazém graneleiro com grande monte de soja e luz entrando pelas aberturas.'],
  ['10-expedicao', 'Soja caindo do bico do silo numa carreta graneleira aberta, silos atrás.'],
  ['11-produtor', 'Produtor agachado na lavoura de soja madura, vagem aberta na mão, colheitadeira ao fundo.'],
  ['12-unidade', 'Vista panorâmica de uma cooperativa ao amanhecer, silos, secador, fila de caminhões e lavoura.']]);
p('Modelo: Google Nano Banana 2.1, 16:9, 1k. As imagens não mostram marcas nem clientes reais.'); p('');

p('## 7. Prova do especialista (' + PERG.length + ' perguntas)'); p('');
p('São sorteadas 20 por tentativa, proporcionalmente por tema. Nota mínima: 70% (14 acertos) para o certificado.');
let tema = '';
PERG.forEach((q, i) => {
  if (q.t !== tema) { tema = q.t; p(''); p('### ' + tema); p(''); }
  p((i + 1) + '. **' + q.p + '**'); p('   - Certa: ' + q.ok); p('   - Erradas: ' + q.er.join(' · ')); p('   - Explicação: ' + q.ex);
});
p('');

p('## 8. Como publicar ou reconstruir'); p('');
p('- **Publicar:** arrastar a pasta `publicar/` inteira em Deploys do site simuladordeumidade no Netlify.');
p('- **Voltar à versão anterior:** publicar o `original.html` renomeado para `index.html`.');
p('- **Remontar o index.html:** copiar os arquivos de `fonte/` para uma pasta de trabalho e rodar `node aplicar.js patch.txt <pasta do projeto>` (precisa de `original.html`, `fotos-ia/` e `voz/`). O script aplica os blocos do `patch.txt`, troca a animação pelo `animar.js`, insere as falas do `falas.json` e gera manifest, sw.js e ícones.');
p('- **Testar localmente:** `node fonte/servidor.js . 8090` e abrir http://localhost:8090.');
p('- **Atualizar este backup:** `node fonte/backup.js .`');
p('- **Magnific:** bloqueado nas configurações do Claude Code a pedido do usuário em 27/11/2026. Fotos ou falas novas devem vir de arquivos próprios.');

fs.writeFileSync(path.join(D, 'BACKUP-SIMULADOR-v3.md'), L.join('\n') + '\n');
console.log('ok:', L.length, 'linhas,', PERG.length, 'perguntas,', Object.keys(FALAS).length, 'falas');
