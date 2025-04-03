const express = require('express');
const router = express.Router();

const controllers = require('../../controllers/client/users.controller');

router.get("/not-friend", controllers.notFriend)


module.exports = router;