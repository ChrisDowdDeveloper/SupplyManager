const service = require("./order.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
    try {
        const data = await service.list();
        res.json({ data });
    } catch(error) {
        console.error(error);
    }
}

async function create(req, res) {
    try {
        const data = req.body;
        const created = await service.create(data);
        res.status(201).json({ created });
    } catch (error) {
        console.error(error)
    }
}

async function listById(req, res) {
    const { order_id } = req.params;
    try {
        const order = await service.listById(order_id);
        res.json({ order });
    } catch(error) {
        console.error(error);
    }
}

async function listByDateRange(req, res) {
    const { from, to } = req.query;
    console.log(from);
    console.log(to);
    try {
        if (!from || !to) {
            return res.status(400).json({
                error: "Both 'from' and 'to' date parameters are required.",
            });
        }
        const orders = await service.listByDateRange(from, to);
        res.json({ orders })
    } catch(error) {
        console.error(error);
    }
}

async function submitOrder(req, res) {
    res.json({ message: "submit order called" })
}

module.exports = {
    list: asyncErrorBoundary(list),
    listById: asyncErrorBoundary(listById),
    create: asyncErrorBoundary(create),
    listByDateRange: asyncErrorBoundary(listByDateRange),
    submitOrder: asyncErrorBoundary(submitOrder)
}
