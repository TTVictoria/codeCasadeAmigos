const passwordInput = document.getElementById('passwordInput');
  const loginButton = document.getElementById('loginButton');
  const errorMessage = document.getElementById('errorMessage');

  const correctPassword = '12345'; // ← здесь твой реальный пароль

  function checkPasswordAndLogin() {
    const password = passwordInput.value.trim();

    if (password === correctPassword) {
      window.location.href = './admin.html';
    } else {
      errorMessage.textContent = 'Невірний пароль';
    }
  }

  loginButton.addEventListener('click', function (event) {
    event.preventDefault();
    checkPasswordAndLogin();
  });

  passwordInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      checkPasswordAndLogin();
    }
  }
);

 togglePassword.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
  });