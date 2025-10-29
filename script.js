// Handle showing/hiding password
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  input.type = input.type === "password" ? "text" : "password";
}

// ========== LOGIN AND CREATE ACCOUNT LOGIC ========== //
const users = JSON.parse(localStorage.getItem("users")) || [];

function createAccount() {
  const phone = document.getElementById("signupPhone").value.trim();
  const password = document.getElementById("signupPassword").value.trim();
  const confirm = document.getElementById("signupConfirm").value.trim();

  if (!phone || !password || !confirm) {
    alert("Please fill in all fields.");
    return;
  }
  if (password !== confirm) {
    alert("Passwords do not match.");
    return;
  }

  const exists = users.find(u => u.phone === phone);
  if (exists) {
    alert("Account already exists.");
    return;
  }

  users.push({ phone, password });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Account created! Please login.");
  window.location.href = "index.html";
}

function login() {
  const phone = document.getElementById("loginPhone").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  const user = users.find(u => u.phone === phone && u.password === password);

  if (user) {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    window.location.href = "chat.html";
  } else {
    alert("Invalid credentials.");
  }
}

// ========== CHAT PAGE LOGIC ========== //
async function sendMessage() {
  const messageInput = document.getElementById("messageInput");
  const chatBox = document.getElementById("chatBox");

  const userMessage = messageInput.value.trim();
  if (!userMessage) return;

  // Add user message
  const userDiv = document.createElement("div");
  userDiv.className = "message user";
  userDiv.textContent = "🧍 You: " + userMessage;
  chatBox.appendChild(userDiv);

  messageInput.value = "";

  try {
    // Send message to local backend
    const response = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await response.json();

    const aiDiv = document.createElement("div");
    aiDiv.className = "message ai";
    aiDiv.textContent = "🤖 Theo: " + data.reply;
    chatBox.appendChild(aiDiv);

    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (error) {
    console.error("Error talking to AI:", error);
    const errDiv = document.createElement("div");
    errDiv.className = "message error";
    errDiv.textContent = "⚠️ Connection error. Is the AI server running?";
    chatBox.appendChild(errDiv);
  }
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}
