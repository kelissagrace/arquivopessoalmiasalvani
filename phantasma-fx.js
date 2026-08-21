(() => {
  if (window.__PHANTASMA_FX__) return;
  window.__PHANTASMA_FX__ = true;

  /*
    ============================================================
    TEMPOS DAS TRANSIÇÕES
    3500 = 3,5 segundo
    ============================================================
  */
  const FX_TIMING = {
    boot: 900,             // tela inicial de sincronização
    transicaoPagina: 2400  // "RESPOSTA CAPTURADA / ROTA INTERCEPTADA"
  };

  const style = document.createElement("style");
  style.textContent = `
  #ph-fx-canvas{
    position:fixed;inset:0;width:100%;height:100%;
    pointer-events:none;z-index:0;opacity:.22;
  }

  #ph-fx-noise{
    position:fixed;inset:0;pointer-events:none;z-index:9997;
    opacity:.12;mix-blend-mode:screen;
    background:
      repeating-linear-gradient(to bottom,rgba(255,255,255,.08) 0 1px,transparent 2px 5px);
    animation:phScan .18s steps(2) infinite;
  }

  #ph-fx-tear{
    position:fixed;left:-10%;width:120%;height:8px;top:20%;
    pointer-events:none;z-index:9998;opacity:0;
    background:rgba(68,255,145,.14);
    box-shadow:0 0 15px rgba(68,255,145,.2);
  }

  #ph-fx-boot{
    position:fixed;inset:0;z-index:10000;pointer-events:none;
    display:grid;place-items:center;background:#000;
    opacity:1;transition:opacity .28s ease;
  }

  #ph-fx-boot.hide{opacity:0}

  #ph-fx-boot-text{
    color:#69ff96;
    font:700 clamp(13px,2vw,20px)/1.7 "Courier New",monospace;
    letter-spacing:.12em;
    text-align:left;
    width:min(620px,82vw);
    text-shadow:2px 0 #ff4058,-2px 0 #31e6ff;
  }

  #ph-fx-status{
    position:fixed;right:12px;bottom:10px;z-index:9996;
    pointer-events:none;color:rgba(105,255,150,.42);
    font:10px/1.3 "Courier New",monospace;letter-spacing:.08em;
    max-width:48vw;text-align:right;
  }

  /* ===== TRANSIÇÃO ENTRE PÁGINAS ===== */
  .ph-fx-exit{
    position:fixed !important;
    inset:0 !important;
    width:100vw !important;
    height:100dvh !important;
    z-index:10001 !important;
    pointer-events:none;
    display:flex !important;
    align-items:center !important;
    justify-content:center !important;
    overflow:hidden;
    background:#000;
    opacity:0;
    transition:opacity .22s linear;
    margin:0 !important;
    padding:0 !important;
  }

  .ph-fx-exit.show{opacity:1}

  .ph-fx-exit::before{
    content:"";
    position:absolute;
    inset:0;
    z-index:1;
    background:
      repeating-linear-gradient(
        to bottom,
        rgba(255,255,255,.055) 0 1px,
        transparent 2px 5px
      ),
      radial-gradient(
        circle at center,
        transparent 0 22%,
        rgba(0,0,0,.32) 54%,
        #000 100%
      );
    animation:phExitScan .11s steps(2) infinite;
  }

  .ph-fx-exit-matrix{
    position:absolute !important;
    inset:0 !important;
    width:100% !important;
    height:100% !important;
    z-index:0 !important;
    pointer-events:none;
    opacity:.52;
  }

  .ph-fx-exit-message{
    position:relative !important;
    inset:auto !important;
    z-index:3 !important;
    width:min(760px,88vw) !important;
    max-width:760px !important;
    margin:0 auto !important;
    transform-origin:center center;
    padding:clamp(28px,6vw,58px) clamp(22px,5vw,50px);
    border:1px solid rgba(105,255,150,.30);
    background:rgba(0,5,2,.86);
    box-shadow:
      0 0 70px rgba(105,255,150,.08),
      inset 0 0 40px rgba(105,255,150,.025);

    color:#69ff96;
    text-align:center;
    font:700 clamp(18px,4vw,36px)/1.35 "Courier New",monospace;
    letter-spacing:.07em;
    text-shadow:
      3px 0 #ff4058,
      -3px 0 #31e6ff;

    animation:phExitMessage .30s steps(2) infinite;
  }

  .ph-fx-exit-sub{
    display:block;
    margin-top:20px;
    color:rgba(233,255,240,.56);
    font:11px/1.55 "Courier New",monospace;
    letter-spacing:.12em;
    text-shadow:none;
  }

  @keyframes phScan{
    50%{transform:translateY(2px)}
  }

  @keyframes phTear{
    0%{opacity:0;transform:translate(0,0) scaleX(1)}
    15%{opacity:.9;transform:translate(4%,8vh) scaleX(.92)}
    30%{opacity:.2;transform:translate(-3%,31vh) scaleX(1.08)}
    65%{opacity:.75;transform:translate(2%,57vh) scaleX(.96)}
    100%{opacity:0;transform:translate(-2%,78vh) scaleX(1.05)}
  }

  @keyframes phExitScan{
    50%{transform:translateY(3px)}
  }


  @keyframes phExitMessage{
    0%,76%,100%{transform:none;filter:none}
    78%{
      transform:translateX(6px);
      filter:contrast(1.7);
      text-shadow:6px 0 #ff4058,-6px 0 #31e6ff;
    }
    84%{transform:translateX(-5px)}
    91%{transform:none}
  }

  @media(max-width:560px){
    #ph-fx-canvas{opacity:.16}
    #ph-fx-status{font-size:8px;max-width:70vw}

    .ph-fx-exit-message{
      width:90vw;
      padding:28px 18px;
      font-size:clamp(18px,7vw,30px);
    }
  }`;

  document.head.appendChild(style);

  const canvas = document.createElement("canvas");
  canvas.id = "ph-fx-canvas";
  document.body.prepend(canvas);

  const noise = document.createElement("div");
  noise.id = "ph-fx-noise";
  document.body.appendChild(noise);

  const tear = document.createElement("div");
  tear.id = "ph-fx-tear";
  document.body.appendChild(tear);

  const status = document.createElement("div");
  status.id = "ph-fx-status";
  status.textContent = "PHANTASMA // SINAL INSTÁVEL";
  document.body.appendChild(status);

  const boot = document.createElement("div");
  boot.id = "ph-fx-boot";
  boot.innerHTML = `
    <div id="ph-fx-boot-text">
      &gt; SINCRONIZANDO TRANSMISSÃO...<br>
      &gt; INJETANDO RUÍDO...<br>
      &gt; TRACE: FALHOU
    </div>`;
  document.body.appendChild(boot);

  const ctx = canvas.getContext("2d");
  const glyphs = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*<>/\\\\[]{}";

  let drops = [];
  let cols = 0;
  let w = 0;
  let h = 0;
  let fs = 15;
  let raf;

  function resize(){
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    w = innerWidth;
    h = innerHeight;

    canvas.width = Math.floor(w*dpr);
    canvas.height = Math.floor(h*dpr);
    canvas.style.width = w+"px";
    canvas.style.height = h+"px";

    ctx.setTransform(dpr,0,0,dpr,0,0);

    fs = innerWidth < 600 ? 13 : 15;
    cols = Math.ceil(w/fs);

    drops = Array.from(
      {length:cols},
      (_,i)=>drops[i] ?? Math.random()*-40
    );
  }

  function draw(){
    ctx.fillStyle="rgba(0,0,0,.13)";
    ctx.fillRect(0,0,w,h);

    ctx.font=fs+"px monospace";
    ctx.fillStyle="rgba(105,255,150,.72)";

    for(let i=0;i<cols;i++){
      const ch=glyphs[(Math.random()*glyphs.length)|0];
      const y=drops[i]*fs;

      ctx.fillText(ch,i*fs,y);

      if(y>h && Math.random()>.975){
        drops[i]=Math.random()*-12;
      }

      drops[i]+=0.32+Math.random()*.35;
    }

    raf=requestAnimationFrame(draw);
  }

  resize();
  draw();

  addEventListener("resize", resize, {passive:true});

  const bootLines = [
    "> SINCRONIZANDO TRANSMISSÃO...",
    "> ACESSO NÃO AUTORIZADO...",
    "> TRACE: FALHOU",
    "> CHAVE PHANTASMA: ATIVA",
    "> INTERCEPTAÇÃO CONCLUÍDA"
  ];

  let bi=0;
  const bootText=document.getElementById("ph-fx-boot-text");

  const bt=setInterval(()=>{
    bi=(bi+1)%bootLines.length;

    if(bootText){
      bootText.innerHTML=bootLines
        .slice(0,3)
        .map((_,i)=>bootLines[(bi+i)%bootLines.length])
        .join("<br>");
    }
  },120);

  setTimeout(()=>{
    clearInterval(bt);
    boot.classList.add("hide");

    setTimeout(()=>{
      boot.remove();
    },320);

  },FX_TIMING.boot);

  const statuses=[
    "TRACE // FALHOU",
    "PACOTES // CORROMPIDOS",
    "SINAL // INSTÁVEL",
    "PHANTASMA // OBSERVANDO",
    "CANAL // INTERCEPTADO",
    "CRIPTOGRAFIA // ALTERADA"
  ];

  setInterval(()=>{
    status.textContent=statuses[(Math.random()*statuses.length)|0];

    if(Math.random()>.55){
      tear.style.animation="none";
      void tear.offsetWidth;
      tear.style.animation="phTear .42s steps(3)";
    }
  },1050);

  function transitionTo(url, message){
    if(!url) return;

    if(window.PhantasmaAudio){
      PhantasmaAudio.play("glitch",.28);
    }

    const exit=document.createElement("div");
    exit.className="ph-fx-exit";

    exit.innerHTML=`
      <canvas class="ph-fx-exit-matrix"></canvas>

      <div class="ph-fx-exit-message">
        ${message || "> RECONFIGURANDO ROTA..."}

        <span class="ph-fx-exit-sub">
          PHANTASMA // TRANSMISSÃO EM PROCESSAMENTO
        </span>
      </div>
    `;

    document.body.appendChild(exit);

    const matrix=exit.querySelector(".ph-fx-exit-matrix");
    const mctx=matrix.getContext("2d");
    const mfs=16;
    let mdrops=[];
    let mw=0;
    let mh=0;
    let matrixRaf=0;

    function resizeExitMatrix(){
      const dpr=Math.min(window.devicePixelRatio || 1,2);
      mw=window.innerWidth;
      mh=window.innerHeight;

      matrix.width=Math.floor(mw*dpr);
      matrix.height=Math.floor(mh*dpr);
      matrix.style.width=mw+"px";
      matrix.style.height=mh+"px";

      mctx.setTransform(dpr,0,0,dpr,0,0);

      const columns=Math.ceil(mw/mfs);
      mdrops=Array.from(
        {length:columns},
        (_,i)=>mdrops[i] ?? Math.random()*-55
      );
    }

    function drawExitMatrix(){
      mctx.fillStyle="rgba(0,0,0,.115)";
      mctx.fillRect(0,0,mw,mh);
      mctx.font=mfs+'px "Courier New", monospace';

      for(let i=0;i<mdrops.length;i++){
        const ch=glyphs[(Math.random()*glyphs.length)|0];
        const x=i*mfs;
        const y=mdrops[i]*mfs;

        mctx.fillStyle=Math.random()>.965
          ? "rgba(225,255,233,.78)"
          : "rgba(105,255,150,.48)";

        mctx.fillText(ch,x,y);

        if(y>mh && Math.random()>.965){
          mdrops[i]=Math.random()*-18;
        }

        mdrops[i]+=.68+Math.random()*.44;
      }

      matrixRaf=requestAnimationFrame(drawExitMatrix);
    }

    resizeExitMatrix();
    drawExitMatrix();

    requestAnimationFrame(()=>{
      exit.classList.add("show");
    });

    setTimeout(()=>{
      cancelAnimationFrame(matrixRaf);
      location.href=url;
    },FX_TIMING.transicaoPagina);
  }
  window.PhantasmaFX={transitionTo};

  document.addEventListener("click",e=>{
    const a=e.target.closest("a[href]");

    if(
      !a ||
      a.target==="_blank" ||
      a.hasAttribute("download")
    ){
      return;
    }

    const href=a.getAttribute("href");

    if(
      !href ||
      href.startsWith("#") ||
      href.startsWith("javascript:")
    ){
      return;
    }

    e.preventDefault();

    transitionTo(
      href,
      "> ROTA INTERCEPTADA // REDIRECIONANDO..."
    );
  });
})();
