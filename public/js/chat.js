import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

// File Upload With Preview
const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-image', {
    multiple: true, maxFileCount: 6,
});
// End File Upload With Preview

// CLIENT_SEND_MESSAGES
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
    formSendData.addEventListener("submit", event => {
        event.preventDefault();
        const content = event.target.elements.content.value;
        const images = upload.cachedFileArray || []

        if (content || images.length > 0) {
            // Gửi content hoặc ảnh lên server
            socket.emit("CLIENT_SEND_MESSAGE", {
                content: content, images: images
            });
            event.target.elements.content.value = "";
            upload.resetPreviewPanel();
            socket.emit("CLIENT_SEND_TYPING", "hidden");
        }
    })
}
// End CLIENT_SEND_MESSAGES


// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const myId = document.querySelector("[my-id]").getAttribute("my-id");
    const body = document.querySelector(".chat .inner-body");
    const boxTyping = document.querySelector(".inner-list-typing");

    const div = document.createElement("div");

    let htmlFullName = "";
    let htmlContent = "";
    let htmlImages = ""

    if (myId == data.user_id) {
        div.classList.add("inner-outgoing")
    } else {
        div.classList.add("inner-incoming");
        htmlFullName = ` <div class="inner-name">${data.fullName}</div>`
    }

    if (data.content) {
        htmlContent = `
        <div class="inner-content">${data.content}</div>
        `
    }

    if (data.images) {
        htmlImages += `<div class="inner-images">`

        for (const image of data.images) {
            htmlImages += `
            <img src=${image}>
        `;
        }

        htmlImages += `</div>`
    }

    div.innerHTML = `
          ${htmlFullName}
          ${htmlContent}
          ${htmlImages}
    `


    body.insertBefore(div, boxTyping);

    body.scrollTop = body.scrollHeight;

    // Preview Img
    const boxImages = div.querySelector(".inner-images");
    if (boxImages) {
        const gallery = new Viewer(boxImages);
    }
})
// End SERVER_RETURN_MESSAGE

// Scroll Chat to Bottom
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight;
}
// End Scroll Chat to Bottom

// Show typing
var timeOut;
const showTyping = () => {
    socket.emit("CLIENT_SEND_TYPING", "show");

    clearTimeout(timeOut);

    timeOut = setTimeout(() => {
        socket.emit("CLIENT_SEND_TYPING", "hidden");
    }, 3000)
}
// End Show typing

// emoji-picker

// show popup
const buttonIcon = document.querySelector('.button-icon');

if (buttonIcon) {
    const tooltip = document.querySelector('.tooltip')
    Popper.createPopper(buttonIcon, tooltip)

    buttonIcon.onclick = () => {
        tooltip.classList.toggle('shown')
    }
}


// insert icon to input
const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
    const inputChat = document.querySelector(".chat .inner-form input[name='content']");
    emojiPicker.addEventListener("emoji-click", e => {
        const icon = e.detail.unicode
        inputChat.value = inputChat.value + icon;

        const end = inputChat.value.length
        inputChat.setSelectionRange(end, end);
        inputChat.focus()

        showTyping()
    })

    inputChat.addEventListener("keyup", e => {
        showTyping()
    })
}
// End emoji-picker

// SERVER_RETURN_TYPING
const elementListTyping = document.querySelector('.chat .inner-list-typing');

if (elementListTyping) {
    socket.on("SERVER_RETURN_TYPING", (data) => {

        if (data.type == "show") {
            const existTyping = elementListTyping.querySelector(`[user-id="${data.user_id}"]`)

            if (!existTyping) {
                const boxTyping = document.createElement("div");
                boxTyping.classList.add("box-typing");
                boxTyping.setAttribute("user-id", data.user_id);

                boxTyping.innerHTML = `
                <div class="box-typing">
                <div class="inner-name">${data.fullName}</div>
                    <div class="inner-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                `

                elementListTyping.appendChild(boxTyping);
                bodyChat.scrollTop = bodyChat.scrollHeight;
            }

        } else {
            const boxTypingRemove = elementListTyping.querySelector(`[user-id="${data.user_id}"]`)

            if (boxTypingRemove) {
                elementListTyping.removeChild(boxTypingRemove)
            }
        }
    })
}

// END SERVER_RETURN_TYPING

// Preview Image
const chatBody = document.querySelector(".chat .inner-body");
if (chatBody) {
    const gallery = new Viewer(chatBody);
}
// End Preview Image
