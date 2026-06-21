async function sendMessage() {

    const input =
        document.getElementById("message");

    const message = input.value.trim();

    if (!message) return;

    const chatBox =
        document.getElementById("chat-box");

    chatBox.innerHTML +=
        `<div class="message user">${message}</div>`;

    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    const response = await fetch("/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
    });

    const data = await response.json();

    chatBox.innerHTML +=
        `<div class="message bot">${marked.parse(data.response)}</div>`;

    chatBox.scrollTop = chatBox.scrollHeight;
}

document.getElementById("message").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});