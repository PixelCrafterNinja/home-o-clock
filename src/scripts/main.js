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

    // Theme switcher logic
document.addEventListener('DOMContentLoaded', () => {
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
  
  applyTheme(prefersDark.matches);
  
  themeToggle.addEventListener('change', (e) => {
    document.body.classList.toggle('dark-mode', e.target.checked);
  });
  
  // Help Modal Logic
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
