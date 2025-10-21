
function isAuthenticated() {
  return localStorage.getItem('currentUser') !== null;
}

function shouldRememberMe() {
  return localStorage.getItem('rememberMe') === 'true';
}

function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
  }
}

function logout() {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('rememberMe');
  window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop();

  const navLinks = {
    '../pages/main.html': 'Угадай число',
    '../pages/profile.html': 'Профиль',
    '../pages/login.html': 'Вход',
    '../pages/register.html': 'Регистрация'
  };

  const nav = document.querySelector('nav');
  if (nav) {
    nav.innerHTML = '';
    for (const [page, label] of Object.entries(navLinks)) {
      const link = document.createElement('a');
      link.href = page;
      link.textContent = label;
      if (page === currentPage) {
        link.style.fontWeight = 'bold';
        link.style.textDecoration = 'underline';
      }
      nav.appendChild(link);
    }

    if (isAuthenticated() && !['login.html', 'register.html'].includes(currentPage)) {
      const logoutBtn = document.createElement('a');
      logoutBtn.href = '#';
      logoutBtn.textContent = 'Выход';
      logoutBtn.style.marginLeft = '20px';
      logoutBtn.style.color = 'red';
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });
      nav.appendChild(logoutBtn);
    }
  }

  if (['main.html', 'profile.html'].includes(currentPage)) {
    requireAuth();
  }

  if (currentPage === 'login.html' && shouldRememberMe() && isAuthenticated()) {
    window.location.href = 'main.html';
  }
});