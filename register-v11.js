(()=>{
  const $=id=>document.getElementById(id);
  const normalizeUsername=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'.').replace(/[^a-z0-9._-]/g,'').replace(/^[._-]+|[._-]+$/g,'');
  const usernameToEmail=value=>{
    const raw=String(value||'').trim().toLowerCase();
    if(raw.includes('@')) return raw;
    const u=normalizeUsername(raw);
    return u ? `magds.${u}@example.com` : '';
  };
  window.cloudSignUp=async function(){
    const name=($('cloudName')?.value||'').trim();
    const username=normalizeUsername($('cloudEmail')?.value||'');
    const password=$('cloudPassword')?.value||'';
    const err=$('cloudError');
    if(!err) return;
    err.style.color='var(--danger)'; err.textContent='';
    if(!name||!username||!password){err.textContent='Inserisci nome e cognome, nome utente e password.';return;}
    if(username.length<3){err.textContent='Il nome utente deve avere almeno 3 caratteri.';return;}
    if(password.length<8){err.textContent='Usa una password di almeno 8 caratteri.';return;}
    try{
      const {data,error}=await window.sbClient.functions.invoke('register-user',{body:{name,username,password}});
      if(error) throw error;
      if(!data?.ok){
        if(data?.error==='username_used') err.textContent='Questo nome utente è già utilizzato.';
        else err.textContent='Creazione account non riuscita. Riprova.';
        return;
      }
      err.style.color='var(--green-dark)';
      err.textContent='Account creato. Ora puoi accedere con nome utente e password. Attendi l’approvazione dell’amministratore.';
    }catch(e){
      console.error(e);
      err.textContent='Creazione account non riuscita. Riprova.';
    }
  };
  window.cloudSignIn=async function(){
    const loginId=($('cloudEmail')?.value||'').trim();
    const password=$('cloudPassword')?.value||'';
    const err=$('cloudError');
    if(!err) return;
    err.style.color='var(--danger)'; err.textContent='';
    if(!loginId||!password){err.textContent='Inserisci nome utente e password.';return;}
    const email=usernameToEmail(loginId);
    const {data,error}=await window.sbClient.auth.signInWithPassword({email,password});
    if(error){err.textContent='Nome utente o password non corretti.';return;}
    window.setAuthRequired(false); window.closeCloudLogin();
    if(data.user) await window.startCloud(data.user);
  };
})();
