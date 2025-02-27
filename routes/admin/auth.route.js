const express = require('express');
const validate  = require("../../validates/admin/auth.validate")
const router = express.Router();

const controller = require('../../controllers/admin/auth.controller');

router.get('/login', controller.login)

router.post('/login',
    validate.loginPost,
    controller.loginPost)

router.get('/logout', controller.logout)

module.exports = router;