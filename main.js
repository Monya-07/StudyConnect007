async function login() {
  const username = document.getElementById('username').value;
  const token = document.getElementById('token').value;
  
  const response = await fetch('https://monya07.pythonanywhere.com/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, token })
  });
  
  const data = await response.json();
  const status = document.getElementById('status');
  
  if (data.success) {
    localStorage.setItem('isAuthenticated', 'true'); // Store login status
    window.location.href = "protected.html";
  } else {
    status.textContent = "Access Denied!";
    status.style.color = "red";
  }
}