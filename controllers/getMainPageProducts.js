const ProductSchema = require('../models/MenuItem');

exports.getProducts = async (req, res, next) => {
    try {
        let products = await ProductSchema.find({});
console.log("endpoint function run for get products");

        if (!products) {
            products = await products.create({message :"no products found"});
        }
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (err) {
        next(err);
    }
}