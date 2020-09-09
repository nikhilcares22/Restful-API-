const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');
const { update } = require("../models/product");

router.get('/', (req, res, next) => {
    Product.find()
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length > 0) {
                res.status(200).json(docs);
            } else {
                res.status(200).json({
                    message: "no entries found"
                })
            }
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
            message: 'handling POST request to /products',
            createdProduct: product
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
        .exec()
        .then(doc => {
            console.log("from database ", doc);
            if (doc) {
                res.status(200).json(doc);
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
            res.status(200).json(result);
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
            res.status(200).json(result);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        });

});



module.exports = router;