const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');
const { update } = require("../models/product");
const { response } = require("../../app");

router.get('/', (req, res, next) => {
    Product.find()
        .select('name price _id') //used to display selective methods
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    // console.log(doc);
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
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
});


router.post('/', (req, res, next) => {

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created product successfully ',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        });
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    });


});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id')
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

});
router.patch('/:productId', (req, res, next) => {
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
});

router.delete('/:productId', (req, res, next) => {
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

});



module.exports = router;