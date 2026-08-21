(() => {
  if (window.PhantasmaAudio) return;

  const ROOT = window.PHANTASMA_AUDIO_ROOT || "sons/";
  const FILES = {
    ambiente: ROOT+"ambiente.wav",
    acesso: ROOT+"acesso.wav",
    glitch: ROOT+"glitch.wav",
    erro: ROOT+"erro.wav",
    countdown: ROOT+"countdown.wav",
    agora: ROOT+"agora.wav",
    tiro: ROOT+"tiro.wav",
    tecla: ROOT+"tecla.wav",
    click: ROOT+"click.wav",
    revelacao: ROOT+"revelacao.wav"
  };

  let enabled = localStorage.getItem("phantasma_sound") !== "off";
  let unlocked = sessionStorage.getItem("phantasma_audio_unlocked") === "1";
  let ambient = null;

  const style = document.createElement("style");
  style.textContent = `
    #ph-sound-toggle{
      position:fixed;right:14px;bottom:14px;z-index:20000;
      width:auto!important;min-width:118px!important;min-height:0!important;
      margin:0!important;padding:9px 12px!important;
      border:1px solid rgba(109,255,152,.48)!important;
      background:rgba(0,0,0,.82)!important;color:#6dff98!important;
      font:11px "Courier New",monospace!important;letter-spacing:.08em!important;
      cursor:pointer!important;text-transform:uppercase!important;
      box-shadow:none!important;
    }
    #ph-sound-toggle.on{box-shadow:0 0 18px rgba(109,255,152,.16)!important}
  `;
  document.head.appendChild(style);

  const btn = document.createElement("button");
  btn.id = "ph-sound-toggle";
  btn.type = "button";
  document.body.appendChild(btn);

  function label(){
    btn.textContent = !enabled ? "SOM: OFF" : (unlocked ? "SOM: ON" : "SOM: ATIVAR");
    btn.classList.toggle("on", enabled && unlocked);
  }

  function ensureAmbient(){
    if (!enabled || !unlocked) return;
    if (!ambient){
      ambient = new Audio(FILES.ambiente);
      ambient.loop = true;
      ambient.volume = .10;
    }
    ambient.play().catch(()=>{});
  }

  function unlock(){
    unlocked = true;
    sessionStorage.setItem("phantasma_audio_unlocked","1");
    label();
    ensureAmbient();
  }

  function play(name, volume=.4){
    if (!enabled || !unlocked || !FILES[name]) return;
    const a = new Audio(FILES[name]);
    a.volume = volume;
    a.play().catch(()=>{});
  }

  btn.addEventListener("click",(e)=>{
    e.stopPropagation();
    if(!unlocked){
      enabled = true;
      unlock();
      localStorage.setItem("phantasma_sound","on");
      play("acesso",.28);
      return;
    }
    enabled = !enabled;
    localStorage.setItem("phantasma_sound", enabled ? "on" : "off");
    if(!enabled && ambient) ambient.pause();
    if(enabled){
      ensureAmbient();
      play("click",.22);
    }
    label();
  });

  document.addEventListener("pointerdown",(e)=>{
    if(e.target===btn) return;
    if(enabled && !unlocked) unlock();
  },{capture:true});

  // Tenta manter o som entre páginas depois da primeira interação.
  if(enabled && unlocked){
    setTimeout(ensureAmbient,80);
  }

  label();

  window.PhantasmaAudio = {
    play,
    unlock,
    startAmbient: ensureAmbient,
    isEnabled: () => enabled,
    isUnlocked: () => unlocked
  };
})();