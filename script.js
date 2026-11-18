// === IMPOSTA QUI LA PASSWORD PER L'AREA RAP ===
const PASSWORD_RAP = 'paradox04';

const triggerBottoni = document.querySelectorAll('[data-target]');
const finestre = document.querySelectorAll('.window');
const bottoniChiudi = document.querySelectorAll('.close-btn');
const desktop = document.getElementById('desktop');

const startBtn = document.getElementById('start-btn');
const startMenu = document.getElementById('start-menu');

let zIndexAttuale = 20;
let contatoreApertura = 0;

function portaInPrimoPiano(finestra) {
  zIndexAttuale++;
  finestra.style.zIndex = zIndexAttuale;
}

function mantieniNeiBordi(finestra, leftDesiderato, topDesiderato) {
  const maxLeft = Math.max(8, desktop.clientWidth - finestra.offsetWidth - 8);
  const maxTop = Math.max(8, desktop.clientHeight - finestra.offsetHeight - 8);

  const leftSicuro = Math.min(Math.max(8, leftDesiderato), maxLeft);
  const topSicuro = Math.min(Math.max(8, topDesiderato), maxTop);

  finestra.style.left = `${leftSicuro}px`;
  finestra.style.top = `${topSicuro}px`;
}

function posizionaFinestra(finestra, indiceCascata = 0) {
  const isMobile = window.innerWidth < 600;
  const passo = isMobile ? 14 : 26;
  const offset = (indiceCascata % 5) * passo;

  finestra.style.transform = 'none';

  const centroX = (desktop.clientWidth - finestra.offsetWidth) / 2;
  const centroY = (desktop.clientHeight - finestra.offsetHeight) / 2;

  const baseOffset = isMobile ? -20 : -40;
  mantieniNeiBordi(finestra, centroX + baseOffset + offset, centroY + baseOffset + offset);
}

function fermaMedia(finestra) {
  const iframe = finestra.querySelector('iframe');
  if (iframe) {
    iframe.src = iframe.src;
  }
  finestra.querySelectorAll('video, audio').forEach(media => {
    media.pause();
    media.currentTime = 0;
  });
}

function chiudiStartMenu() {
  if (!startMenu || !startBtn) return;
  startMenu.classList.remove('aperto');
  startBtn.setAttribute('aria-expanded', 'false');
}

// Apertura / chiusura Menu Start in basso a sinistra
if (startBtn && startMenu) {
  startBtn.addEventListener('click', (evento) => {
    evento.stopPropagation();
    const aperto = startMenu.classList.toggle('aperto');
    startBtn.setAttribute('aria-expanded', String(aperto));
  });

  document.addEventListener('pointerdown', (evento) => {
    if (!evento.target.closest('.taskbar-left')) {
      chiudiStartMenu();
    }
  });
}

// Inizializza finestre aperte all'ingresso
requestAnimationFrame(() => {
  finestre.forEach(finestra => {
    if (finestra.classList.contains('aperta')) {
      portaInPrimoPiano(finestra);
      posizionaFinestra(finestra, 0);
    }
  });
});

// Apertura finestre multiple (da icone desktop o voci del Menu Start)
triggerBottoni.forEach(bottone => {
  bottone.addEventListener('click', (evento) => {
    evento.stopPropagation();
    chiudiStartMenu();

    const idFinestra = bottone.getAttribute('data-target');
    const finestraDaAprire = document.getElementById(idFinestra);
    if (!finestraDaAprire) return;

    const giaAperta = finestraDaAprire.classList.contains('aperta');
    finestraDaAprire.classList.add('aperta');
    portaInPrimoPiano(finestraDaAprire);

    if (!giaAperta) {
      contatoreApertura++;
      posizionaFinestra(finestraDaAprire, contatoreApertura);
    }
  });
});

// Chiusura ESCLUSIVA tramite pulsante rosso (X)
bottoniChiudi.forEach(bottone => {
  bottone.addEventListener('click', (evento) => {
    evento.stopPropagation();
    const finestra = bottone.closest('.window');
    if (finestra) {
      fermaMedia(finestra);
      finestra.classList.remove('aperta');
    }
  });
});

// Primo piano + Trascinamento (Mouse e Touch)
finestre.forEach(finestra => {
  finestra.addEventListener('pointerdown', () => {
    portaInPrimoPiano(finestra);
  });

  const header = finestra.querySelector('.window-header');
  if (!header) return;

  let inTrascinamento = false;
  let startX = 0;
  let startY = 0;
  let startLeft = 0;
  let startTop = 0;

  header.addEventListener('pointerdown', (evento) => {
    if (evento.target.closest('.close-btn')) return;

    inTrascinamento = true;
    portaInPrimoPiano(finestra);

    startX = evento.clientX;
    startY = evento.clientY;
    startLeft = finestra.offsetLeft;
    startTop = finestra.offsetTop;

    header.setPointerCapture(evento.pointerId);
  });

  header.addEventListener('pointermove', (evento) => {
    if (!inTrascinamento) return;

    const deltaX = evento.clientX - startX;
    const deltaY = evento.clientY - startY;

    mantieniNeiBordi(finestra, startLeft + deltaX, startTop + deltaY);
  });

  const terminaTrascinamento = (evento) => {
    if (!inTrascinamento) return;
    inTrascinamento = false;
    if (header.hasPointerCapture(evento.pointerId)) {
      header.releasePointerCapture(evento.pointerId);
    }
  };

  header.addEventListener('pointerup', terminaTrascinamento);
  header.addEventListener('pointercancel', terminaTrascinamento);
});

// Gestione Password -> Sblocca le icone sul desktop
const rapForm = document.getElementById('rap-lock-form');
const rapInput = document.getElementById('rap-password-input');
const rapError = document.getElementById('rap-error');
const rapUnlockedMsg = document.getElementById('rap-unlocked-msg');
const finestraRap = document.getElementById('win-rap');
const iconeSegrete = document.querySelectorAll('.secret-icon');

if (rapForm && rapInput) {
  rapForm.addEventListener('submit', (evento) => {
    evento.preventDefault();

    if (rapInput.value.trim() === PASSWORD_RAP) {
      iconeSegrete.forEach(icona => {
        icona.hidden = false;
        icona.classList.add('sbloccata');
      });

      rapForm.hidden = true;
      if (rapError) rapError.hidden = true;
      if (rapUnlockedMsg) rapUnlockedMsg.hidden = false;
      if (finestraRap) finestraRap.classList.remove('aperta');
    } else {
      if (rapError) rapError.hidden = false;
      rapInput.value = '';
      rapInput.focus();
    }
  });
}

// Adatta finestre se si ruota lo schermo
window.addEventListener('resize', () => {
  finestre.forEach(finestra => {
    if (finestra.classList.contains('aperta')) {
      mantieniNeiBordi(finestra, finestra.offsetLeft, finestra.offsetTop);
    }
  });
});

// Orologio
function aggiornaOrologio() {
  const orologioEl = document.getElementById('orologio');
  if (!orologioEl) return;
  const ora = new Date();
  const ore = String(ora.getHours()).padStart(2, '0');
  const minuti = String(ora.getMinutes()).padStart(2, '0');
  orologioEl.textContent = `${ore}:${minuti}`;
}

aggiornaOrologio();
setInterval(aggiornaOrologio, 1000);