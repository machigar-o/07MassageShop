const Shop = require("../models/Shop");

//@desc     Get all shops
//@route    GET /api/v1/shops
//@access   Public
exports.getShops = async (req, res, next) => {
  const reqQuery = { ...req.query };
  const removeFields = ["select", "sort", "page", "limit"];
  removeFields.forEach((param) => delete reqQuery[param]);
  let queryStr = JSON.stringify(reqQuery).replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  // Finding resource
  let query = Shop.find(JSON.parse(queryStr));
  // Select
  if (req.query.select) {
    query = query.select(req.query.select.split(",").join(" "));
  }
  // Sort
  query = req.query.sort
    ? query.sort(req.query.sort.split(",").join(" "))
    : query.sort("-createdAt");
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIdx = (page - 1) * limit;
  const endIdx = page * limit;
  const total = await Shop.countDocuments();
  query = query.skip(startIdx).limit(limit);
  try {
    // Executing query
    const shops = await query;
    // Pagination result
    const pagination = {};
    if (endIdx < total) {
      pagination.next = { page: page + 1, limit };
    }
    if (startIdx > 0) {
      pagination.prev = { page: page - 1, limit };
    }
    res.status(200).json({
      success: true,
      count: shops.length,
      pagination,
      data: shops,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc     Get single shop
//@route    GET /api/v1/shops/:id
//@access   Public
exports.getShop = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: shop });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

//@desc     Create single shop
//@route    POST /api/v1/shops
//@access   Private
exports.createShop = async (req, res, next) => {
  console.log(req.body);
  try {
    const shop = await Shop.create(req.body);
    res.status(201).json({ success: true, data: shop });
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//@desc     Update single shop
//@route    PUT /api/v1/shops/:id
//@access   Private
exports.updateShop = async (req, res, next) => {
  try {
    const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!shop) {
      res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: shop });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

//@desc     Delete single shop
//@route    DELETE /api/v1/shops/:id
//@access   Private
exports.deleteShop = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      res.status(400).json({ success: false });
    }
    shop.remove();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
