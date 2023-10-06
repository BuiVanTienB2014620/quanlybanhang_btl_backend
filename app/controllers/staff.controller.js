const { ObjectId } = require('mongodb');
const ApiError = require('../api-error');
const StaffService = require('../services/staff.service');
const MongoDB = require('../utils/mongodb.util');

const staffService = new StaffService(MongoDB.client);

exports.create = async (req, res, next) => {
  if (!req.body?.MSNV) {
    return next(new ApiError(400, 'Staff ID can\'t be empty'));
  }

  try {
    const staff = await staffService.create(req.body);
    return res.status(201).json(staff);
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, 'An error occurred while creating the staff'));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const { MSNV } = req.query;
    let staffMembers = [];

    if (MSNV) {
      staffMembers = await staffService.findByMSNV(MSNV);
    } else {
      staffMembers = await staffService.find({});
    }

    return res.json(staffMembers);
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, 'An error occurred while retrieving staff members'));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const staffMember = await staffService.findById(req.params.id);
    if (!staffMember) {
      return next(new ApiError(404, 'Staff member not found'));
    }
    return res.json(staffMember);
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, `Error retrieving staff member with id=${req.params.id}`));
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, 'Data to update can\'t be empty'));
  }

  try {
    const staffMember = await staffService.update(req.params.id, req.body);
    if (!staffMember) {
      return next(new ApiError(404, 'Staff member not found'));
    }
    return res.json({ message: 'Staff member updated successfully' });
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, `Error updating the staff member with id=${req.params.id}`));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const staffMember = await staffService.delete(req.params.id);
    if (!staffMember) {
      return next(new ApiError(404, 'Staff member not found'));
    }
    return res.json({ message: 'Staff member deleted successfully' });
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, `Error deleting the staff member with id=${req.params.id}`));
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const deletedCount = await staffService.deleteAll();
    return res.json({ message: `${deletedCount} staff members were deleted successfully` });
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, 'An error occurred while removing all staff members'));
  }
};
