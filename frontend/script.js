document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chat-box");
  const chatForm = document.getElementById("chat-form");
  const usernameInput = document.getElementById("username");
  const messageInput = document.getElementById("message");
  const errorMsg = document.getElementById("error-msg");

  // Get productId from URL query string
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("productId");

  if (!productId) {
    errorMsg.textContent = "⚠️ No product selected. Please open this page with ?productId=YOUR_PRODUCT_ID";
    chatForm.style.display = "none";
    return;
  }

  errorMsg.textContent = "";

  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // Fetch and display messages
  async function fetchMessages() {
    try {
      const res = await fetch(`http://localhost:3000/api/messages/${productId}`);
      console.log("Response Status:", res.status); // Log the status
      if (!res.ok) throw new Error(`Failed to load messages: ${res.status} ${res.statusText}`);
      const messages = await res.json();

      chatBox.innerHTML = messages
        .map(msg => `<p><strong>${escapeHtml(msg.username)}</strong>: ${escapeHtml(msg.message)}</p>`)
        .join("");

      chatBox.scrollTop = chatBox.scrollHeight;
    } catch (err) {
      console.error(err);
      errorMsg.textContent = "Error loading messages.";
    }
  }

  // Send new message
  chatForm.addEventListener("submit", async e => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const message = messageInput.value.trim();

    console.log("Username:", username);
    console.log("Message:", message);

    if (!username || !message) return;

    try {
      const res = await fetch("http://localhost:3000/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, username, message }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      messageInput.value = "";
      await fetchMessages();
    } catch (err) {
      console.error(err);
      errorMsg.textContent = "Error sending message.";
    }
  });

  // Initial fetch and auto-refresh every 2 seconds
  fetchMessages();
  setInterval(fetchMessages, 2000);
});
