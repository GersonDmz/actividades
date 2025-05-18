// Actualizar reloj y fecha
function updateClock() {
    const now = new Date();
  
    // Formatear hora (12h)
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // El '0' se convierte en '12'
    hours = String(hours).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds} ${ampm}`;
  
    // Formatear fecha
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('es-ES', options);
  
    // Actualizar elementos
    document.getElementById('clock').textContent = timeString;
    document.getElementById('date').textContent = dateString;
  
    // Actualizar estado de actividades según la hora actual
    updateActivityStatus(now);
  }
  
  // Actualizar estado de las actividades (pasadas, actuales, próximas)
  function updateActivityStatus(now) {
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
  
    const activities = document.querySelectorAll('.actividad');
  
    activities.forEach(activity => {
      // Quitar clases previas
      activity.classList.remove('past', 'current');
  
      // Obtener la hora de la actividad
      const timeStr = activity.getAttribute('data-time');
      const [activityHour, activityMinute] = timeStr.split(':').map(Number);
      const activityTimeInMinutes = activityHour * 60 + activityMinute;
  
      // Determinar si la actividad es pasada
      if (activityTimeInMinutes < currentTimeInMinutes) {
        activity.classList.add('past');
      }
    });
  
    // Encontrar la actividad actual (la más próxima no pasada o la última actividad pasada)
    let currentActivity = null;
    let minTimeDiff = Infinity;
  
    activities.forEach(activity => {
      const timeStr = activity.getAttribute('data-time');
      const [activityHour, activityMinute] = timeStr.split(':').map(Number);
      const activityTimeInMinutes = activityHour * 60 + activityMinute;
  
      const timeDiff = activityTimeInMinutes - currentTimeInMinutes;
  
      // Si es la actividad actual o la próxima más cercana
      if ((timeDiff <= 0 && timeDiff > -60) || (timeDiff > 0 && timeDiff < minTimeDiff)) {
        if (timeDiff > 0) {
          minTimeDiff = timeDiff;
        }
        currentActivity = activity;
      }
    });
  
    // Marcar la actividad actual
    if (currentActivity) {
      currentActivity.classList.add('current');
      currentActivity.classList.remove('past'); // Priorizar estado "current" sobre "past"
    }
  }
  
  // Script para detectar cuando los elementos entran en el viewport
  document.addEventListener('DOMContentLoaded', function () {
    // Inicializar reloj
    updateClock();
    setInterval(updateClock, 1000);
  
    // Animación al hacer scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
  
    // Observar todos los elementos con la clase fade-in
    document.querySelectorAll('.fade-in').forEach(el => {
      observer.observe(el);
    });
  });
  