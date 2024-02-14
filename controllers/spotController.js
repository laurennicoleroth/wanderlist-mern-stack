import Spot from '../models/SpotModel.js';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import day from 'dayjs';

export const getAllSpots = async (req, res) => {
  const { search, spotStatus, spotType, sort } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };

  if (search) {
    queryObject.$or = [
      { position: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
    ];
  }

  if (spotStatus && spotStatus !== 'all') {
    queryObject.spotStatus = spotStatus;
  }
  if (spotType && spotType !== 'all') {
    queryObject.spotType = spotType;
  }

  const sortOptions = {
    newest: '-createdAt',
    oldest: 'createdAt',
    'a-z': 'position',
    'z-a': '-position',
  };

  const sortKey = sortOptions[sort] || sortOptions.newest;

  // setup pagination

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const spots = await Spot.find(queryObject)
    .sort(sortKey)
    .skip(skip)
    .limit(limit);

  const totalSpots = await Spot.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalSpots / limit);
  res
    .status(StatusCodes.OK)
    .json({ totalSpots, numOfPages, currentPage: page, spots });
};

export const createSpot = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const spot = await Spot.create(req.body);
  res.status(StatusCodes.CREATED).json({ spot });
};

export const getSpot = async (req, res) => {
  const spot = await Spot.findById(req.params.id);
  res.status(StatusCodes.OK).json({ spot });
};

export const updateSpot = async (req, res) => {
  const updatedSpot = await Spot.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(StatusCodes.OK).json({ msg: 'spot modified', spot: updatedSpot });
};

export const deleteSpot = async (req, res) => {
  const removedSpot = await Spot.findByIdAndDelete(req.params.id);
  res.status(StatusCodes.OK).json({ msg: 'spot deleted', spot: removedSpot });
};

export const showStats = async (req, res) => {
  let stats = await Spot.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$spotStatus', count: { $sum: 1 } } },
  ]);

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  let monthlyApplications = await Spot.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;

      const date = day()
        .month(month - 1)
        .year(year)
        .format('MMM YY');

      return { date, count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};
