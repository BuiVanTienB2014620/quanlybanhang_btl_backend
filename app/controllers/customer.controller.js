const { ObjectId } = require('mongodb');
const ApiError = require('../api-error');
const CustomerService = require('../services/customer.service');
const MongoDB = require('../utils/mongodb.util');

const customerService = new CustomerService(MongoDB.client);

exports.create = async (req, res, next) => {
  if (!req.body?.MSKH) {
    return next(new ApiError(400, "Customer ID can't be empty"));
  }

  try {
    const customer = await customerService.create(req.body);
    return res.status(201).json(customer);
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, 'An error occurred while creating the customer'));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const { MSKH } = req.query;
    let customers = [];

    if (MSKH) {
      customers = await customerService.findByMSKH(MSKH);
    } else {
      customers = await customerService.find({});
    }

    return res.json(customers);
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, 'An error occurred while retrieving customers'));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const customer = await customerService.findById(req.params.id);
    if (!customer) {
      return next(new ApiError(404, 'Customer not found'));
    }
    return res.json(customer);
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, `Error retrieving customer with id=${req.params.id}`));
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can't be empty"));
  }

  try {
    const customer = await customerService.update(req.params.id, req.body);
    if (!customer) {
      return next(new ApiError(404, 'Customer not found'));
    }
    return res.json({ message: 'Customer updated successfully' });
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, `Error updating the customer with id=${req.params.id}`));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const customer = await customerService.delete(req.params.id);
    if (!customer) {
      return next(new ApiError(404, 'Customer not found'));
    }
    return res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, `Error deleting the customer with id=${req.params.id}`));
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const deletedCount = await customerService.deleteAll();
    return res.json({ message: `${deletedCount} customers were deleted successfully` });
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, 'An error occurred while removing all customers'));
  }
};
