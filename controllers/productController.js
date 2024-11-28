import { Product } from "../models/productModel.js";

// page=2&pageLimit=5
// price=asc

export const getAllProducts = async (req, res, next) => {
  try {
    const pageLimit = req.query.pageLimit || 10;
    const pageNumber = req.query.page || 1;
    const firstDocument = (pageNumber - 1) * pageLimit;

    const sortValue = {};
    if (req.query?.price === "asc") {
      sortValue.price = 1;
    } else if (req.query?.price === "desc") {
      sortValue.price = -1;
    }

    const filterValue = {};

    if (req.query?.minprice) {
      filterValue.price = {
        ...filterValue.price,
        $gte: req.query.minprice,
      };
    }

    if (req.query?.maxprice) {
      filterValue.price = {
        ...filterValue.price,
        $lte: req.query.maxprice,
      };
    }

    if (req.query?.category) {
      filterValue.category = req.query.category;
    }

    if (req.query?.color) {
      filterValue.color = req.query.color;
    }

    if (req.query?.size) {
      filterValue.size = req.query.size;
    }

    const products = await Product.find(filterValue)
      .skip(firstDocument)
      .limit(pageLimit)
      .sort(sortValue);

    const totalProducts = await Product.countDocuments(filterValue);

    const totalPages = Math.ceil(totalProducts / pageLimit);

    res.status(200).json({
      message: 'Products retrieved successfully!',
      products,
      totalPages,
      pageIndex: pageNumber,
    });
  } catch (error) {
    next(error);
  }
};


export const getSingleProduct = async (req, res, next) => {
  const productId = req.params.id;

  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required.' });
  }

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    return res.status(200).json({ message: 'Product retrieved successfully!', product });
  } catch (error) {
    next(error);
  }
};


export const addProduct = async (req, res, next) => {
  try {
    const newProduct = await Product.create(req.body);

    await Product.create(newProduct);
    res.status(201).json({message: 'Product added.'})
  } catch (error) {
    next(error);
  }
}

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    product ? res.status(200).json(product) : res.sendStatus(404);

  } catch (error) {
    next(error);
  }
};



export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.json({ message: 'Product deleted.' });

  } catch (error) {
    next(error);
  }
}
