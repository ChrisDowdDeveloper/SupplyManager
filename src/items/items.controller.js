const service = require("./items.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


const VALID_FIELDS = [
    "item_name",
    "item_url",
    "control",
    "category",
    "sub_category"
];

async function formHasInputs(req, res, next) {
    const data = req.body;
    try {
        VALID_FIELDS.forEach((fields) => {
            if(!data[fields]) {
                const error = new Error(`A '${fields}' is required.`);
                error.status = 400;
                throw error;
            }
        });
        next();
    } catch (error) {
        next(error);
    }
}

async function urlIsValid(req, res, next) {
    const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    const url = req.body.item_url;
    if(!urlRegex.test(url)) {
        return next({
            status: 400,
            message: 'URL is not valid',
        });
    }
    return next();
}

async function list(req, res) {
    try {
        const data = await service.list();
        res.json({ data });
    } catch(error) {
        console.error(error);
    }
}

async function create(req, res) {
    const data = req.body;
    const created = await service.create(data);
    res.status(201).json({ data: created });
}

async function update(req, res) {
    const { id } = req.params;
    const data = req.body;
    const updated = await service.update(id, data);
    res.status(200).json({ data: updated })
}

async function listById(req, res) {
    const { id } = req.params;
    const item = await service.listById(id);
    res.json({ item });
}

async function deleteItem(req, res) {
    const { id } = req.params;
    await service.deleteItem(id);
    res.status(204).end(); 
}

module.exports = {
    list: asyncErrorBoundary(list),
    listById: asyncErrorBoundary(listById),
    create: [
        formHasInputs,
        urlIsValid,
        asyncErrorBoundary(create)
    ],
    update: asyncErrorBoundary(update),
    delete: asyncErrorBoundary(deleteItem)
};