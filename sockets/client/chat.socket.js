const Chat = require("../../models/chat.model")
const uploadCloudinary = require("../../helpers/uploadCloudinary")

module.exports = async (res) =>  {
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;

    // SocketIO
    _io.once('connection',  (socket) => {
        socket.on("CLIENT_SEND_MESSAGE", async(data) => {

            let images = [];

            for (const imageBuffer of data.images) {
                const link = await uploadCloudinary(imageBuffer);
                images.push(link);
            }

            // Lưu vào database
            const chat = new Chat({
                user_id: userId,
                content: data.content,
                images: images,
            })

            await chat.save();

            // Trả data về client
            _io.emit("SERVER_RETURN_MESSAGE", {
                user_id: userId,
                fullName: fullName,
                content: data.content,
                images: images,
            })
        })

        socket.on("CLIENT_SEND_TYPING", (type) => {
            socket.broadcast.emit("SERVER_RETURN_TYPING", {
                user_id: userId,
                fullName: fullName,
                type: type,
            })
        })
    })
    // End SocketIO
}