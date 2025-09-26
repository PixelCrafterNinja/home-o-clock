function calcola() {
    const ingresso = document.getElementById("ingresso").value;
    const durataLavoro = document.getElementById("durataLavoro").value;
    const durataPausa = document.getElementById("pausa").value;
    
    if (!ingresso || !durataLavoro || !durataPausa) {
      document.getElementById("risultato").textContent = "❌ Inserisci tutti i campi richiesti!";
      return;
    }
    
    const [hIngresso, mIngresso] = ingresso.split(":").map(Number);
    const [oreLavoro, minutiLavoro] = durataLavoro.split(":").map(Number);
    const [orePausa, minutiPausa] = durataPausa.split(":").map(Number);
    
    const inizio = new Date();
    inizio.setHours(hIngresso, mIngresso, 0, 0);
    
    const msLavoro = (oreLavoro * 60 + minutiLavoro) * 60 * 1000;
    const msPausa = (orePausa * 60 + minutiPausa) * 60 * 1000;
    
    const uscita = new Date(inizio.getTime() + msLavoro + msPausa);
    const orarioUscita = uscita.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    
    document.getElementById("risultato").textContent = `Puoi uscire alle: ${orarioUscita}`;
    
    const notificheAbilitate = document.getElementById("notification-toggle").checked;
    
    if (notificheAbilitate) {
      // Notifica desktop
      if (Notification.permission === "granted") {
        scheduleNotification(uscita);
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            scheduleNotification(uscita);
          }
        });
      }
    }
}

function scheduleNotification(orario) {
  const now = new Date();
  const delay = orario - now;
  if (delay > 0) {
    setTimeout(() => {
      new Notification("È ora di andare a casa! 🕔");
    }, delay);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const calcolaBtn = document.getElementById('calcolaBtn');
  const durataLavoroInput = document.getElementById("durataLavoro");
  const durataPausaInput = document.getElementById("pausa");
  const ingressoInput = document.getElementById("ingresso");

  /**
   * Salva le impostazioni orarie nel localStorage con la data odierna.
   */
  function saveTimeSettings() {
    const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const settings = {
      date: today,
      durataLavoro: durataLavoroInput.value,
      pausa: durataPausaInput.value,
      ingresso: ingressoInput.value
    };
    localStorage.setItem('timeSettings', JSON.stringify(settings));
  }

  /**
   * Carica le impostazioni orarie se sono state salvate oggi.
   */
  function loadTimeSettings() {
    const today = new Date().toISOString().split('T')[0];
    const savedSettings = localStorage.getItem('timeSettings');

    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      if (settings.date === today) {
        durataLavoroInput.value = settings.durataLavoro;
        durataPausaInput.value = settings.pausa;
        ingressoInput.value = settings.ingresso;
      } else {
        // Se le impostazioni sono di un giorno precedente, le rimuovo
        localStorage.removeItem('timeSettings');
      }
    }
  }

  calcolaBtn.addEventListener('click', () => {
    calcola();
    saveTimeSettings(); // Salva le impostazioni dopo ogni calcolo
  });

  // Logica per il tema
  const themeToggle = document.getElementById('checkbox');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  function applyTheme(isDark) {
    if (isDark) {
      document.body.classList.add('dark-mode');
      themeToggle.checked = true;
    } else {
      document.body.classList.remove('dark-mode');
      themeToggle.checked = false;
    }
  }

  // Carica il tema salvato
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    applyTheme(savedTheme === 'dark');
  } else {
    applyTheme(prefersDark.matches);
  }

  themeToggle.addEventListener('change', (e) => {
    const isDark = e.target.checked;
    document.body.classList.toggle('dark-mode', isDark);
    // Salva la preferenza del tema
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // Carica le impostazioni orarie all'avvio
  loadTimeSettings();

  // Logica per la modale di aiuto
  const modal = document.getElementById("helpModal");
  const helpBtn = document.getElementById("helpBtn");
  const closeBtn = document.querySelector(".close-button");

  helpBtn.onclick = () => modal.style.display = "block";
  closeBtn.onclick = () => modal.style.display = "none";
  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
});
