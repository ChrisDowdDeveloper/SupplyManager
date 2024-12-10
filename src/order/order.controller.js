const service = require("./order.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const automate = require("../services/automation");

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
    const data = req.body;
    const browser = data.browser
    
    try {

        if(data.length == 0) return res.status(400).json({ error: "Invalid request" });

        const result = await automate(browser, data.order);
    
        res.status(200).json({ message: "Order submitted successfully. Please wait a few minutes for the items to be added.", result });
    
    } catch(err) {
        console.error("Error with order submission", err.message);
        next(err);
    };

}

module.exports = {
    list: asyncErrorBoundary(list),
    listById: asyncErrorBoundary(listById),
    create: asyncErrorBoundary(create),
    listByDateRange: asyncErrorBoundary(listByDateRange),
    submitOrder: asyncErrorBoundary(submitOrder)
}
