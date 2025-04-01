const express = require('express');
const router = express.Router();

const controllers = require('../../controllers/client/checkout.controller');

router.get("/", controllers.index)

router.post("/order", controllers.order)

router.get("/success/:orderId", controllers.success)


module.exports = router;