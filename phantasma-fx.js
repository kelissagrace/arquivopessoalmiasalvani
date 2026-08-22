(() => {
  if(window.__PHANTASMA_FX_V6__) return;
  window.__PHANTASMA_FX_V6__ = true;

  const style=document.createElement("style");
  style.textContent=`
    #ph-matrix-v6{
      position:fixed;
      inset:0;
      width:100%;
      height:100%;
      z-index:0;
      pointer-events:none;
      opacity:.18;
    }

    .ph-page-fade-v6{
      position:fixed;
      inset:0;
      z-index:10000;
      pointer-events:none;
      background:#000;
      opacity:0;
      transition:opacity .52s cubic-bezier(.22,.8,.22,1);
    }

    .ph-page-fade-v6.show{
      opacity:1;
    }
  `;
  document.head.appendChild(style);

  /* Matrix ambiente discreta. Não é uma tela de transição. */
  const canvas=document.createElement("canvas");
  canvas.id="ph-matrix-v6";
  document.body.prepend(canvas);

  const ctx=canvas.getContext("2d");
  const glyphs="01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*<>/\\\\[]{}";
  let drops=[],cols=0,w=0,h=0,fs=15,last=0;

  function resize(){
    const dpr=Math.min(devicePixelRatio||1,2);
    w=innerWidth;
    h=innerHeight;
    fs=w<560?13:15;

    canvas.width=Math.max(1,Math.floor(w*dpr));
    canvas.height=Math.max(1,Math.floor(h*dpr));
    canvas.style.width=w+"px";
    canvas.style.height=h+"px";

    ctx.setTransform(dpr,0,0,dpr,0,0);

    cols=Math.ceil(w/fs);
    drops=Array.from(
      {length:cols},
      (_,i)=>drops[i] ?? Math.random()*-35
    );
  }

  function draw(now){
    if(now-last>42){
      last=now;

      ctx.fillStyle="rgba(0,0,0,.12)";
      ctx.fillRect(0,0,w,h);
      ctx.font=fs+'px "Courier New",monospace';

      for(let i=0;i<cols;i++){
        ctx.fillStyle=Math.random()>.98
          ?"rgba(225,255,232,.38)"
          :"rgba(105,255,150,.22)";

        ctx.fillText(
          glyphs[(Math.random()*glyphs.length)|0],
          i*fs,
          drops[i]*fs
        );

        if(drops[i]*fs>h && Math.random()>.978){
          drops[i]=Math.random()*-14;
        }

        drops[i]+=.24+Math.random()*.22;
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  requestAnimationFrame(draw);
  addEventListener("resize",resize,{passive:true});

  /*
    V6:
    transitionTo NÃO cria painel, barra, porcentagem, mensagem ou
    "SESSÃO // ALTERAÇÃO DE ESTADO".
    Apenas escurece suavemente a página e abre a próxima.
  */
  function transitionTo(url){
    if(!url) return;

    if(window.PhantasmaAudio){
      PhantasmaAudio.play("click",.08);
    }

    const fade=document.createElement("div");
    fade.className="ph-page-fade-v6";
    document.body.appendChild(fade);

    requestAnimationFrame(()=>{
      fade.classList.add("show");
    });

    setTimeout(()=>{
      location.href=url;
    },560);
  }

  window.PhantasmaFX={transitionTo};
})();