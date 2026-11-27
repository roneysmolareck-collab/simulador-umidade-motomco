# Simulador de Umidade Motomco · backup da versão 3

Backup em texto de tudo o que foi gerado para a v3 do site simuladordeumidade.netlify.app: estrutura, cálculos, valores padrão, roteiro das cenas, narração gravada, perguntas da prova, fotos e como reconstruir.

Gerado em 27/11/2026. Pasta do projeto: `testes/simulador-umidade-v2/`.

## 1. Arquivos

| Arquivo ou pasta | O que é |
|---|---|
| `publicar/` | Pasta pronta para arrastar no Netlify (index.html, manifest, sw.js, ícones, fotos/, voz/). 6 MB. |
| `index.html` | O simulador completo, em página única (1,1 MB). |
| `original.html` | Cópia exata do site que estava no ar antes da v3, para voltar atrás. |
| `fotos/` | 12 fotos JPG das cenas e dos cartões (geradas por IA, 1376×768). |
| `fotos-ia/` | As mesmas fotos em PNG original e JPG. |
| `voz/` | 46 falas MP3 da narração (voz Tiago Macedo, 64 kbps mono). |
| `amostras-voz/` | As 3 amostras usadas para escolher o narrador. |
| `manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png` | App instalável (PWA): nome, ícone e funcionamento sem internet. |
| `ARTE-E-NARRACAO-v3.md` | Diagnóstico visual e roteiro de narração com números. |
| `fonte/` | Scripts que montam o index.html a partir do original, servidor de teste e este gerador de backup. |

## 2. Tela inicial

- Título: **Simulador de umidade e quebra técnica**, com foto da unidade armazenadora ao fundo.
- Aviso: "Uma safra inteira de trabalho merece um recebimento transparente. O fator comercial deve seguir a tabela da unidade ou do contrato." Nota: "Imagens ilustrativas geradas por IA."

| Cartão | Etiqueta | Foto | Texto do cartão |
|---|---|---|---|
| Entrega | Produtor | 01-colheita | Da lavoura até a balança: quanto o produtor perde entregando úmido e quanto ganha com 2 pontos a menos. |
| Recebimento | Cooperativa | 04-calador | Calador, leitura no MUG e a diferença que um desvio gera em 30 ou 40 cargas por dia. |
| Quebra técnica | Expedição | 10-expedicao | Grão que saiu do silo abaixo de 14%: quantas sacas a mais fecham o peso do caminhão. |
| Romaneio | Classificação | 06-classificacao | Classificação completa da carga: impureza, umidade e avariados em sequência, até o peso líquido e o valor a receber. |
| Para onde foi o peso? | Balanço de massa | 09-armazem | Balanço de massa da entrada à expedição: limpeza, secagem e armazenagem. A diferença está dentro do esperado? |
| Especialista | Prova | avatar | Prova de 20 perguntas sobre classificação, umidade e quebra técnica, com certificado ao final. |

## 3. Grãos, padrões e preços de referência

| Grão | Umidade padrão | Norma citada | Impureza tolerada | Avariados tolerados | Preços cadastrados (R$/sc 60 kg) |
|---|---|---|---|---|---|
| Soja | 14% | IN MAPA nº 11/2007 | 1% | 8% | 153,40 (Indicador Cepea/Esalq Paranaguá, 20/10/2026); 134,00 (Sorriso/MT, 21/10/2026) |
| Milho | 14% | IN MAPA nº 60/2011 | 1% | 6% | 64,34 (Indicador Cepea/Esalq, 20/10/2026); 45,60 (Sorriso/MT, 21/10/2026) |
| Trigo | 13% | IN MAPA nº 38/2010 | 1% | 5% | 93,80 (Cepea/Esalq Paraná, R$ 1.563,34/t, 20/10/2026) |
| Arroz em casca | 13% | IN MAPA nº 6/2009 | 1% | 4% | 98,44 (Cepea/Esalq-Senar RS, R$ 82,03/sc 50 kg, 20/10/2026) |
| Feijão | 14% | IN MAPA nº 12/2008 | 1% | 4% | sem cotação |
| Sorgo | 14% | Norma de sorgo: confirmar no MAPA | 1% | 6% | sem cotação |
| Café beneficiado | 12,5% | IN MAPA nº 8/2003 | 1% | 0% | 1.610,14 (Indicador Cepea/Esalq café arábica, 20/10/2026) |

Tolerâncias de impureza e avariados são referências comerciais comuns, não norma. Conferir o tipo e a tabela do contrato.

## 4. Cálculos

### Desconto de umidade (Configurações)

- **Fator por ponto** (padrão): `desconto % = (U medida − U padrão) × fator`. Fator padrão: 1,5% por ponto.
- **Água + quebra**: `desconto % = (U medida − U padrão) × 100 ÷ (100 − U padrão) + quebra técnica`. Quebra padrão: 0,5%.
- Exemplo do vídeo: 30.000 kg a 16%, referência 14% → correção física `30.000 × 2 ÷ 86 = 697,67 kg`; peso corrigido 29.302,33 kg.

### Entrega

- Desconto em kg = peso × desconto %; sacas = kg ÷ 60; reais = sacas × preço.
- Dica: a mesma carga com 2 pontos a menos (limitado ao padrão); ganho por carga e na safra.

### Recebimento (desvio do MUG)

- Diferença por carga = peso × (desconto pela leitura − desconto pela umidade real).
- Na safra = diferença × cargas por dia × dias. Comparação para desvios de 0,5; 1,0; 1,5 ponto e o valor digitado.

### Quebra técnica

- Quebra % = (Ui − Uf) × 100 ÷ (100 − Uf). Fator por ponto = 100 ÷ (100 − Uf).
- Estoque usado para fechar o caminhão = P × (100 − Uf) ÷ (100 − Ui). Tolerância = meses × % ao mês.
- Tabela de supersecagem ponto a ponto, de 13,5% a 11%.

### Romaneio (ordem dos descontos)

1. Peso da carga = peso bruto − tara.
2. Impureza: `(I − I tolerada) × 100 ÷ (100 − I tolerada)`, sobre o peso da carga.
3. Umidade: pelo modelo escolhido, sobre o peso que sobrou.
4. Avariados: pontos acima da tolerância, sobre o que sobrou.
5. Valor = peso líquido ÷ 60 × preço − taxa de secagem (R$/t, se houver).

Exemplo padrão: bruto 45.000 kg, tara 15.000 kg, umidade 16%, impureza 1,8%, avariados 8,5% → líquido 28.721 kg (fator 1,5).

### Balanço de massa

- Limpeza = peso recebido × impureza retirada %.
- Água = peso após limpeza × (1 − (100 − Ui) ÷ (100 − Uf)).
- Quebra operacional aceita = peso após secagem × meses × % ao mês.
- Esperado = recebido − limpeza − água − operação. Diferença = expedido − esperado; até ±0,1% conta como dentro do controle.
- Exemplo padrão: 1.000 t a 16%, limpeza 1,2%, saída 13,5%, 4 meses × 0,1%, expedido 945 t → esperado 955,61 t, faltam 10.607 kg.

## 5. Cenas e narração gravada

Cada cartão mostra etapas numeradas com uma foto, o visor da balança, a tela do medidor Motomco e a etiqueta do resultado. A voz gravada fala sem números; a legenda mostra a fala e, abaixo, a frase com os números da simulação.

### Entrega

| # | Etapa | Foto | Arquivo de voz | Fala gravada |
|---|---|---|---|---|
| 1 | Colheita | 01-colheita | voz/pr0.mp3 | Fim de colheita. A colheitadeira enche o caminhão direto da lavoura. |
| 2 | Umidade desconhecida | 11-produtor | voz/pr1.mp3 | Até aqui, ninguém sabe com quanta umidade essa carga sai do campo. E é essa informação que define quanto ela vale. |
| 3 | Transporte | 02-estrada | voz/pr2.mp3 | O caminhão segue para a unidade de recebimento. |
| 4 | Pesagem | 03-balanca | voz/pr3.mp3 | Primeiro, a balança registra o peso bruto da carga. |
| 5 | Medição da umidade | 05-medidor | voz/pr4a.mp3 (acima do padrão) | O medidor Motomco lê a amostra. A umidade está acima do padrão. |
|  |  |  | voz/pr4b.mp3 (no padrão) | O medidor Motomco lê a amostra. A umidade está dentro do padrão. |
| 6 | Desconto | 07-romaneio | voz/pr5a.mp3 (com desconto) | Pela tabela da unidade, o desconto aparece em quilos, sacas e reais, e sai direto do pagamento desta carga. |
|  |  |  | voz/pr5b.mp3 (sem desconto) | Sem desconto de umidade. O produtor recebe pelo peso cheio. |
| 7 | Resultado | 11-produtor | voz/pr6a.mp3 (no padrão) | Grão no padrão vira dinheiro sem perda na balança. Medir a umidade ainda na lavoura é o que permite escolher a hora certa de colher. |
|  |  |  | voz/pr6b.mp3 (desconto pequeno) | Desconto pequeno: quase toda a carga vira dinheiro. Medir a umidade ainda na lavoura é o que permite escolher a hora certa de colher. |
|  |  |  | voz/pr6c.mp3 (desconto médio) | Aqui o desconto já pesa. Com dois pontos a menos de umidade, a diferença aparece em cada carga e na safra. Medir ainda na lavoura é o que permite escolher a hora certa de colher. |
|  |  |  | voz/pr6d.mp3 (desconto alto) | É dinheiro indo embora em forma de água. Com dois pontos a menos de umidade, a diferença aparece em cada carga e na safra. Medir ainda na lavoura é o que permite escolher a hora certa de colher. |

### Recebimento

| # | Etapa | Foto | Arquivo de voz | Fala gravada |
|---|---|---|---|---|
| 1 | Chegada da carga | 02-estrada | voz/un0.mp3 | Na unidade, o caminhão entra na balança. |
| 2 | Pesagem | 03-balanca | voz/un1.mp3 | A balança registra o peso da carga. |
| 3 | Amostragem | 04-calador | voz/un2.mp3 | O calador pneumático retira amostras em vários pontos e profundidades. Uma amostra bem coletada representa a carga inteira. |
| 4 | Leitura do medidor | 05-medidor | voz/un3.mp3 | O medidor faz a leitura. Compare a umidade lida com a umidade real da carga: essa diferença é o desvio do medidor. |
| 5 | Diferença no desconto | 07-romaneio | voz/un4a.mp3 (MUG lê abaixo) | Lendo abaixo do real, a unidade deixa de descontar parte da água em cada carga. |
|  |  |  | voz/un4b.mp3 (MUG lê acima) | Lendo acima do real, o produtor paga um desconto maior que o devido. É prejuízo para ele e desgaste na relação comercial. |
|  |  |  | voz/un4c.mp3 (desvio sem efeito) | Nesta umidade, o desvio não muda o desconto. Mas ele continua no equipamento e volta na próxima carga mais úmida. |
| 6 | Na safra | 12-unidade | voz/un5a.mp3 (com diferença) | Multiplicada pelas cargas do dia e pelos dias de safra, essa diferença vira um valor alto no fim do período. |
|  |  |  | voz/un5b.mp3 (sem diferença) | Com dezenas de cargas por dia, a leitura certa é o que garante um recebimento justo para os dois lados. |
| 7 | Solução | 05-medidor | voz/un6.mp3 | O desvio costuma ter duas origens: equipamento desatualizado e falta de calibração. Verificação anual, manutenção preventiva e um medidor moderno resolvem. |

### Quebra técnica

| # | Etapa | Foto | Arquivo de voz | Fala gravada |
|---|---|---|---|---|
| 1 | Carregamento | 10-expedicao | voz/ex0.mp3 | Na expedição, o caminhão é carregado direto do silo. |
| 2 | Armazenagem | 09-armazem | voz/ex1a.mp3 (com supersecagem) | Esse grão entrou no armazém no padrão, mas secou além da conta e hoje está mais seco. |
|  |  |  | voz/ex1b.mp3 (sem supersecagem) | Esse grão sai do silo com a mesma umidade com que entrou. |
| 3 | Pesagem | 03-balanca | voz/ex2.mp3 | Na balança, o caminhão fecha o peso do contrato. |
| 4 | Medição | 05-medidor | voz/ex3a.mp3 (com quebra) | O medidor Motomco confirma a umidade de saída. Grão mais seco pesa menos. Essa diferença é a quebra técnica. |
|  |  |  | voz/ex3b.mp3 (sem quebra) | O medidor Motomco confirma a umidade. Não há quebra por supersecagem. |
| 5 | Sacas a mais | 10-expedicao | voz/ex4a.mp3 (com quebra) | Para fechar o mesmo peso, sai mais grão do estoque do que estava registrado. Cada saca a mais é dinheiro que vai embora no caminhão. |
|  |  |  | voz/ex4b.mp3 (sem quebra) | Sem quebra, o estoque registrado fecha com o peso expedido. |
| 6 | No período (só com quebra) | 12-unidade | voz/ex5a.mp3 (acima da tolerância) | Somando os caminhões do período e o estoque do silo, a perda cresce rápido. Só a supersecagem já passou da tolerância prevista no contrato. |
|  |  |  | voz/ex5b.mp3 (dentro da tolerância) | Somando os caminhões do período e o estoque do silo, a perda cresce rápido. Mas a quebra ficou dentro da tolerância do contrato. |
| 7 | Controle | 08-secador | voz/ex6.mp3 | Secar só até o padrão, com medição precisa na saída do secador, evita essa perda. |

### Romaneio

| # | Etapa | Foto | Arquivo de voz | Fala gravada |
|---|---|---|---|---|
| 1 | Entrega da produção | 01-colheita | voz/ro0.mp3 | Depois de meses de trabalho no campo, chega a hora de entregar a produção. |
| 2 | Pesagem | 03-balanca | voz/ro1.mp3 | Na balança, primeiro o peso bruto. Depois da descarga, a tara. A diferença é o peso real da carga. |
| 3 | Amostragem | 04-calador | voz/ro2.mp3 | Uma amostra representativa é retirada da carga. É nela que começa a avaliação da qualidade. |
| 4 | Medição da umidade | 05-medidor | voz/ro3.mp3 | O medidor Motomco lê a umidade. Ela muda a massa do produto, por isso precisa ser medida com precisão. |
| 5 | Classificação e descontos | 06-classificacao | voz/ro4.mp3 | Na classificação, cada parâmetro tem seu critério: impureza, umidade e avariados. Os descontos são aplicados nessa ordem. |
| 6 | Resultado | 07-romaneio | voz/ro5.mp3 | Com os dados à vista, o produtor confere o peso líquido, os descontos e o valor da entrega. Transparência é saber exatamente o que foi avaliado. |

### Para onde foi o peso?

| # | Etapa | Foto | Arquivo de voz | Fala gravada |
|---|---|---|---|---|
| 1 | A chegada | 03-balanca | voz/ba0.mp3 | Tudo começa com uma pergunta: quantos quilos de grão realmente recebemos? |
| 2 | A umidade | 05-medidor | voz/ba1.mp3 | O grão não é só matéria seca. Uma parte do seu peso é água. |
| 3 | A secagem | 08-secador | voz/ba2.mp3 | Quando retiramos água, retiramos também peso. E essa diferença precisa ser compreendida tecnicamente. |
| 4 | A armazenagem | 09-armazem | voz/ba3.mp3 | Além da água, a limpeza, a movimentação e a armazenagem também influenciam o balanço de massa. |
| 5 | A expedição | 10-expedicao | voz/ba4.mp3 | Na expedição, o produto é pesado de novo. A diferença encontrada está dentro do esperado? |
| 6 | O controle | 12-unidade | voz/ba5a.mp3 (balanço fecha) | Sim. O balanço fecha. O peso muda, mas cada diferença tem uma explicação técnica. |
|  |  |  | voz/ba5b.mp3 (falta peso) | Não. Sobra uma diferença sem explicação. É hora de conferir a umidade, a balança e o estoque. O peso muda, mas cada diferença precisa ter uma explicação técnica. |

Narrador: Tiago Macedo, 46 falas. Fechamento dos roteiros: "Uma safra inteira de trabalho merece um recebimento transparente. Medir, classificar e calcular corretamente faz toda a diferença."

## 6. Fotos geradas por IA

| Arquivo | Descrição pedida ao gerador |
|---|---|
| 01-colheita | Colheitadeira descarregando soja num caminhão graneleiro na lavoura, fim de tarde, céu limpo. |
| 02-estrada | Caminhão graneleiro carregado em estrada de terra vermelha rumo a uma unidade com silos ao fundo. |
| 03-balanca | Caminhão carregado na balança rodoviária de uma cooperativa, silos e secador ao fundo, vista lateral. |
| 04-calador | Calador pneumático baixando a sonda na soja dentro da carroceria, no recebimento. |
| 05-medidor | Técnica despejando amostra de soja num medidor de umidade de bancada com tela em branco, em laboratório. |
| 06-classificacao | Mesa de classificação com peneiras e bandejas separando soja limpa, impurezas e grãos avariados. |
| 07-romaneio | Produtor no balcão da cooperativa conferindo o ticket de pesagem com uma atendente. |
| 08-secador | Torre de secador de grãos com elevadores e vapor subindo, céu azul. |
| 09-armazem | Interior de armazém graneleiro com grande monte de soja e luz entrando pelas aberturas. |
| 10-expedicao | Soja caindo do bico do silo numa carreta graneleira aberta, silos atrás. |
| 11-produtor | Produtor agachado na lavoura de soja madura, vagem aberta na mão, colheitadeira ao fundo. |
| 12-unidade | Vista panorâmica de uma cooperativa ao amanhecer, silos, secador, fila de caminhões e lavoura. |

Modelo: Google Nano Banana 2.1, 16:9, 1k. As imagens não mostram marcas nem clientes reais.

## 7. Prova do especialista (69 perguntas)

São sorteadas 20 por tentativa, proporcionalmente por tema. Nota mínima: 70% (14 acertos) para o certificado.

### Classificação

1. **Qual é a umidade padrão de comercialização da soja usada no simulador?**
   - Certa: 14%
   - Erradas: 13% · 12% · 15,5%
   - Explicação: A soja usa 14% como umidade padrão. Acima disso, cada ponto gera desconto pela tabela da unidade.
2. **Qual umidade padrão o simulador usa para o milho?**
   - Certa: 14%
   - Erradas: 13% · 12,5% · 16%
   - Explicação: Milho: padrão de 14%, como a soja.
3. **Para trigo e arroz em casca, a umidade padrão usada no simulador é:**
   - Certa: 13%
   - Erradas: 14% · 12% · 15%
   - Explicação: Trigo e arroz em casca usam 13%. Por isso, na mesma umidade de entrega, o desconto é maior que o da soja.
4. **Qual instrução normativa do MAPA o simulador cita como referência para a classificação da soja?**
   - Certa: IN nº 11/2007
   - Erradas: IN nº 60/2011 · IN nº 38/2010 · IN nº 6/2009
   - Explicação: Soja: IN MAPA nº 11/2007.
5. **Qual instrução normativa o simulador cita para o milho?**
   - Certa: IN nº 60/2011
   - Erradas: IN nº 11/2007 · IN nº 12/2008 · IN nº 8/2003
   - Explicação: Milho: IN MAPA nº 60/2011.
6. **Qual instrução normativa o simulador cita para o trigo?**
   - Certa: IN nº 38/2010
   - Erradas: IN nº 6/2009 · IN nº 60/2011 · IN nº 11/2007
   - Explicação: Trigo: IN MAPA nº 38/2010.
7. **Qual instrução normativa o simulador cita para o arroz?**
   - Certa: IN nº 6/2009
   - Erradas: IN nº 38/2010 · IN nº 12/2008 · IN nº 8/2003
   - Explicação: Arroz: IN MAPA nº 6/2009.
8. **Qual instrução normativa o simulador cita para o feijão?**
   - Certa: IN nº 12/2008
   - Erradas: IN nº 6/2009 · IN nº 60/2011 · IN nº 38/2010
   - Explicação: Feijão: IN MAPA nº 12/2008.
9. **Qual a umidade padrão do café beneficiado usada no simulador?**
   - Certa: 12,5%
   - Erradas: 14% · 13% · 11%
   - Explicação: Café beneficiado: 12,5% no simulador, com referência na IN MAPA nº 8/2003.
10. **Para que serve a classificação vegetal oficial?**
   - Certa: Definir tipo e qualidade do produto com base em padrões oficiais
   - Erradas: Definir o preço do grão na bolsa · Substituir a pesagem na balança · Calibrar o medidor de umidade
   - Explicação: A classificação compara o produto com padrões oficiais (umidade, impurezas, defeitos) e define tipo e qualidade.
11. **O que é o calador?**
   - Certa: Instrumento que retira amostras em vários pontos da carga
   - Erradas: Um tipo de medidor de umidade · A balança rodoviária · A peneira de impurezas
   - Explicação: O calador, manual ou pneumático, coleta amostras em diferentes pontos e profundidades da carga.
12. **Por que a amostra deve ser retirada em vários pontos da carga?**
   - Certa: Porque umidade e impurezas variam dentro da carga
   - Erradas: Para acelerar a descarga · Para reduzir o desconto do produtor · Porque o medidor só aceita amostras grandes
   - Explicação: Uma amostra de um só ponto pode não representar a carga. Vários pontos dão uma média mais fiel.
13. **Grãos ardidos são grãos:**
   - Certa: Escurecidos por fermentação ou pela ação de calor e umidade
   - Erradas: Partidos ao meio na colheita · Imaturos, ainda verdes · De outra espécie misturados na carga
   - Explicação: Ardido é o grão que escureceu total ou parcialmente por fermentação ou calor e umidade.
14. **Qual destes itens é classificado como matéria estranha?**
   - Certa: Pedras, terra e restos de plantas
   - Erradas: Grãos ardidos · Grãos esverdeados · Grãos mofados
   - Explicação: Matérias estranhas são corpos que não são o grão: pedras, terra, restos de plantas. Ardidos, esverdeados e mofados são defeitos do próprio grão.
15. **O PH (peso hectolitro) indica:**
   - Certa: A massa de 100 litros de grãos, em kg/hL
   - Erradas: A umidade do grão · O teor de proteína · A temperatura da amostra
   - Explicação: PH é a massa de um hectolitro (100 L) de grãos. Grão mais denso e bem formado tem PH maior.
16. **Uma densidade de 750 kg/m³ corresponde a um PH de:**
   - Certa: 75 kg/hL
   - Erradas: 7,5 kg/hL · 750 kg/hL · 0,75 kg/hL
   - Explicação: 1 m³ = 10 hL. Então 750 kg/m³ ÷ 10 = 75 kg/hL.

### Medição

17. **Por que o medidor mostra a temperatura da amostra?**
   - Certa: Porque a leitura de umidade precisa ser compensada pela temperatura do grão
   - Erradas: Para calcular o preço da saca · Para medir o PH · Apenas como informação, sem efeito na leitura
   - Explicação: A temperatura altera a resposta elétrica do grão. O medidor compensa para não errar a umidade.
18. **O que é a curva selecionada no medidor (ex.: MILHO < 42%)?**
   - Certa: A calibração específica para aquele grão e faixa de umidade
   - Erradas: O limite de peso da balança · O tipo comercial do grão · A temperatura máxima de leitura
   - Explicação: Cada grão tem sua curva de calibração. A curva certa garante a leitura certa.
19. **O que acontece se a soja for medida na curva do milho?**
   - Certa: A leitura sai errada, porque cada grão tem sua calibração
   - Erradas: Nada, a curva só muda o nome na tela · A leitura só fica mais lenta · Só a temperatura sai errada
   - Explicação: Curva errada = umidade errada = desconto errado.

### Desconto

20. **Uma carga chegou com 20% de umidade e o padrão é 14%. Quantos pontos estão acima do padrão?**
   - Certa: 6 pontos
   - Erradas: 4 pontos · 14 pontos · 34 pontos
   - Explicação: 20% − 14% = 6 pontos.
21. **Com 6 pontos acima do padrão e fator de correção 1,5, qual o desconto?**
   - Certa: 9%
   - Erradas: 6% · 7,5% · 10,5%
   - Explicação: 6 × 1,5 = 9%.
22. **Uma carga de 37.000 kg tem desconto de 9%. Quantos quilos são descontados?**
   - Certa: 3.330 kg
   - Erradas: 3.700 kg · 2.220 kg · 3.033 kg
   - Explicação: 37.000 × 9 ÷ 100 = 3.330 kg.
23. **3.330 kg equivalem a quantas sacas de 60 kg?**
   - Certa: 55,5 sacas
   - Erradas: 33,3 sacas · 60 sacas · 5,55 sacas
   - Explicação: 3.330 ÷ 60 = 55,5 sacas.
24. **55,5 sacas a R$ 134,00 a saca valem:**
   - Certa: R$ 7.437
   - Erradas: R$ 5.550 · R$ 7.134 · R$ 74.370
   - Explicação: 55,5 × 134 = R$ 7.437.
25. **Uma carga de 37.000 kg com 9% de desconto é paga por quantos quilos?**
   - Certa: 33.670 kg
   - Erradas: 34.000 kg · 36.910 kg · 33.300 kg
   - Explicação: 37.000 − 3.330 = 33.670 kg.
26. **De onde vem o fator de correção (ex.: 1,5% por ponto)?**
   - Certa: Da tabela comercial da unidade ou do contrato
   - Erradas: De uma instrução normativa do MAPA · Do Inmetro · Da bolsa de valores
   - Explicação: O padrão de umidade vem da classificação oficial. O fator por ponto vem da tabela comercial ou do contrato.
27. **Uma carga de soja chega com 14% de umidade. Qual o desconto de umidade?**
   - Certa: Zero
   - Erradas: 1,5% · 14% · 3%
   - Explicação: No padrão não há desconto de umidade.
28. **Carga com 18% de umidade, padrão 14% e fator 1,5. Qual o desconto?**
   - Certa: 6%
   - Erradas: 4% · 9% · 2,7%
   - Explicação: (18 − 14) × 1,5 = 6%.
29. **Na dica do especialista, a carga de 37 t cai de 20% para 18%. Quantos quilos o produtor deixa de perder?**
   - Certa: 1.110 kg
   - Erradas: 740 kg · 2.220 kg · 555 kg
   - Explicação: O desconto cai de 9% para 6%: 3% de 37.000 = 1.110 kg.
30. **1.110 kg equivalem a quantas sacas?**
   - Certa: 18,5 sacas
   - Erradas: 11,1 sacas · 15 sacas · 20 sacas
   - Explicação: 1.110 ÷ 60 = 18,5 sacas.
31. **Secando de 20% para 14%, quanto do peso é realmente água (desconto físico)?**
   - Certa: Cerca de 6,98%
   - Erradas: 9% · 6% · 7,5%
   - Explicação: (20 − 14) ÷ (100 − 14) = 6 ÷ 86 = 6,98%.
32. **Por que o desconto comercial (9%) é maior que o desconto físico da água (6,98%)?**
   - Certa: Porque o fator cobre também a quebra e o custo da secagem
   - Erradas: Porque a balança erra · Porque a norma exige o dobro · Porque o grão ganha peso na secagem
   - Explicação: A diferença entre o desconto comercial e a água real é o custo de entregar úmido.
33. **Quanto o produtor deixa de ganhar, além da água, ao entregar 37 t a 20% (fator 1,5)?**
   - Certa: Cerca de 749 kg
   - Erradas: 3.330 kg · 2.581 kg · 1.110 kg
   - Explicação: Água real: 37.000 × 6 ÷ 86 = 2.581 kg. Desconto: 3.330 kg. Diferença: 749 kg.
34. **60 cargas na safra, cada uma com desconto de R$ 7.437. Total na safra:**
   - Certa: R$ 446.220
   - Erradas: R$ 74.370 · R$ 44.622 · R$ 4.462.200
   - Explicação: 7.437 × 60 = R$ 446.220.

### MUG

35. **No simulador, MUG significa:**
   - Certa: Medidor de umidade de grãos
   - Erradas: Média de umidade geral · Monitor de unidade de grãos · Medidor universal de grãos ardidos
   - Explicação: MUG = medidor de umidade de grãos.
36. **O desvio do MUG é:**
   - Certa: A diferença entre a umidade lida e a umidade real da amostra
   - Erradas: A diferença de peso entre duas balanças · A variação do preço da saca · A diferença entre duas cargas
   - Explicação: Se o grão tem 18% e o MUG mostra 17,5%, o desvio é de 0,5 ponto.
37. **Se o MUG lê acima do real, quem perde?**
   - Certa: O produtor, que paga desconto maior do que o devido
   - Erradas: A unidade, que desconta menos · Ninguém, o erro se compensa · A transportadora
   - Explicação: Leitura alta = mais pontos acima do padrão = desconto indevido para o produtor.
38. **Se o MUG lê abaixo do real, o que acontece?**
   - Certa: A unidade deixa de descontar e recebe água como se fosse grão
   - Erradas: O produtor paga desconto a mais · O peso da balança aumenta · O grão é rejeitado
   - Explicação: Leitura baixa = desconto menor que o devido. A diferença sai do caixa da unidade.
39. **Grão real a 18%, MUG lê 17,5%, fator 1,5, carga de 37 t. Qual a diferença por carga?**
   - Certa: 277,5 kg
   - Erradas: 185 kg · 555 kg · 3.330 kg
   - Explicação: 0,5 ponto × 1,5 = 0,75%. 37.000 × 0,75% = 277,5 kg.
40. **Uma diferença de 277,5 kg por carga, em 30 cargas por dia durante 30 dias, soma:**
   - Certa: 249.750 kg
   - Erradas: 8.325 kg · 24.975 kg · 2.497.500 kg
   - Explicação: 30 × 30 = 900 cargas. 900 × 277,5 = 249.750 kg.
41. **249.750 kg equivalem a quantas sacas de 60 kg?**
   - Certa: 4.162,5 sacas
   - Erradas: 2.497,5 sacas · 41.625 sacas · 416,25 sacas
   - Explicação: 249.750 ÷ 60 = 4.162,5 sacas.
42. **Com 277,5 kg de diferença por carga, a cada quantas cargas a diferença soma uma carga inteira de 37 t?**
   - Certa: Cerca de 133 cargas
   - Erradas: Cerca de 37 cargas · Cerca de 277 cargas · Cerca de 900 cargas
   - Explicação: 37.000 ÷ 277,5 = 133,3 cargas.
43. **Grão real a 13,8%, MUG lê 13,3%, padrão 14%. O desvio muda o desconto?**
   - Certa: Não, porque as duas leituras estão abaixo do padrão
   - Erradas: Sim, desconto de 0,75% · Sim, o produtor paga 0,5% · Sim, a carga é rejeitada
   - Explicação: Abaixo do padrão não há desconto. O desvio existe, mas só aparece em cargas mais úmidas.
44. **Quais causas de desvio do MUG o simulador destaca?**
   - Certa: Tecnologia obsoleta e falta de calibração anual
   - Erradas: Excesso de impurezas e chuva · Peso alto da carga e temperatura do caminhão · Preço baixo e safra grande
   - Explicação: Equipamento antigo e falta de verificação e calibração fazem o desvio crescer sem ninguém notar.
45. **Quem realiza a verificação metrológica oficial dos medidores de umidade?**
   - Certa: Inmetro e os IPEMs
   - Erradas: MAPA · Conab · A própria unidade, sem registro
   - Explicação: A verificação metrológica legal é feita pelo Inmetro e pela rede de IPEMs estaduais.
46. **Qual é a forma mais completa de zerar a diferença causada pelo desvio?**
   - Certa: Verificação anual, calibração com manutenção preventiva e MUG atualizado
   - Erradas: Trocar a balança · Aumentar o fator de correção · Medir só uma amostra por dia
   - Explicação: Verificação + calibração + equipamento atual mantêm a leitura certa.
47. **Se o desvio passa de 0,5 para 1,0 ponto (cargas acima do padrão), a diferença por carga:**
   - Certa: Dobra
   - Erradas: Fica igual · Cai pela metade · Aumenta 10 vezes
   - Explicação: A diferença é proporcional ao desvio: 1,0 × 1,5% = 1,5% contra 0,75%.

### Quebra técnica

48. **O que é a quebra técnica de grãos?**
   - Certa: A perda natural de peso do lote durante a armazenagem
   - Erradas: A quebra física do grão na colheita · O desconto de impurezas na entrada · A diferença de preço entre praças
   - Explicação: É a perda de peso que acontece enquanto o grão fica armazenado, mesmo num armazém bem gerenciado.
49. **Quais são as três principais causas da quebra técnica?**
   - Certa: Perda de umidade, respiração do grão e movimentação/pragas
   - Erradas: Chuva, frete e preço · Impurezas, ardidos e PH · Balança, calador e medidor
   - Explicação: O grão evapora água, respira consumindo matéria seca e se perde em pó, quebras e ataque de pragas.
50. **Na respiração, o grão:**
   - Certa: Consome matéria seca e libera gás carbônico e água
   - Erradas: Absorve água do ar e ganha peso · Produz amido novo · Não perde peso nenhum
   - Explicação: O grão é vivo: queima carboidratos e libera CO₂ e água.
51. **Qual é a fórmula da quebra por umidade (peso final)?**
   - Certa: Pf = Pi × (100 − Ui) ÷ (100 − Uf)
   - Erradas: Pf = Pi × (Ui − Uf) ÷ 100 · Pf = Pi − (Ui + Uf) · Pf = Pi × Uf ÷ Ui
   - Explicação: Pi = peso inicial, Ui = umidade inicial, Uf = umidade final.
52. **10.000 kg de soja entram a 16% e saem a 14%. Qual o peso final?**
   - Certa: Cerca de 9.767 kg
   - Erradas: 9.800 kg · 9.600 kg · 9.860 kg
   - Explicação: 10.000 × 84 ÷ 86 = 9.767,4 kg.
53. **No exemplo anterior (16% → 14%), qual foi a perda?**
   - Certa: 232,6 kg (2,33%)
   - Erradas: 200 kg (2%) · 140 kg (1,4%) · 400 kg (4%)
   - Explicação: 10.000 − 9.767,4 = 232,6 kg.
54. **Grão entrou no silo a 14% e saiu a 12%. Qual a quebra?**
   - Certa: 2,27%
   - Erradas: 2% · 1,5% · 2,5%
   - Explicação: (14 − 12) × 100 ÷ (100 − 12) = 200 ÷ 88 = 2,27%.
55. **Com o grão saindo a 12%, quanto custa cada ponto abaixo do padrão?**
   - Certa: Cerca de 1,136% do peso
   - Erradas: 1% · 1,5% · 0,88%
   - Explicação: 100 ÷ (100 − 12) = 1,136% por ponto.
56. **Para fechar 35 t no caminhão com grão a 12% (que entrou a 14%), quanto sai do estoque registrado?**
   - Certa: Cerca de 35.814 kg
   - Erradas: 35.000 kg · 35.700 kg · 36.200 kg
   - Explicação: 35.000 × 88 ÷ 86 = 35.814 kg.
57. **Nesse caso, quantas sacas a mais saem do estoque por caminhão?**
   - Certa: Cerca de 13,6 sacas
   - Erradas: 8 sacas · 20 sacas · 5,4 sacas
   - Explicação: 35.814 − 35.000 = 814 kg ÷ 60 = 13,6 sacas.
58. **Qual a faixa de tolerância de quebra técnica que os contratos costumam aceitar?**
   - Certa: 0,2% a 0,3% ao mês
   - Erradas: 2% a 3% ao mês · 5% ao ano fixo · Nenhuma tolerância
   - Explicação: É uma faixa usual de mercado. Confira sempre a taxa do seu contrato.
59. **4 meses de armazenagem com tolerância de 0,3% ao mês somam:**
   - Certa: 1,2%
   - Erradas: 0,3% · 0,75% · 12%
   - Explicação: 4 × 0,3% = 1,2%.
60. **Qual a melhor forma de evitar a perda por supersecagem?**
   - Certa: Controlar a umidade na saída do secador com medição precisa
   - Erradas: Armazenar por mais tempo · Aumentar a temperatura do secador · Vender só no fim do ano
   - Explicação: Secar só até o padrão evita perder peso sem receber por ele.

### Romaneio

61. **No romaneio, em que ordem os descontos costumam ser aplicados?**
   - Certa: Impureza, depois umidade, depois avariados
   - Erradas: Umidade, depois impureza, depois avariados · Todos somados sobre o peso bruto · Avariados, depois impureza, depois umidade
   - Explicação: A impureza sai primeiro porque não é grão. A umidade é calculada sobre o grão limpo, e os avariados sobre o que sobra.
62. **Carga de 37.000 kg com 2% de impureza e tolerância de 1%. Quanto é descontado de impureza?**
   - Certa: Cerca de 374 kg
   - Erradas: 740 kg · 370 kg · 37 kg
   - Explicação: (2 − 1) × 100 ÷ 99 = 1,01%. 37.000 × 1,01% = 374 kg.
63. **Soja com 9,5% de avariados e tolerância de 8%. Qual o desconto de avariados?**
   - Certa: 1,5%
   - Erradas: 9,5% · 8% · 0,95%
   - Explicação: Só o que passa da tolerância: 9,5 − 8 = 1,5%.
64. **Por que o desconto de umidade é calculado depois da impureza?**
   - Certa: Porque a umidade se refere ao grão, e a impureza não é grão
   - Erradas: Porque a norma manda descontar a umidade duas vezes · Porque a impureza é mais barata · Porque a balança só pesa o grão limpo
   - Explicação: Descontar a impureza antes evita cobrar umidade sobre palha, terra e pedra.

### Balanço de massa

65. **Soja recebida: 30.000 kg a 16%, referência 14%. Qual a correção física pela umidade?**
   - Certa: 697,67 kg
   - Erradas: 600 kg · 900 kg · 420 kg
   - Explicação: 30.000 × (16 − 14) ÷ (100 − 14) = 697,67 kg. O peso equivalente corrigido é 29.302,33 kg.
66. **Por que comparar só o peso de entrada com o de saída não basta?**
   - Certa: Porque parte da diferença é água, impureza e perda operacional, e cada uma precisa ser explicada
   - Erradas: Porque a balança de saída é sempre errada · Porque o peso de saída sempre é maior · Porque a norma proíbe essa comparação
   - Explicação: O balanço de massa separa a diferença em água, impureza e operação. O que sobra precisa de investigação.
67. **988 t a 16% são secas até 13,5%. Quanta água sai?**
   - Certa: Cerca de 28,6 t
   - Erradas: 24,7 t · 2,5 t · 35 t
   - Explicação: 988 × (100 − 16) ÷ (100 − 13,5) = 959,4 t. 988 − 959,4 = 28,6 t.
68. **Secar o grão de 14% para 13% (supersecagem) tira quanto do peso?**
   - Certa: Cerca de 1,15%
   - Erradas: 1% · 0,87% · 14%
   - Explicação: 1 × 100 ÷ (100 − 13) = 1,15%. É peso perdido sem pagamento a mais.
69. **Qual é a causa mais comum de uma diferença sem explicação no balanço de massa?**
   - Certa: Umidade mal medida na entrada ou na saída
   - Erradas: Excesso de sacas no armazém · Preço baixo da soja · Grão com PH alto
   - Explicação: Meio ponto de erro na umidade média de um lote grande muda o peso esperado em toneladas.

## 8. Como publicar ou reconstruir

- **Publicar:** arrastar a pasta `publicar/` inteira em Deploys do site simuladordeumidade no Netlify.
- **Voltar à versão anterior:** publicar o `original.html` renomeado para `index.html`.
- **Remontar o index.html:** copiar os arquivos de `fonte/` para uma pasta de trabalho e rodar `node aplicar.js patch.txt <pasta do projeto>` (precisa de `original.html`, `fotos-ia/` e `voz/`). O script aplica os blocos do `patch.txt`, troca a animação pelo `animar.js`, insere as falas do `falas.json` e gera manifest, sw.js e ícones.
- **Testar localmente:** `node fonte/servidor.js . 8090` e abrir http://localhost:8090.
- **Atualizar este backup:** `node fonte/backup.js .`
- **Magnific:** bloqueado nas configurações do Claude Code a pedido do usuário em 27/11/2026. Fotos ou falas novas devem vir de arquivos próprios.
