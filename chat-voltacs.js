// ===============================================================
//  VOLTACS — Bulle de discussion (agent de communication)
//  Parle au Worker Cloudflare voltacs-ia (adresse /chat) et envoie
//  la demande du client par e-mail via Web3Forms.
// ===============================================================
(function () {
  // Adresse de ton Worker Cloudflare (sans / à la fin)
  const WORKER = 'https://voltacs-ai.acsinteedwardy.workers.dev';
  const CLE_WEB3FORMS = '789e1c90-6403-40bf-ade0-164f767cdda7';

  const css = `
  #vx-bouton { position:fixed; right:20px; bottom:20px; z-index:4000; width:62px; height:62px; border:none; cursor:pointer;
    background:#ffffff; color:#07090e; clip-path:polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    display:flex; align-items:center; justify-content:center; transition:background-color .3s, transform .2s; }
  #vx-bouton:hover { background:#00f6ff; transform:translateY(-2px); }
  #vx-bouton svg { width:28px; height:28px; }
  #vx-bulle-info { position:fixed; right:92px; bottom:34px; z-index:4000; background:#0f131a; color:#fff; border:1px solid #1e2633;
    padding:8px 14px; font:600 13px 'Segoe UI',Tahoma,Geneva,Verdana,sans-serif; letter-spacing:.5px; cursor:pointer;
    box-shadow:0 0 18px rgba(0,210,255,.15); animation:vx-apparait .4s ease; }
  #vx-fenetre { position:fixed; right:20px; bottom:96px; z-index:4000; width:370px; max-width:calc(100vw - 32px); height:540px;
    max-height:calc(100vh - 120px); background:#07090e; border:1px solid #1e2633; display:none; flex-direction:column;
    box-shadow:0 0 40px rgba(0,210,255,.15); font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif; color:#fff; animation:vx-apparait .25s ease; }
  #vx-fenetre.ouvert { display:flex; }
  @keyframes vx-apparait { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
  .vx-tete { padding:14px 16px; border-bottom:1px solid #1e2633; display:flex; align-items:center; gap:10px; }
  .vx-tete b { font-size:15px; letter-spacing:2px; text-transform:uppercase; }
  .vx-tete small { display:block; color:#2ee59d; font-size:12px; letter-spacing:0; text-transform:none; font-weight:400; }
  .vx-tete button { margin-left:auto; background:none; border:none; color:#8e98a8; font-size:22px; cursor:pointer; line-height:1; }
  .vx-tete button:hover { color:#fff; }
  #vx-fil { flex:1; overflow-y:auto; padding:16px; display:flex; flex-direction:column; gap:10px; }
  .vx-msg { max-width:85%; padding:10px 14px; font-size:14px; line-height:1.5; white-space:pre-wrap; word-wrap:break-word; }
  .vx-ia { align-self:flex-start; background:#0f131a; border:1px solid #1e2633; }
  .vx-moi { align-self:flex-end; background:#ffffff; color:#07090e; }
  .vx-ok { align-self:center; color:#2ee59d; font-size:12px; text-align:center; }
  .vx-erreur { align-self:center; color:#ff5c5c; font-size:12px; text-align:center; }
  .vx-points span { display:inline-block; width:6px; height:6px; margin:0 2px; background:#8e98a8; border-radius:50%; animation:vx-saute 1s infinite; }
  .vx-points span:nth-child(2) { animation-delay:.15s; } .vx-points span:nth-child(3) { animation-delay:.3s; }
  @keyframes vx-saute { 0%,60%,100% { opacity:.3; } 30% { opacity:1; } }
  #vx-form { display:flex; gap:8px; padding:12px; border-top:1px solid #1e2633; }
  #vx-texte { flex:1; resize:none; height:44px; background:#0f131a; color:#fff; border:1px solid #1e2633; padding:10px 12px;
    font:inherit; font-size:14px; outline:none; }
  #vx-texte:focus { border-color:#00d2ff; box-shadow:0 0 0 3px rgba(0,210,255,.12), 0 0 18px rgba(0,210,255,.12); }
  #vx-envoyer { background:#fff; color:#07090e; border:none; padding:0 20px; font:700 13px 'Segoe UI',Tahoma,sans-serif;
    text-transform:uppercase; letter-spacing:2px; cursor:pointer; clip-path:polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
    transition:background-color .3s, box-shadow .3s; }
  #vx-envoyer:hover { background:#00f6ff; box-shadow:0 0 30px rgba(0,246,255,.35); }
  #vx-envoyer:disabled { opacity:.6; cursor:wait; }
  .vx-mention { padding:0 12px 10px; color:#8e98a8; font-size:11px; text-align:center; }
  @media (max-width:600px) {
    #vx-fenetre { right:0; bottom:0; width:100vw; max-width:100vw; height:100%; max-height:100%; border:none; }
    #vx-bouton { right:16px; bottom:16px; }
    #vx-bulle-info { display:none !important; }
  }`;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const eclair = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>';
  const zone = document.createElement('div');
  zone.innerHTML = `
    <div id="vx-bulle-info">Une question ? Discutons ⚡</div>
    <button id="vx-bouton" aria-label="Ouvrir la discussion">${eclair}</button>
    <div id="vx-fenetre" role="dialog" aria-label="Discussion VOLTACS">
      <div class="vx-tete">
        <div><b>VOLTACS</b><small>● Assistant en ligne</small></div>
        <button id="vx-fermer" aria-label="Fermer">×</button>
      </div>
      <div id="vx-fil"></div>
      <form id="vx-form">
        <textarea id="vx-texte" placeholder="Décrivez votre besoin…" maxlength="1500"></textarea>
        <button id="vx-envoyer" type="submit">Envoyer</button>
      </form>
      <div class="vx-mention">Assistant automatique · Edwardy vous recontacte personnellement</div>
    </div>`;
  document.body.appendChild(zone);

  const fenetre = document.getElementById('vx-fenetre');
  const fil = document.getElementById('vx-fil');
  const texte = document.getElementById('vx-texte');
  const envoyer = document.getElementById('vx-envoyer');
  const info = document.getElementById('vx-bulle-info');
  let historique = [];
  let accueilFait = false;

  function ajouter(contenu, classe) {
    const d = document.createElement('div');
    d.className = 'vx-msg ' + classe;
    d.textContent = contenu;
    fil.appendChild(d);
    fil.scrollTop = fil.scrollHeight;
    return d;
  }

  function ouvrir() {
    fenetre.classList.add('ouvert');
    info.style.display = 'none';
    if (!accueilFait) {
      accueilFait = true;
      const accueil = "Bonjour 👋 Je suis l'assistant de VOLTACS. Panne, installation, rénovation ou domotique : décrivez-moi votre besoin, et Edwardy vous recontacte rapidement.";
      ajouter(accueil, 'vx-ia');
      historique.push({ role: 'assistant', content: accueil });
    }
    setTimeout(() => texte.focus(), 50);
  }
  document.getElementById('vx-bouton').onclick = () => fenetre.classList.contains('ouvert') ? fenetre.classList.remove('ouvert') : ouvrir();
  info.onclick = ouvrir;
  document.getElementById('vx-fermer').onclick = () => fenetre.classList.remove('ouvert');
  setTimeout(() => { if (!fenetre.classList.contains('ouvert')) info.style.display = 'none'; }, 15000);

  async function envoyerMail(d) {
    const transcription = historique.map(m => (m.role === 'user' ? 'Client : ' : 'Assistant : ') + m.content).join('\n\n');
    const corps = {
      access_key: CLE_WEB3FORMS,
      subject: '[VOLTACS] Demande via le chat – ' + (d.nom || 'Client'),
      from_name: 'Chat VOLTACS',
      name: d.nom || '',
      phone: d.telephone || '',
      commune: d.commune || '',
      type_travaux: d.type_travaux || '',
      urgence: d.urgence || '',
      disponibilites: d.disponibilites || '',
      message: d.description || '',
      conversation: transcription,
    };
    const r = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(corps),
    });
    const res = await r.json();
    if (!r.ok || !res.success) throw new Error(res.message || 'Erreur');
  }

  texte.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); document.getElementById('vx-form').requestSubmit(); }
  });

  document.getElementById('vx-form').onsubmit = async e => {
    e.preventDefault();
    const question = texte.value.trim();
    if (!question) return;
    texte.value = '';
    ajouter(question, 'vx-moi');
    historique.push({ role: 'user', content: question });
    envoyer.disabled = true;
    const attente = ajouter('', 'vx-ia vx-points');
    attente.innerHTML = '<span></span><span></span><span></span>';
    try {
      const r = await fetch(WORKER + '/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: historique }),
      });
      const data = await r.json();
      attente.className = 'vx-msg vx-ia';
      attente.textContent = data.reponse;
      historique.push({ role: 'assistant', content: data.reponse });
      if (data.demande) {
        try {
          await envoyerMail(data.demande);
          ajouter('✓ Demande transmise à Edwardy', 'vx-ok');
        } catch (err) {
          ajouter("L'envoi automatique n'a pas abouti. Appelez directement le 0470 07 63 34.", 'vx-erreur');
        }
      }
    } catch (err) {
      attente.className = 'vx-msg vx-ia';
      attente.textContent = 'Connexion impossible pour le moment. Appelez directement le 0470 07 63 34.';
      historique.pop();
    }
    envoyer.disabled = false;
    texte.focus();
  };
})();
