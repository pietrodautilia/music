// 1. Selezioniamo tutte le icone e tutte le finestre
const icone = document.querySelectorAll('.app-icon');
const finestre = document.querySelectorAll('.window');
const bottoniChiudi = document.querySelectorAll('.close-btn');

// Funzione per chiudere tutte le finestre aperte
function chiudiTutteLeFinestre() {
  finestre.forEach(finestra => finestra.classList.remove('aperta'));
}

// 2. Quando clicchi su un'icona, apre la finestra corrispondente
icone.forEach(icona => {
  icona.addEventListener('click', (evento) => {
    evento.stopPropagation(); // Evita che il click chiuda subito la finestra
    chiudiTutteLeFinestre();
    
    const idFinestra = icona.getAttribute('data-target');
    const finestraDaAprire = document.getElementById(idFinestra);
    if (finestraDaAprire) {
      finestraDaAprire.classList.add('aperta');
    }
  });
});

// 3. Chiudi cliccando sulla X rossa
bottoniChiudi.forEach(bottone => {
  bottone.addEventListener('click', chiudiTutteLeFinestre);
});

// 4. Chiudi cliccando sullo sfondo vuoto dello schermo o premendo ESC
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

// 5. Orologio nella barra inferiore
function aggiornaOrologio() {
  const ora = new Date();
  const ore = String(ora.getHours()).padStart(2, '0');
  const minuti = String(ora.getMinutes()).padStart(2, '0');
  document.getElementById('orologio').textContent = `${ore}:${minuti}`;
}

aggiornaOrologio();
setInterval(aggiornaOrologio, 1000);