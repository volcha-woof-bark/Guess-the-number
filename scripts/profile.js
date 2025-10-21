document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.endsWith('profile.html')) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      window.location.href = 'login.html';
      return;
    }

    const form = document.getElementById('profileForm');
    const originalData = { ...currentUser };
    const originalUsername = currentUser.username;
    const originalEmail = currentUser.email;

    Object.keys(originalData).forEach(key => {
      if (form[key]) {
        form[key].value = originalData[key] || '';
      }
    });

    let isDirty = false;

    form.addEventListener('input', () => {
      isDirty = true;
    });

    document.getElementById('saveBtn').addEventListener('click', () => {
      const formData = new FormData(form);
      const updatedUser = {};
      for (let [key, value] of formData.entries()) {
        updatedUser[key] = value;
      }

      const newUsername = updatedUser.username?.trim();
      const newEmail = updatedUser.email?.trim();

      if (!newUsername || !newEmail) {
        alert('Логин и email обязательны.');
        return;
      }

      const users = JSON.parse(localStorage.getItem('users') || '[]');

      const loginExists = users.some(user =>
        user.username === newUsername && user.username !== originalUsername
      );

      const emailExists = users.some(user =>
        user.email === newEmail && user.email !== originalEmail
      );

      if (loginExists) {
        alert('Пользователь с таким логином уже существует!');
        return;
      }

      if (emailExists) {
        alert('Пользователь с таким email уже существует!');
        return;
      }


      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      const updatedUsers = users.map(user => {
        if (user.username === originalUsername) {
          return updatedUser;
        }
        return user;
      });

      localStorage.setItem('users', JSON.stringify(updatedUsers));

      isDirty = false;
      alert('Данные успешно сохранены!');
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
      Object.keys(originalData).forEach(key => {
        if (form[key]) {
          form[key].value = originalData[key] || '';
        }
      });
      isDirty = false;
    });

    window.addEventListener('beforeunload', (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    });

    document.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        if (isDirty && !link.href.includes('profile.html')) {
          e.preventDefault();
          if (confirm('Изменения не сохранены. Вы действительно хотите покинуть страницу без сохранения?')) {
            window.location.href = link.href;
          }
        }
      });
    });
  }
});