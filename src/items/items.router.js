const methodNotAllowed = require("../errors/methodNotAllowed");
const router = require("express").Router();
const controller = require("./items.controller");

router
    .route("/")
    .get(controller.list)
    .post(controller.create)
    .all(methodNotAllowed);

router
    .route("/:id")
    .get(controller.listById)
    .put(controller.update)
    .delete(controller.delete)
    .all(methodNotAllowed);

module.exports = router;