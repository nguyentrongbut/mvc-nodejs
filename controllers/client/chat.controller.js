const Chat = require("../../models/chat.model")
const User = require("../../models/user.model")

// [GET] /chat
module.exports.index = async (req, res) => {
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;

    // SocketIO
    _io.once('connection',  (socket) => {
        socket.on("CLIENT_SEND_MESSAGE", async(content) => {
           // Lưu vào database
            const chat = new Chat({
                user_id: userId,
                content: content,
            })

            await chat.save();

            // Trả data về client
            _io.emit("SERVER_RETURN_MESSAGE", {
                user_id: userId,
                fullName: fullName,
                content: content,
            })
        })
    })
    // End SocketIO

    // Get data
    const chats = await Chat.find({
        deleted: false,
    })

    for (const chat of chats) {
        const inforUser = await User.findOne({
            _id: chat.user_id,
        }).select("fullName");

        chat.inforUser = inforUser;
    }

    res.render('client/pages/chat/index', {
        pageTitle: 'Chat',
        chats: chats,
    });
}

