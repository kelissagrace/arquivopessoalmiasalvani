(() => {
  if(window.__PHANTASMA_FX_V5__) return;
  window.__PHANTASMA_FX_V5__ = true;

  const FX_TIMING={
    transicaoPagina:2350
  };

  const style=document.createElement("style");
  style.textContent=`
    #ph-fx-canvas-v5{
      position:fixed;inset:0;width:100%;height:100%;
      z-index:0;pointer-events:none;opacity:.20;
    }

    #ph-fx-status-v5{
      position:fixed;right:12px;bottom:10px;z-index:9995;
      pointer-events:none;color:rgba(105,255,150,.30);
      font:9px/1.3 "Courier New",monospace;
      letter-spacing:.08em;
    }

    .ph-route-v5{
      position:fixed;inset:0;z-index:10001;
      display:grid;place-items:center;
      padding:16px;
      background:rgba(0,0,0,.90);
      backdrop-filter:blur(5px);
      opacity:0;
      transition:opacity .30s ease;
      pointer-events:none;
    }

    .ph-route-v5.show{opacity:1}

    .ph-route-v5::before{
      content:"";
      position:absolute;inset:0;pointer-events:none;
      background:
        repeating-linear-gradient(
          to bottom,
          rgba(255,255,255,.024) 0 1px,
          transparent 2px 5px
        ),
        radial-gradient(
          circle at center,
          transparent 0 28%,
          rgba(0,0,0,.28) 62%,
          rgba(0,0,0,.68) 100%
        );
    }

    .ph-route-card-v5{
      position:relative;
      width:min(680px,92vw);
      padding:clamp(24px,5vw,42px);
      border:1px solid rgba(105,255,150,.25);
      background:rgba(0,7,3,.84);
      box-shadow:
        0 24px 90px rgba(0,0,0,.56),
        inset 0 0 40px rgba(105,255,150,.025);
      opacity:0;
      transform:translateY(10px) scale(.99);
      animation:phRouteCardV5 .55s cubic-bezier(.22,.8,.22,1) .08s forwards;
    }

    @keyframes phRouteCardV5{
      to{opacity:1;transform:none}
    }

    .ph-route-tag-v5{
      color:#708077;
      font:10px/1.4 "Courier New",monospace;
      letter-spacing:.14em;
      text-transform:uppercase;
    }

    .ph-route-message-v5{
      margin:16px 0 20px;
      color:#e9fff0;
      font:700 clamp(20px,4vw,34px)/1.25 "Courier New",monospace;
      letter-spacing:.025em;
    }

    .ph-route-meta-v5{
      display:flex;justify-content:space-between;gap:12px;
      color:#718077;
      font:10px/1.4 "Courier New",monospace;
      letter-spacing:.08em;
      margin-bottom:7px;
    }

    .ph-route-meta-v5 strong{
      color:#69ff96;
      font-weight:400;
    }

    .ph-route-track-v5{
      height:4px;
      background:rgba(105,255,150,.08);
      overflow:hidden;
      box-shadow:0 0 0 1px rgba(105,255,150,.12);
    }

    .ph-route-fill-v5{
      width:0;height:100%;
      background:#69ff96;
      box-shadow:0 0 14px rgba(105,255,150,.35);
      transition:width 1.75s cubic-bezier(.18,.8,.24,1);
    }

    .ph-route-foot-v5{
      min-height:1.5em;
      margin-top:12px;
      color:#6e7d74;
      font:10px/1.5 "Courier New",monospace;
      letter-spacing:.06em;
    }

    @media(max-width:560px){
      #ph-fx-canvas-v5{opacity:.15}
      .ph-route-card-v5{width:94vw;padding:24px 18px}
      .ph-route-message-v5{font-size:clamp(19px,7vw,28px)}
    }
  `;
  document.head.appendChild(style);

  const canvas=document.createElement("canvas");
  canvas.id="ph-fx-canvas-v5";
  document.body.prepend(canvas);

  const status=document.createElement("div");
  status.id="ph-fx-status-v5";
  status.textContent="SESSÃO // CANAL INSTÁVEL";
  document.body.appendChild(status);

  const ctx=canvas.getContext("2d");
  const glyphs="01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*<>/\\\\[]{}";
  let drops=[],cols=0,w=0,h=0,fs=15,last=0;

  function resize(){
    const dpr=Math.min(devicePixelRatio||1,2);
    w=innerWidth;h=innerHeight;
    fs=w<560?13:15;

    canvas.width=Math.max(1,Math.floor(w*dpr));
    canvas.height=Math.max(1,Math.floor(h*dpr));
    canvas.style.width=w+"px";
    canvas.style.height=h+"px";

    ctx.setTransform(dpr,0,0,dpr,0,0);
    cols=Math.ceil(w/fs);
    drops=Array.from({length:cols},(_,i)=>drops[i]??Math.random()*-36);
  }

  function draw(now){
    if(now-last>40){
      last=now;

      ctx.fillStyle="rgba(0,0,0,.115)";
      ctx.fillRect(0,0,w,h);
      ctx.font=fs+'px "Courier New",monospace';

      for(let i=0;i<cols;i++){
        ctx.fillStyle=Math.random()>.976
          ?"rgba(225,255,232,.46)"
          :"rgba(105,255,150,.27)";

        ctx.fillText(
          glyphs[(Math.random()*glyphs.length)|0],
          i*fs,
          drops[i]*fs
        );

        if(drops[i]*fs>h && Math.random()>.976){
          drops[i]=Math.random()*-15;
        }

        drops[i]+=.27+Math.random()*.25;
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  requestAnimationFrame(draw);
  addEventListener("resize",resize,{passive:true});

  const statuses=[
    "SESSÃO // CANAL INSTÁVEL",
    "ROTA // ISOLADA",
    "SINAL // INTERCEPTADO",
    "TRACE // INDISPONÍVEL"
  ];

  setInterval(()=>{
    status.textContent=statuses[(Math.random()*statuses.length)|0];
  },1800);

  function transitionTo(url,message){
    if(!url)return;

    if(window.PhantasmaAudio){
      PhantasmaAudio.play("click",.12);
    }

    const overlay=document.createElement("div");
    overlay.className="ph-route-v5";

    overlay.innerHTML=`
      <div class="ph-route-card-v5">
        <div class="ph-route-tag-v5">SESSÃO // ALTERAÇÃO DE ESTADO</div>

        <div class="ph-route-message-v5"></div>

        <div class="ph-route-meta-v5">
          <span class="ph-route-label-v5">&gt; validando transferência...</span>
          <strong class="ph-route-pct-v5">0%</strong>
        </div>

        <div class="ph-route-track-v5">
          <div class="ph-route-fill-v5"></div>
        </div>

        <div class="ph-route-foot-v5">
          preservando contexto da sessão...
        </div>
      </div>
    `;

    const msg=overlay.querySelector(".ph-route-message-v5");
    const label=overlay.querySelector(".ph-route-label-v5");
    const pct=overlay.querySelector(".ph-route-pct-v5");
    const fill=overlay.querySelector(".ph-route-fill-v5");
    const foot=overlay.querySelector(".ph-route-foot-v5");

    msg.textContent=message || "> RECONFIGURANDO ROTA...";

    document.body.appendChild(overlay);

    requestAnimationFrame(()=>{
      overlay.classList.add("show");

      requestAnimationFrame(()=>{
        fill.style.width="100%";
      });
    });

    const started=performance.now();

    function progress(now){
      const p=Math.min(1,(now-started)/1750);
      const value=Math.round((1-Math.pow(1-p,2.2))*100);
      pct.textContent=value+"%";

      if(value<36){
        label.textContent="> validando transferência...";
        foot.textContent="preservando contexto da sessão...";
      }else if(value<72){
        label.textContent="> sincronizando destino...";
        foot.textContent="rota restrita // conexão estável";
      }else if(value<100){
        label.textContent="> concluindo operação...";
        foot.textContent="controle da sessão mantido";
      }else{
        label.textContent="> transferência concluída.";
        foot.textContent="abrindo próximo estado...";
      }

      if(p<1){
        requestAnimationFrame(progress);
      }
    }

    requestAnimationFrame(progress);

    setTimeout(()=>{
      location.href=url;
    },FX_TIMING.transicaoPagina);
  }

  window.PhantasmaFX={transitionTo};

  document.addEventListener("click",event=>{
    const a=event.target.closest("a[href]");

    if(
      !a ||
      a.target==="_blank" ||
      a.hasAttribute("download")
    ) return;

    const href=a.getAttribute("href");

    if(
      !href ||
      href.startsWith("#") ||
      href.startsWith("javascript:")
    ) return;

    event.preventDefault();
    transitionTo(href,"> ROTA AUTORIZADA // TRANSFERINDO SESSÃO");
  });
})();