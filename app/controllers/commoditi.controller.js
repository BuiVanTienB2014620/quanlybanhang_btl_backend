const { ObjectId } = require('mongodb');
const ApiError = require('../api-error');
const CommodityService = require('../services/commodity.service');
const MongoDB = require('../utils/mongodb.util');

const commodityService = new CommodityService(MongoDB.client);

exports.create = async (req, res, next) => {
  if (!req.body?.MSHH) {
    return next(new ApiError(400, 'Commodity ID can\'t be empty'));
  }

  try {
    const commodity = await commodityService.create(req.body);
    return res.status(201).json(commodity);
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, 'An error occurred while creating the commodity'));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const { MSHH } = req.query;
    let commodities = [];

    if (MSHH) {
      commodities = await commodityService.findByMSHH(MSHH);
    } else {
      commodities = await commodityService.find({});
    }

    return res.json(commodities);
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, 'An error occurred while retrieving commodities'));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const commodity = await commodityService.findById(req.params.id);
    if (!commodity) {
      return next(new ApiError(404, 'Commodity not found'));
    }
    return res.json(commodity);
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, `Error retrieving commodity with id=${req.params.id}`));
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, 'Data to update can\'t be empty'));
  }

  try {
    const commodity = await commodityService.update(req.params.id, req.body);
    if (!commodity) {
      return next(new ApiError(404, 'Commodity not found'));
    }
    return res.json({ message: 'Commodity updated successfully' });
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, `Error updating the commodity with id=${req.params.id}`));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const commodity = await commodityService.delete(req.params.id);
    if (!commodity) {
      return next(new ApiError(404, 'Commodity not found'));
    }
    return res.json({ message: 'Commodity deleted successfully' });
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, `Error deleting the commodity with id=${req.params.id}`));
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const deletedCount = await commodityService.deleteAll();
    return res.json({ message: `${deletedCount} commodities were deleted successfully` });
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, 'An error occurred while removing all commodities'));
  }
};
