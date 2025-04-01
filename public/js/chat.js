// CLIENT_SEND_MESSAGES
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
    formSendData.addEventListener("submit", event => {
        event.preventDefault();
        const content = event.target.elements.content.value;
        if (content) {
            socket.emit("CLIENT_SEND_MESSAGE", content);
            event.target.elements.content.value = "";
        }
    })
}
// End CLIENT_SEND_MESSAGES
