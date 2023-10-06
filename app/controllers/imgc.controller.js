const { ObjectId } = require('mongodb');
const ApiError = require('../api-error');
const ImgCService = require('../services/imgc.service');
const MongoDB = require('../utils/mongodb.util');

const imgCService = new ImgCService(MongoDB.client);

exports.create = async (req, res, next) => {
  if (!req.body?.MaHinh) {
    return next(new ApiError(400, "Image ID can't be empty"));
  }

  try {
    const imgC = await imgCService.create(req.body);
    return res.status(201).json(imgC);
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, 'An error occurred while creating the image'));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const { MaHinh } = req.query;
    let imgCs = [];

    if (MaHinh) {
      imgCs = await imgCService.findByMaHinh(MaHinh);
    } else {
      imgCs = await imgCService.find({});
    }

    return res.json(imgCs);
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, 'An error occurred while retrieving images'));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const imgC = await imgCService.findById(req.params.id);
    if (!imgC) {
      return next(new ApiError(404, 'Image not found'));
    }
    return res.json(imgC);
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, `Error retrieving image with id=${req.params.id}`));
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can't be empty"));
  }

  try {
    const imgC = await imgCService.update(req.params.id, req.body);
    if (!imgC) {
      return next(new ApiError(404, 'Image not found'));
    }
    return res.json({ message: 'Image updated successfully' });
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, `Error updating the image with id=${req.params.id}`));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const imgC = await imgCService.delete(req.params.id);
    if (!imgC) {
      return next(new ApiError(404, 'Image not found'));
    }
    return res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, `Error deleting the image with id=${req.params.id}`));
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const deletedCount = await imgCService.deleteAll();
    return res.json({ message: `${deletedCount} images were deleted successfully` });
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, 'An error occurred while removing all images'));
  }
};
