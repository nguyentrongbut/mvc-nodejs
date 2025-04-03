const User = require("../../models/user.model")

module.exports = async (res) => {

    // SocketIO

    _io.once('connection', (socket) => {
        // người dùng gửi yêu cầu kết bạn
        socket.on("CLIENT_ADD_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;

            // Thêm id của A vào acceptFriends của B
            const existUserAInB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            })

            if (!existUserAInB) {
                await User.updateOne({
                    _id: userId,
                }, {
                    $push: {
                        acceptFriends: myUserId
                    }
                })
            }

            // Thêm id của B vào requestFriends của A
            const existUserBinA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            })

            if (!existUserBinA) {
                await User.updateOne({
                    _id: myUserId,
                }, {
                    $push: {
                        requestFriends: userId
                    }
                })
            }

        })

        // người dùng huỷ gửi yêu cầu kết bạn
        socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;

            // Xoá id của A vào acceptFriends của B
            const existUserAInB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            })

            if (existUserAInB) {
                await User.updateOne({
                    _id: userId,
                }, {
                    $pull: {
                        acceptFriends: myUserId
                    }
                })
            }

            // Xoá id của B vào requestFriends của A
            const existUserBinA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            })

            if (existUserBinA) {
                await User.updateOne({
                    _id: myUserId,
                }, {
                    $pull: {
                        requestFriends: userId
                    }
                })
            }

        })
    })


    // End SocketIO
}