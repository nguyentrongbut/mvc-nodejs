const express = require('express');

const multer  = require('multer')

// upload local upload
// const storageMulter = require('../../helpers/strorageMulter');
// const upload = multer({ storage: storageMulter() })

// upload online
const upload = multer()

const router = express.Router();

const controller = require('../../controllers/admin/product.controller');

const validate = require("../../validates/admin/product.validate")

const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewares")

const e = require("express");

router.get('/', controller.index)

router.patch('/change-status/:status/:id', controller.changeStatus)

router.patch('/change-multi', controller.changeMulti)

router.delete('/delete/:id', controller.deleteItem)

router.get('/create', controller.create)

router.post(
    '/create',
    // upload local
    // upload.single('thumbnail'),

    // upload online
    upload.single('thumbnail'),
    uploadCloud.upload,
    // End upload online
    validate.createPost,
    controller.createPost)

router.get('/edit/:id', controller.edit)

router.patch(
    '/edit/:id',
    // upload local
    // upload.single('thumbnail'),

    // upload online
    upload.single('thumbnail'),
    uploadCloud.upload,
    // End upload online
    validate.createPost,
    controller.editPatch)

router.get('/detail/:id', controller.detail)

module.exports = router;