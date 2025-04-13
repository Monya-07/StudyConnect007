document.addEventListener('DOMContentLoaded', () => {
  const API_BASE = "https://monya07.pythonanywhere.com/api";
  
  // ==== Admin Login ====
  const loginBtn = document.getElementById('loginButton');
  if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
      const username = document.getElementById('adminUsername').value;
      const password = document.getElementById('adminPassword').value;
      const status = document.getElementById('loginStatus');
      
      const response = await fetch(`${API_BASE}/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        localStorage.setItem('admin-auth', 'true'); // optional
        window.location.href = "admin-dashboard.html";
      } else {
        status.textContent = "Invalid credentials!";
      }
    });
  }
  
  // ==== Session Check for Dashboard ====
  if (window.location.pathname.includes("admin-dashboard.html")) {
    fetch(`${API_BASE}/check-session`, {
        credentials: "include",
      })
      .then((res) => res.json())
      .then((data) => {
        if (!data.loggedIn) {
          window.location.href = "admin-login.html";
        } else {
          loadRecentTokens();
          loadRecentLogins();
        }
      })
      .catch(() => {
        window.location.href = "admin-login.html";
      });
  }
  
  // ==== Token Generation ====
  const generateBtn = document.getElementById("generateTokenBtn");
  if (generateBtn) {
    generateBtn.addEventListener("click", generateToken);
  }
  
  function generateToken() {
    const duration = document.getElementById("tokenDuration").value;
    const username = document.getElementById("tokenUsername").value;
    const status = document.getElementById("token-status");
    
    fetch(`${API_BASE}/generate-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ duration, username }),
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          status.textContent = `Token: ${data.token} (expires: ${data.expires_at})`;
          loadRecentTokens();
        } else {
          status.textContent = data.error || "Failed to generate token.";
        }
      })
      .catch(() => {
        status.textContent = "Error connecting to server.";
      });
  }
  
  // ==== Load Recent Tokens ====
  function loadRecentTokens() {
    fetch(`${API_BASE}/recent-tokens`, {
        credentials: "include"
      })
      .then((res) => res.json())
      .then((data) => {
        const container = document.getElementById("recent-tokens");
        if (data.tokens && data.tokens.length > 0) {
          container.innerHTML = data.tokens
            .map(
              (t) =>
              `<p>${t.username}: ${t.token} - Expires: ${t.expires}</p>`
            )
            .join("");
        } else {
          container.innerHTML = "<p>No tokens found.</p>";
        }
      });
  }
  
  // ==== Load Login History ====
  function loadRecentLogins() {
    fetch(`${API_BASE}/login-history`, {
        credentials: "include"
      })
      .then((res) => res.json())
      .then((data) => {
        const container = document.getElementById("recent-logins");
        if (data.logins && data.logins.length > 0) {
          container.innerHTML = data.logins
            .map(
              (log) =>
              `<p>${log.username} - ${log.device || "Unknown"} - ${log.time}</p>`
            )
            .join("");
        } else {
          container.innerHTML = "<p>No login logs found.</p>";
        }
      });
  }
  
  // ==== Logout ====
  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function(e) {
      e.preventDefault();
      fetch(`${API_BASE}/logout`, {
        credentials: "include",
      }).then(() => {
        localStorage.removeItem('admin-auth');
        window.location.href = "admin-login.html";
      });
    });
  }
});