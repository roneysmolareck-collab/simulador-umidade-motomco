/* ===== Palco de fotos: etapas numeradas com visor da balança e tela do medidor ===== */
const FOTO=k=>'fotos/'+({colheita:'01-colheita',estrada:'02-estrada',balanca:'03-balanca',calador:'04-calador',medidor:'05-medidor',classif:'06-classificacao',romaneio:'07-romaneio',secador:'08-secador',armazem:'09-armazem',expedicao:'10-expedicao',produtor:'11-produtor',unidade:'12-unidade'})[k]+'.jpg';
const n0=v=>Math.round(v).toLocaleString('pt-BR');
const n1=v=>pc(v,1).replace(/,0$/,'');
const PERDA='#b5482e', OK='#2f7d32', INFO='#1f5f73';
let fpAtual=null;
function fpFoto(k){
  if(fpAtual===k)return; fpAtual=k; const box=$('fpFotos');
  const img=new Image(); img.src=FOTO(k); img.alt=''; img.className='fp-img';
  box.appendChild(img); requestAnimationFrame(()=>requestAnimationFrame(()=>img.classList.add('on')));
  [...box.children].slice(0,-2).forEach(x=>x.remove());
  setTimeout(()=>{[...box.children].slice(0,-1).forEach(x=>x.classList.remove('on'));},reduz?0:50);
}
function fpVisor(rot,val,sub){const v=$('fpVisor');v.hidden=false;$('fpVRot').textContent=rot;if(val!=null)$('fpVVal').textContent=val;$('fpVSub').textContent=sub||'';}
function fpMed(txt,extra){const m=$('fpMed');m.hidden=false;$('fpMCurva').textContent=GRAOS[grao].curva;if(txt!=null)$('fpMU').textContent=txt;$('fpMExtra').textContent=extra||'';}
function fpEtq(cor,txt){const e=$('fpEtq');e.hidden=false;e.style.background=cor;e.textContent=txt;}
function fpLimpa(){['fpVisor','fpMed','fpEtq'].forEach(id=>$(id).hidden=true);}
const contaVisor=(de,ate,fmt,ms)=>contar($('fpVVal'),de,ate,ms||1100,fmt);
const contaMed=(ate)=>contar($('fpMU'),8,ate,1300,v=>pc(v,1)+'%');

/* roteiros: uma etapa por foto, com título, fala e ação nos visores */
const ROTEIRO={
  produtor:r=>{const g=GRAOS[grao].nome.toLowerCase(), hm=humorDe(r.u);return [
    {foto:'colheita',tit:'Colheita',fala:`Fim de colheita. A colheitadeira enche o caminhão de ${g} direto da lavoura.`},
    {foto:'produtor',tit:'Umidade desconhecida',fala:'Até aqui, ninguém sabe com quanta umidade essa carga sai do campo. E é essa informação que define quanto ela vale.'},
    {foto:'estrada',tit:'Transporte',fala:'O caminhão segue para a unidade de recebimento.'},
    {foto:'balanca',tit:'Pesagem',fala:`Primeiro, a balança: ${n0(r.P)} quilos de peso bruto.`,acao:async()=>{fpVisor('PESO BRUTO','0 kg');await contaVisor(0,r.P,kg);}},
    {foto:'medidor',tit:'Medição da umidade',fala:`O medidor Motomco lê a amostra: ${n1(r.u)}% de umidade, `+(r.pts>0?`${n1(r.pts)} pontos acima do padrão de ${n1(r.ref)}%.`:`dentro do padrão de ${n1(r.ref)}%.`),acao:async()=>{fpMed('--,-%',`padrão ${pc(r.ref,r.ref%1?1:0)}%`);await contaMed(r.u);}},
    {foto:'romaneio',tit:'Desconto',fala:r.pts>0?`Pela tabela da unidade, o desconto é de ${n1(r.pct)}%. São ${n0(r.dKg)} quilos, ou ${n1(r.dKg/60)} sacas, que saem do pagamento desta carga.`:'Sem desconto de umidade. O produtor recebe pelo peso cheio.',
      acao:async()=>{$('fpMed').hidden=true;if(r.dKg>0){fpVisor('PESO PAGO',null,`desconto ${pc(r.pct,2)}%: −${kg(r.dKg)}`);await contaVisor(r.P,r.liq,kg,1400);}else fpVisor('PESO PAGO',kg(r.P),'sem desconto');
        fpEtq(r.dKg>0?PERDA:OK,r.dKg>0?`Você perde ${pc(r.pct,2)}%: ${kg(r.dKg)} · ${sc(r.dKg)}`+(r.preco>0?` · ${rs(r.dRs)}`:''):'Carga no padrão: sem desconto');}},
    {foto:'produtor',tit:'Resultado',fala:(r.pts<=0?'Grão no padrão vira dinheiro sem perda na balança. ':hm==='feliz'?'Desconto pequeno: quase toda a carga vira dinheiro. ':hm==='raiva'?`É dinheiro indo embora em forma de água. Com dois pontos a menos, seriam ${n0(r.ganhoRs)} reais por carga e ${n0(r.ganhoRs*r.cargas)} reais na safra. `:`Aqui o desconto já pesa. Com dois pontos a menos de umidade, seriam ${n0(r.ganhoRs)} reais a mais por carga. `)+'Medir a umidade ainda na lavoura é o que permite escolher a hora certa de colher.',
      status:`Umidade ${pc(r.u)}% · desconto ${pc(r.pct,2)}% · ${kg(r.dKg)}`}
  ];},
  unidade:r=>{const nada=Math.abs(r.dif)<0.5;return [
    {foto:'estrada',tit:'Chegada da carga',fala:'Na unidade, o caminhão entra na balança.'},
    {foto:'balanca',tit:'Pesagem',fala:`Peso registrado: ${n0(r.P)} quilos.`,acao:async()=>{fpVisor('PESO BRUTO','0 kg');await contaVisor(0,r.P,kg);}},
    {foto:'calador',tit:'Amostragem',fala:'O calador pneumático retira amostras em vários pontos e profundidades. Uma amostra bem coletada representa a carga inteira.'},
    {foto:'medidor',tit:'Leitura do medidor',fala:`O medidor marca ${n1(r.lida)}%, mas a umidade real da carga é ${n1(r.u)}%. Essa diferença é o desvio do medidor.`,acao:async()=>{fpMed('--,-%',`real ${pc(r.u)}% · desvio ${pc(r.dv)} pt`);await contaMed(r.lida);}},
    {foto:'romaneio',tit:'Diferença no desconto',fala:nada?'Nesta umidade, o desvio não muda o desconto. Mas ele continua no equipamento e volta na próxima carga mais úmida.':(r.dir<0?`Lendo abaixo do real, a unidade deixa de descontar ${n0(Math.abs(r.dif))} quilos de água nesta carga.`:`Lendo acima do real, o produtor paga ${n0(Math.abs(r.dif))} quilos a mais de desconto. É prejuízo para ele e desgaste na relação comercial.`),
      acao:async()=>{$('fpMed').hidden=true;fpVisor('DIFERENÇA POR CARGA',kg(Math.abs(r.dif)),`lido ${pc(r.lida)}% · real ${pc(r.u)}%`);fpEtq(nada?OK:(r.dir<0?INFO:PERDA),nada?'Desvio sem efeito nesta umidade':`Desvio de ${pc(r.dv)} pt: ${kg(Math.abs(r.dif))} por carga`);}},
    {foto:'unidade',tit:'Na safra',fala:nada?'Com dezenas de cargas por dia, a leitura certa é o que garante um recebimento justo para os dois lados.':`Em ${r.cd} cargas por dia, durante ${r.dias} dias, essa diferença chega a ${n0(r.vSafra)} reais.`,
      acao:async()=>{fpVisor('NA SAFRA',null,`${r.cd} cargas/dia × ${r.dias} dias`);await contaVisor(0,r.vSafra,rs,1300);}},
    {foto:'medidor',tit:'Solução',fala:'O desvio costuma ter duas origens: equipamento desatualizado e falta de calibração. Verificação anual, manutenção preventiva e um medidor moderno resolvem.',
      status:`${r.cd} cargas/dia × ${r.dias} dias = ${r.cd*r.dias} cargas com o mesmo desvio`}
  ];},
  expedicao:r=>{const q=r.pts>0;return [
    {foto:'expedicao',tit:'Carregamento',fala:'Na expedição, o caminhão é carregado direto do silo.'},
    {foto:'armazem',tit:'Armazenagem',fala:q?`Esse grão entrou no armazém com ${n1(r.ui)}% de umidade, mas secou além do padrão e hoje está com ${n1(r.uf)}%.`:'Esse grão sai do silo com a mesma umidade com que entrou.'},
    {foto:'balanca',tit:'Pesagem',fala:`Na balança, o caminhão fecha o peso do contrato: ${n0(r.P)} quilos.`,acao:async()=>{fpVisor('PESO EXPEDIDO','0 kg');await contaVisor(0,r.P,kg);}},
    {foto:'medidor',tit:'Medição',fala:q?`O medidor Motomco confirma ${n1(r.uf)}%. Grão mais seco pesa menos. Essa diferença é a quebra técnica: ${pc(r.quebra,2)}%.`:'O medidor Motomco confirma a umidade. Não há quebra por supersecagem.',acao:async()=>{fpMed('--,-%',`entrou com ${pc(r.ui)}%`);await contaMed(r.uf);}},
    {foto:'expedicao',tit:'Sacas a mais',fala:q?`Para fechar o mesmo peso, saem do estoque ${n1(r.extra/60)} sacas a mais que o registrado. São ${n0(r.extraRs)} reais por caminhão.`:'Sem quebra, o estoque registrado fecha com o peso expedido.',
      acao:async()=>{$('fpMed').hidden=true;fpVisor('TIRADO DO ESTOQUE',null,`para fechar ${kg(r.P)}`);await contaVisor(r.P,r.Pest,kg,1200);
        fpEtq(q?INFO:OK,q?(r.preco>0?`Quebra ${pc(r.quebra,2)}%: +${sc(r.extra)} · ${rs(r.extraRs)} por caminhão`:`Quebra ${pc(r.quebra,2)}%: +${sc(r.extra)} por caminhão`):'Sem quebra por supersecagem');}},
    ...(q?[{foto:'unidade',tit:'No período',fala:`Somando os caminhões do período e o estoque do silo, a perda chega a ${n0(r.vSafra+r.siloRs)} reais. `+(r.quebra>r.tolTot?'Só a supersecagem já passou da tolerância prevista no contrato.':'A quebra ficou dentro da tolerância do contrato.'),
      acao:async()=>{fpVisor('NO PERÍODO',null,`${r.cd} caminhões/dia × ${r.dias} dias`);await contaVisor(0,r.vSafra,rs,1300);fpEtq(r.quebra>r.tolTot?PERDA:OK,r.quebra>r.tolTot?`Acima da tolerância de ${pc(r.tolTot,2)}%`:`Dentro da tolerância de ${pc(r.tolTot,2)}%`);}}]:[]),
    {foto:'secador',tit:'Controle',fala:'Secar só até o padrão, com medição precisa na saída do secador, evita essa perda.',status:`Entrou a ${pc(r.ui)}%, saiu a ${pc(r.uf)}% · fator ${pc(r.fatorPt,3)}% por ponto`}
  ];},
  romaneio:r=>[
    {foto:'colheita',tit:'Entrega da produção',fala:'Depois de meses de trabalho no campo, chega a hora de entregar a produção.'},
    {foto:'balanca',tit:'Pesagem',fala:`Na balança, o peso bruto: ${n0(r.bruto)} quilos. Depois da descarga, a tara: ${n0(r.tara)}. A carga tem ${n0(r.P)} quilos.`,
      acao:async()=>{fpVisor('PESO BRUTO','0 kg');await contaVisor(0,r.bruto,kg,900);fpVisor('CARGA',null,`tara −${kg(r.tara)}`);await contaVisor(r.bruto,r.P,kg,900);}},
    {foto:'calador',tit:'Amostragem',fala:'Uma amostra representativa é retirada da carga. É nela que começa a avaliação da qualidade.'},
    {foto:'medidor',tit:'Medição da umidade',fala:`O medidor Motomco lê ${n1(r.u)}% de umidade. A umidade muda a massa do produto, por isso precisa ser medida com precisão.`,acao:async()=>{fpMed('--,-%',`padrão ${pc(r.ref,r.ref%1?1:0)}%`);await contaMed(r.u);}},
    {foto:'classif',tit:'Classificação e descontos',fala:`Cada parâmetro tem seu critério: ${n1(r.imp)}% de impureza, ${n1(r.u)}% de umidade e ${n1(r.ava)}% de avariados. `+(r.tot>0.5?`Com os descontos, a carga fica em ${n0(r.liq)} quilos.`:'A carga está dentro do padrão.'),
      acao:async()=>{$('fpMed').hidden=true;let at=r.P;fpVisor('PESO LÍQUIDO',kg(r.P),'');
        for(const [p,t] of [[r.p1,`impureza −${kg(r.kImp)}`],[r.p2,`umidade −${kg(r.kUmi)}`],[r.liq,`avariados −${kg(r.kAva)}`]]){$('fpVSub').textContent=t;if(p<at-0.5)await contaVisor(at,p,kg,800);else await espera(400);at=p;}
        $('fpVSub').textContent=`descontos −${kg(r.tot)}`;}},
    {foto:'romaneio',tit:'Resultado',fala:`Com os dados à vista, o produtor confere o resultado: ${n1(r.liq/60)} sacas`+(r.preco>0?` e ${n0(r.valor)} reais`:'')+'. Transparência é saber exatamente o que foi avaliado.',
      acao:async()=>{fpEtq(r.tot>0.5?PERDA:OK,r.tot>0.5?`Descontos ${pc(r.totPct,2)}%: −${kg(r.tot)} · ${sc(r.tot)}`+(r.preco>0?` · ${rs(r.perdaRs)}`:''):'Carga dentro do padrão: sem desconto');},
      status:`Líquido ${kg(r.liq)} · ${sc(r.liq)}`+(r.preco>0?` · ${rs(r.valor)}`:'')}
  ],
  balanco:r=>[
    {foto:'balanca',tit:'A chegada',fala:`Tudo começa com uma pergunta: quantos quilos de grão realmente recebemos? Entraram ${n0(r.P/1000)} toneladas.`,acao:async()=>{fpVisor('ENTRADA','0 t');await contaVisor(0,r.P,ton);}},
    {foto:'medidor',tit:'A umidade',fala:`O grão não é só matéria seca. Parte do peso é água: ${n1(r.ui)}% na entrada.`,acao:async()=>{fpMed('--,-%','umidade média de entrada');await contaMed(r.ui);}},
    {foto:'secador',tit:'A secagem',fala:`Quando retiramos água, retiramos peso. A secagem até ${n1(r.uf)}% tira ${n0(r.kAgua/1000)} toneladas.`,
      acao:async()=>{$('fpMed').hidden=true;fpVisor('APÓS LIMPEZA E SECAGEM',null,`impureza −${ton(r.kImp)} · água −${ton(r.kAgua)}`);await contaVisor(r.P,r.p2,ton,1300);}},
    {foto:'armazem',tit:'A armazenagem',fala:'Além da água, a limpeza, a movimentação e a armazenagem também mexem no balanço de massa.',
      acao:async()=>{fpVisor('PESO ESPERADO',null,`operação −${ton(r.kOper)}`);await contaVisor(r.p2,r.esperado,ton,1000);}},
    {foto:'expedicao',tit:'A expedição',fala:`Na expedição saíram ${n0(r.pexp/1000)} toneladas. A diferença está dentro do esperado?`,
      acao:async()=>{fpVisor('EXPEDIDO',null,`esperado ${ton(r.esperado)}`);await contaVisor(r.esperado,r.pexp,ton,1000);}},
    {foto:'unidade',tit:'O controle',fala:(r.ok?'Sim. O balanço fecha, e cada diferença tem uma explicação técnica. ':(r.dif<0?`Faltam ${n0(-r.dif)} quilos sem explicação. É hora de conferir a umidade, a balança e o estoque. `:`Saíram ${n0(r.dif)} quilos a mais que o esperado. Vale conferir a umidade e os registros. `))+'O peso muda. Mas cada diferença precisa ter uma explicação técnica.',
      acao:async()=>{fpEtq(r.ok?OK:PERDA,r.ok?'Balanço fecha: diferença dentro do esperado':(r.dif<0?`Faltam ${kg(-r.dif)} sem explicação técnica (${pc(-r.difPct,2)}%)`:`Sobram ${kg(r.dif)} em relação ao esperado`));},
      status:`Entrada ${ton(r.P)} · esperado ${ton(r.esperado)} · expedido ${ton(r.pexp)}`}
  ]
};

/* narração gravada (voz Tiago Macedo): uma fala sem números por etapa; os números ficam no visor e na legenda */
const VOZ_FALAS=__VOZ_FALAS__;
Object.assign(FALAS,VOZ_FALAS); Object.keys(VOZ_FALAS).forEach(k=>{CLIPS[k]='voz/'+k+'.mp3';});
function clipsDe(r){
  if(modo==='produtor')return ['pr0','pr1','pr2','pr3',r.pts>0?'pr4a':'pr4b',r.pts>0?'pr5a':'pr5b',r.pts<=0?'pr6a':({feliz:'pr6b',pensa:'pr6c',raiva:'pr6d'})[humorDe(r.u)]];
  if(modo==='unidade'){const nada=Math.abs(r.dif)<0.5;return ['un0','un1','un2','un3',nada?'un4c':(r.dir<0?'un4a':'un4b'),nada?'un5b':'un5a','un6'];}
  if(modo==='expedicao')return r.pts>0?['ex0','ex1a','ex2','ex3a','ex4a',r.quebra>r.tolTot?'ex5a':'ex5b','ex6']:['ex0','ex1b','ex2','ex3b','ex4b','ex6'];
  if(modo==='romaneio')return ['ro0','ro1','ro2','ro3','ro4','ro5'];
  if(modo==='balanco')return ['ba0','ba1','ba2','ba3','ba4',r.ok?'ba5a':'ba5b'];
  return [];
}
async function animar(){
  const meu=++token; novaLeitura(); atualizar();
  const vivo=()=>meu===token, r=R, P=ROTEIRO[modo](r);
  CH=clipsDe(r); window.__marks=[]; window.__fim=0; fpAtual=null; fpLimpa();
  $('fpPassos').innerHTML=P.map((s,i)=>`<span data-i="${i}"><b>${i+1}</b>${s.tit}</span>`).join('');
  for(let i=0;i<P.length;i++){
    if(!vivo())return; const s=P[i];
    fpFoto(s.foto); $('fpNum').textContent=i+1; $('fpTit').textContent=s.tit;
    $('fpPassos').querySelectorAll('span').forEach((x,k)=>{x.classList.toggle('on',k===i);x.classList.toggle('feito',k<i);});
    {const c=$('fpPassos'), on=c.querySelector('.on'); if(on) c.scrollLeft=on.offsetLeft-c.clientWidth/2+on.offsetWidth/2;}
    $('status').textContent=`Etapa ${i+1} de ${P.length} · ${s.tit}`;
    const f=falar(i,s.fala,3000,vivo);
    if(s.acao) await s.acao(); if(!vivo())return;
    await f; if(!vivo())return;
  }
  $('fpPassos').querySelectorAll('span').forEach(x=>{x.classList.remove('on');x.classList.add('feito');});
  $('status').textContent=P[P.length-1].status||'';
  window.__fim=performance.now();
}
