document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loginBtn').addEventListener('click', async () => {
    const username = document.getElementById('username').value.trim();
    const token = document.getElementById('token').value.trim();
    const status = document.getElementById('status');
    
    // Clear previous status messages
    status.textContent = "";
    
    // Check if username and token are provided
    if (!username || !token) {
      status.textContent = "Please fill in both fields.";
      status.style.color = "orange";
      return;
    }
    
    try {
      // Send login request to the backend
      const response = await fetch('https://monya07.pythonanywhere.com/api/user-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, token }),
        credentials: 'include'
      });
      
      // Check if the response is not OK (status code outside 200-299)
      if (!response.ok) {
        const errorData = await response.json(); // Get JSON error response
        console.error("Error response from server:", errorData);
        status.textContent = `Server Error: ${response.status} - ${errorData.message || "Unknown error"}`;
        status.style.color = "red";
        return;
      }
      
      // Parse the response JSON
      const data = await response.json();
      
      // If login is successful, redirect to protected page
      if (data.success) {
        localStorage.setItem('isAuthenticated', 'true');
        window.location.href = "dashboard.html";
      } else {
        status.textContent = data.message || "Access Denied!";
        status.style.color = "red";
      }
    } catch (error) {
      // If an error occurs during fetch
      status.textContent = "Server error!";
      status.style.color = "red";
      console.error("Fetch error:", error);
    }
  });
});