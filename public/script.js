const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

function appendMessage(role, text) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", `${role}`);
  messageElement.textContent = text;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
  return messageElement;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage("user", userMessage);
  input.value = "";
  input.focus();

  const thinkingMessage = appendMessage("bot", "Thinking...");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [{ role: "user", text: userMessage }],
      }),
    });

    if (!response.ok) {
      thinkingMessage.textContent = "Failed to get response from server.";
      return;
    }

    const data = await response.json();

    if (data.result) {
      thinkingMessage.textContent = data.result;
    } else {
      thinkingMessage.textContent = "Sorry, no response received.";
    }
  } catch (error) {
    console.error("Error:", error);
    thinkingMessage.textContent = "Failed to get response from server.";
  }
});
