const Product = require('../models/product');
const mongoose = require('mongoose');

exports.products_get_all = (req, res, next) => {
    Product.find()
        .select('name price _id productImage') //used to display selective methods
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        productImage: doc.productImage,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            }
            res.status(200).json(response);

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.products_create = (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Created product successfully",
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: "http://localhost:3000/products/" + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log("here")
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
}

exports.products_get_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            console.log("from database ", doc);
            if (doc) {
                res.status(200).json({
                    product: doc,
                    resquest: {
                        type: 'GET',
                        description: 'GET all products',
                        url: 'http://localhost/products'
                    }
                });
            } else {
                res.status(404).json({
                    message: 'no valid entry'
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });

}

exports.products_update_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    // used this loop in case there is just one or 0 value to update
    for (const ops of req.body) { //sending an array in body
        updateOps[ops.propName] = ops.value; //accessing json through bracket approach
    }
    console.log(updateOps);
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "product updated",
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + id
                }
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            })
        });
}

exports.products_delete_product = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'product deleted',
                request: {
                    type: 'POST',
                    url: 'http:localhost:3000/products',
                    body: {
                        name: 'string',
                        price: 'number'
                    }
                }
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        });

}