
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

const chatContainer = document.querySelector(".container");
const chatDisplay = document.getElementById("messages");
const userInput = document.getElementById("input");
const sendButton = document.querySelector(".send-btn");
const sidePanel = document.getElementById("side-panel");
const menuButton = document.querySelector(".hamburger-menu");
const closeBtn = document.querySelector(".close-btn");

async function fetchGroqData(messages) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",tu
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: messages,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Sorry, I encountered an error. Please try again later.");
  }
}

function appendMessage(content, isUser = false) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", isUser ? "user-message" : "bot-message");
  messageElement.textContent = content;

  if (!isUser) {
    const optionsDiv = document.createElement("div");
    optionsDiv.classList.add("message-options");

    const copyIcon = document.createElement("i");
    copyIcon.className = "fas fa-copy";
    copyIcon.title = "Copy";
    copyIcon.addEventListener("click", () => {
      navigator.clipboard.writeText(content);
      alert("Copied to clipboard!");
    });

    const listenIcon = document.createElement("i");
    listenIcon.className = "fas fa-volume-up";
    listenIcon.title = "Listen";
    listenIcon.addEventListener("click", () => {
      const utterance = new SpeechSynthesisUtterance(content);
      speechSynthesis.speak(utterance);
    });

    optionsDiv.appendChild(copyIcon);
    optionsDiv.appendChild(listenIcon);
    messageElement.appendChild(optionsDiv);
  }

  chatDisplay.appendChild(messageElement);
  chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

function handleUserInput() {
  const userMessage = userInput.value.trim();
  if (userMessage) {
    appendMessage(userMessage, true);
    userInput.value = "";

    fetchGroqData([
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: userMessage },
    ])
      .then((botResponse) => appendMessage(botResponse))
      .catch((error) => appendMessage(error.message));
  }
}

menuButton.addEventListener("click", () => {
  sidePanel.style.left = "0";
  chatContainer.style.marginLeft = "250px";
});

closeBtn.addEventListener("click", () => {
  sidePanel.style.left = "-250px";
  chatContainer.style.marginLeft = "0";
});

sendButton.addEventListener("click", handleUserInput);
userInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    handleUserInput();
  }
});
