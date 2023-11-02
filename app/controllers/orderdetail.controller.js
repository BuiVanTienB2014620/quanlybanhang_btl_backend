const { ObjectId } = require('mongodb');
const ApiError = require('../api-error');
const OrderDetailService = require('../services/orderdetail.service');
const MongoDB = require('../utils/mongodb.util');

const orderDetailService = new OrderDetailService(MongoDB.client);

exports.create = async (req, res, next) => {
  if (!req.body?.SoDonDH) {
    return next(new ApiError(400, "Order number can't be empty"));
  }

  try {
    const orderDetail = await orderDetailService.create(req.body);
    return res.status(201).json(orderDetail);
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, 'An error occurred while creating the order Detail'));
  }
};

// exports.findAll = async (req, res, next) => {
//   try {
//     const { SoDonDH } = req.query;
//     let orderDetails = [];

//     if (SoDonDH) {
//       orderDetails = await orderDetailService.findBySoDonDH(SoDonDH);
//     } else {
//       orderDetails = await orderDetailService.find({});
//     }

//     return res.json(orderDetails);
//   } catch (error) {
//     console.error(error);
//     return next(new ApiError(500, 'An error occurred while retrieving order Details'));
//   }
// };

exports.findOne = async (req, res, next) => {
  try {
    const orderDetail = await orderDetailService.findById(req.params.id);
    if (!orderDetail) {
      return next(new ApiError(404, 'Order Detail not found'));
    }
    return res.json(orderDetail);
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, `Error retrieving order Detail with id=${req.params.id}`));
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can't be empty"));
  }

  try {
    const orderDetail = await orderDetailService.update(req.params.id, req.body);
    if (!orderDetail) {
      return next(new ApiError(404, 'Order Detail not found'));
    }
    return res.json({ message: 'Order Detail updated successfully' });
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, `Error updating the order Detail with id=${req.params.id}`));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const orderDetail = await orderDetailService.delete(req.params.id);
    if (!orderDetail) {
      return next(new ApiError(404, 'Order Detail not found'));
    }
    return res.json({ message: 'Order Detail deleted successfully' });
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, `Error deleting the order Detail with id=${req.params.id}`));
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const deletedCount = await orderDetailService.deleteAll();
    return res.json({ message: `${deletedCount} order Details were deleted successfully` });
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, 'An error occurred while removing all order Details'));
  }
};

// exports.findAllTrangThaiDH = async (req, res, next) => {
//   try {
//     const orderDetails = await orderDetailService.findAllTrangThaiDH();
//     return res.json(orderDetails);
//   } catch (error) {
//     console.error(error);
//     return next(new ApiError(500, 'An error occurred while retrieving favorite order Details'));
//   }
// };
