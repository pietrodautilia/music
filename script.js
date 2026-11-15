const triggerBottoni = document.querySelectorAll('[data-target]');
const finestre = document.querySelectorAll('.window');
const bottoniChiudi = document.querySelectorAll('.close-btn');
const finestraVideo = document.getElementById('win-video');
const youtubeIframe = document.getElementById('youtube-iframe');

function chiudiTutteLeFinestre() {
  // Se la finestra video era aperta, ferma la riproduzione resettando l'iframe
  if (finestraVideo && finestraVideo.classList.contains('aperta') && youtubeIframe) {
    youtubeIframe.src = youtubeIframe.src;
  }
  finestre.forEach(finestra => finestra.classList.remove('aperta'));
}

// Apertura finestre dalle cartelle o dalla taskbar
triggerBottoni.forEach(bottone => {
  bottone.addEventListener('click', (evento) => {
    evento.stopPropagation();
    chiudiTutteLeFinestre();

    const idFinestra = bottone.getAttribute('data-target');
    const finestraDaAprire = document.getElementById(idFinestra);
    if (finestraDaAprire) {
      finestraDaAprire.classList.add('aperta');
    }
  });
});

// Chiusura con X
bottoniChiudi.forEach(bottone => {
  bottone.addEventListener('click', chiudiTutteLeFinestre);
});

// Chiusura cliccando sullo sfondo nero o premendo ESC
document.getElementById('desktop').addEventListener('click', (evento) => {
  if (evento.target.id === 'desktop') {
    chiudiTutteLeFinestre();
  }
});

document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape') {
    chiudiTutteLeFinestre();
  }
});

// Orologio
function aggiornaOrologio() {
  const ora = new Date();
  const ore = String(ora.getHours()).padStart(2, '0');
  const minuti = String(ora.getMinutes()).padStart(2, '0');
  document.getElementById('orologio').textContent = `${ore}:${minuti}`;
}

aggiornaOrologio();
setInterval(aggiornaOrologio, 1000);