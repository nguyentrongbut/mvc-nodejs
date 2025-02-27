const express = require('express');

const multer  = require('multer')

const upload = multer()

const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewares")

const validate = require("../../validates/admin/account.validate")

const router = express.Router();

const controller = require('../../controllers/admin/account.controller');

router.get('/', controller.index)

router.get('/create', controller.create)

router.post('/create',
    upload.single('avatar'),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost)

module.exports = router;