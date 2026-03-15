/* ============================================
   TOAST — Notificaciones centralizadas
   ============================================ */

function showToast(message, type) {
  type = type || 'success';
  var container = document.getElementById('toasts');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toasts';
    document.body.appendChild(container);
  }

  var icons = { success: '\u2705', error: '\u274c', warning: '\u26a0\ufe0f' };
  var toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.innerHTML = '<span class="toast-icon">' + (icons[type] || '') + '</span><span class="toast-msg">' + message + '</span>';
  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(function() { toast.classList.add('show'); });

  setTimeout(function() {
    toast.classList.remove('show');
    setTimeout(function() { toast.remove(); }, 300);
  }, 3000);
}
