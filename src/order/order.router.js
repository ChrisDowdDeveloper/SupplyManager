const methodNotAllowed = require("../errors/methodNotAllowed");
const router = require("express").Router();
const controller = require("./order.controller");

router
    .route("/")
    .get(controller.list)
    .post(controller.create)
    .all(methodNotAllowed);

router
    .route("/date-range")
    .get(controller.listByDateRange)
    .all(methodNotAllowed);


router.route("/:order_id")
    .get(controller.listById)
    .all(methodNotAllowed);

router.route('/order/submit')
    .post(controller.submitOrder)
    .all(methodNotAllowed);

module.exports = router;