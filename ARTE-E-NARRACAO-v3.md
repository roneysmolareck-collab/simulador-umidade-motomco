# Simulador de Umidade Motomco — arte realista e narração (proposta v3)

## 1. Diagnóstico do visual atual

| Ponto | Hoje no simulador | No infográfico de referência | O que muda na v3 |
|---|---|---|---|
| Ilustração | Desenhos em estilo infantil: caminhão com rosto, sol sorrindo, fazendeiro de chapéu | Fotos reais: caminhão na balança, calador, medidor na mão, silo | Fotos reais em todas as cenas e cartões |
| Medidor | Desenho de tela genérica | Aparelho real na mão do operador | Foto do medidor Motomco, com os números da simulação sobre a tela |
| Balança | Visor desenhado | Caminhão real na plataforma | Foto da balança, com o visor digital por cima |
| Etapas | Uma cena contínua de desenho | 6 etapas numeradas: chegada, amostragem, medição, dados, cálculo, resultado | Cena dividida nas mesmas etapas numeradas, com uma foto por etapa |
| Cores | Verde Motomco, amarelo, laranja, azul | Verde escuro, amarelo, branco | Fica só verde, amarelo e branco. O laranja sai |
| Tipografia | Outfit, Barlow e serifada | Sem serifa, títulos em caixa alta e negrito | Títulos em caixa alta e negrito (Barlow Condensed) e texto em Barlow. A serifada sai |
| Especialista | Avatar caricato | — | Foto real do Eng. Roney, ou a caricatura atual (você decide) |

### Tokens da v3

- **Cores:** verde-mata `#0b3d1e` (fundo), verde-folha `#1f6b33` (painéis), amarelo-safra `#f2c200` (destaques e números), branco `#ffffff`, creme `#f4f1e6` (rodapés dos cartões) e vermelho-desconto `#c0392b` (só para perdas)
- **Tipografia:** Barlow Condensed 800 em caixa alta para títulos e etapas, Barlow 500 para texto e IBM Plex Mono para números
- **Fotos:** horizontais, luz de dia, foco no grão e no equipamento, com um degradê verde por baixo do texto para ler bem
- **Movimento:** zoom lento na foto de cada etapa (5 a 8 s), números contando no visor e seta amarela de uma etapa para a próxima

---

## 2. Narração revisada

O que mudou em relação à narração atual:
- uma ideia por frase, com no máximo 22 palavras;
- cada termo técnico é explicado na primeira vez que aparece;
- os números da simulação entram nas falas (entre chaves abaixo);
- cada cartão termina com uma ação prática.

Os nomes entre colchetes, como [p0], são os códigos internos de cada fala no simulador.

### Cartão 1 · Entrega (produtor)

| Etapa | Fala |
|---|---|
| [p0] Colheita | Fim de colheita. A colheitadeira enche o caminhão de {grão} direto da lavoura. |
| [p1] Dúvida | Até aqui, ninguém sabe com quanta umidade essa carga sai do campo. E é essa informação que define quanto ela vale. |
| [p2] Estrada | O caminhão segue para a unidade de recebimento. |
| [p3] Balança | Primeiro, a balança: {peso} quilos de peso bruto. |
| [p4a] Medição acima | O medidor Motomco lê a amostra: {u}% de umidade, {pts} pontos acima do padrão de {ref}%. |
| [p4b] Medição no padrão | O medidor Motomco lê a amostra: {u}% de umidade, dentro do padrão de {ref}%. |
| [p5a] Desconto | Pela tabela da unidade, o desconto é de {pct}%. São {kg} quilos, ou {sc} sacas, que saem do pagamento desta carga. |
| [p5b] Sem desconto | Sem desconto de umidade. O produtor recebe pelo peso cheio. |
| [p6a] Fecho, no padrão | Grão no padrão vira dinheiro sem perda na balança. |
| [p6b] Fecho, desconto pequeno | Desconto pequeno: quase toda a carga vira dinheiro. |
| [p6c] Fecho, desconto médio | Aqui o desconto já pesa. Com dois pontos a menos de umidade, seriam {ganho} reais a mais por carga. |
| [p6d] Fecho, desconto alto | É dinheiro indo embora em forma de água. Com dois pontos a menos, seriam {ganho} reais por carga e {safra} reais na safra. |
| [p7] Ação | Medir a umidade ainda na lavoura é o que permite escolher a hora certa de colher. |

### Cartão 2 · Recebimento (cooperativa)

| Etapa | Fala |
|---|---|
| [u0] Entrada | Na unidade, o caminhão entra na balança. |
| [u1] Peso | Peso registrado: {peso} quilos. |
| [u2] Amostragem | O calador pneumático retira amostras em vários pontos e profundidades. Uma amostra bem coletada representa a carga inteira. |
| [u3] Leitura | O medidor marca {lida}%, mas a umidade real da carga é {u}%. Essa diferença é o desvio do medidor. |
| [u4a] Lê abaixo | Lendo abaixo do real, a unidade deixa de descontar {kg} quilos de água nesta carga. |
| [u4b] Lê acima | Lendo acima do real, o produtor paga {kg} quilos a mais de desconto. É prejuízo para ele e desgaste na relação comercial. |
| [u4c] Sem efeito | Nesta umidade, o desvio não muda o desconto. Mas ele continua no equipamento e volta na próxima carga mais úmida. |
| [u5a] Escala | Em {cd} cargas por dia, durante {dias} dias, essa diferença chega a {safra} reais. |
| [u5b] Escala, sem efeito | Com dezenas de cargas por dia, a leitura certa é o que garante um recebimento justo para os dois lados. |
| [u6] Ação | O desvio costuma ter duas origens: equipamento desatualizado e falta de calibração. Verificação anual, manutenção preventiva e um medidor moderno resolvem. |

### Cartão 3 · Quebra técnica (expedição)

| Etapa | Fala |
|---|---|
| [e0] Carregamento | Na expedição, o caminhão é carregado direto do silo. |
| [e1a] Supersecagem | Esse grão entrou no armazém com {ui}% de umidade, mas secou além do padrão e hoje está com {uf}%. |
| [e1b] Sem supersecagem | Esse grão sai do silo com a mesma umidade com que entrou. |
| [e2] Balança | Na balança, o caminhão fecha o peso do contrato: {peso} quilos. |
| [e3a] Medição | O medidor Motomco confirma {uf}%. Grão mais seco pesa menos. Essa diferença é a quebra técnica: {quebra}%. |
| [e3b] Medição, sem quebra | O medidor Motomco confirma a umidade. Não há quebra por supersecagem. |
| [e4] Custo | Para fechar o mesmo peso, saem do estoque {sc} sacas a mais que o registrado. São {rs} reais por caminhão. |
| [e5] Escala | Somando os caminhões do período e o estoque do silo, a perda chega a {total} reais. |
| [e6a] Acima da tolerância | Só a supersecagem já passou da tolerância prevista no contrato. |
| [e6b] Dentro da tolerância | A quebra ficou dentro da tolerância do contrato. |
| [e7] Ação | Secar só até o padrão, com medição precisa na saída do secador, evita essa perda. |

### Cartão 4 · Romaneio (do campo à balança)

| Etapa | Fala |
|---|---|
| [r0] Entrega | Depois de meses de trabalho no campo, chega a hora de entregar a produção. |
| [r1] Pesagem | Na balança, o peso bruto: {bruto} quilos. Depois da descarga, a tara: {tara}. A carga tem {peso} quilos. |
| [r2] Amostragem | Uma amostra representativa é retirada da carga. É nela que começa a avaliação da qualidade. |
| [r3] Umidade | O medidor Motomco lê {u}% de umidade. A umidade muda a massa do produto, por isso precisa ser medida com precisão. |
| [r4] Classificação | Cada parâmetro tem seu critério: {imp}% de impureza, {u}% de umidade e {ava}% de avariados. Com os descontos, a carga fica em {liq} quilos. |
| [r5] Resultado | Com os dados à vista, o produtor confere o resultado: {sc} sacas e {rs} reais. Transparência é saber exatamente o que foi avaliado. |

### Cartão 5 · Para onde foi o peso? (balanço de massa)

| Etapa | Fala |
|---|---|
| [b0] Chegada | Tudo começa com uma pergunta: quantos quilos de grão realmente recebemos? Entraram {entrada} toneladas. |
| [b1] Umidade | O grão não é só matéria seca. Parte do peso é água: {ui}% na entrada. |
| [b2] Secagem | Quando retiramos água, retiramos peso. A secagem até {uf}% tira {agua} toneladas. |
| [b3] Armazenagem | Além da água, a limpeza, a movimentação e a armazenagem também mexem no balanço de massa. |
| [b4] Expedição | Na expedição saíram {saida} toneladas. A diferença está dentro do esperado? |
| [b5a] Fecha | Sim. O balanço fecha, e cada diferença tem uma explicação técnica. |
| [b5b] Falta peso | Faltam {dif} quilos sem explicação. É hora de conferir a umidade, a balança e o estoque. |
| [b6] Fecho | O peso muda. Mas cada diferença precisa ter uma explicação técnica. |

### Fechamento (tela final de cada cartão)

> Uma safra inteira de trabalho merece um recebimento transparente.
> Medir, classificar e calcular corretamente faz toda a diferença.

---

## 3. Arquivos que preciso receber

### Obrigatórios

1. **Fotos reais das etapas** (JPG, horizontal, com pelo menos 1920 px de largura). Fotos da Motomco ou de clientes, com autorização de uso:
   - caminhão graneleiro carregado na balança rodoviária;
   - amostragem com calador pneumático e com calador manual;
   - **medidor Motomco em uso**, de preferência na mão do operador, com a tela visível e de frente;
   - mesa de classificação: peneira, impurezas e grãos avariados separados;
   - secador e silos de uma unidade armazenadora;
   - expedição: caminhão sendo carregado pelo bico do silo;
   - lavoura no ponto de colheita e colheitadeira descarregando no caminhão.
2. **Fotos de produto Motomco** em fundo branco ou PNG recortado: cada modelo de medidor que deve aparecer, com o nome comercial.
3. **Logo Motomco em SVG ou PNG grande**, nas versões branca e colorida, e o manual de marca, se existir (cores oficiais e fontes).
4. **Origem dos áudios atuais da narração:** foram gravados por você, feitos com voz clonada (qual serviço?) ou com voz sintética? Com a narração nova, os áudios precisam ser refeitos na mesma voz.

### Opcionais

5. Foto real do Eng. Roney em alta resolução, se quiser trocar a caricatura.
6. Vídeos curtos de 5 a 10 s de cada etapa, para usar como fundo em movimento no lugar das fotos.
7. Tabela de desconto real de uma unidade parceira, sem identificação, para conferir os exemplos.

Se não houver fotos próprias, dá para gerar imagens fotorrealistas por IA no mesmo estilo do infográfico. Nesse caso, as imagens têm custo de geração e não podem ser apresentadas como fotos de clientes reais.
