const { ObjectId } = require("mongodb");
const ApiError = require("../api-error");
const OrderService = require("../services/order.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
    if (!req.body?.SoDonDH) {
       
        return next(
            new ApiError(400, "order number can't be empty")
        );
    }
    try {
        const orderService = new OrderService(MongoDB.client);
        const document = await orderService.create(req.body);
        return res.send(document);
        
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "An error occurred while creating the order")
        );
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const orderService = new OrderService(MongoDB.client);
        const { SoDonDH } = req.query;
        if (SoDonDH) {
            documents = await orderService.findByName(SoDonDH);
        }
        else {
            documents = await orderService.find({});
        }
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "An error occurred while retrieving the order")
        );
    }
    return res.send(documents);
};


    

exports.findOne = async (req, res, next) => {
    try {
        const orderService = new OrderService(MongoDB.client);
        const document = await orderService.findById(req.params.id);
        if (!document) {
            return next(
                new ApiError(404, "Order not found")
            );
        }
        return res.send(document);
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, `Error retrieving order with id=${req.params.id} `));
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can't be empty"));
    }
    try {
        const orderService = new OrderService(MongoDB.client);
        const document = await orderService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "The order not found"));
        }
        return res.send({ message: "The order was updated successfully" });
    } catch (error) {
        return next(new ApiError(500, `Error updating the order with id=${req.params.id}`));
    }
};
exports.delete = async (req, res, next) => {

    try {
        const orderService = new OrderService(MongoDB.client);
        const document = await orderService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "The order not found"));
        }
        return res.send({ message: "The order was deleted successfully" });
    } catch (error) {
        return next(new ApiError(500, `The order deleting contact with id=${req.params.id}`));
    }
};
exports.deleteAll = async (req, res, next) => {
    try {
        const orderService = new OrderService(MongoDB.client);
        const deletedCount = await orderService.deleteAll();
        return res.send({ message: `${deletedCount} the order was deleted successfully` });
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while removing all orders")


        );
      
    }
};
exports.findAllTrangThaiDH = async (req, res, next) => {
    try {
        const orderService = new OrderService(MongoDB.client);
        const documents = await orderService.findFavorite();
        return res.send(documents);
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "An error occurred while retrieving favorite orders"));
    }
};