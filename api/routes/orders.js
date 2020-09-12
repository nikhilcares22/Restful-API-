const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');


//handel incoming GET request to /orders
router.get('/', (req, res, next) => {
    Order
        .find()
        .select('produt quantity _id')
        .exec()
        .then(docs => {
            // console.log(docs);
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: "get",
                            url: "https:localhost:3000/orders/" + doc._id
                        }
                    }
                })

            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', (req, res, next) => {

    const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
    });
    order
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "order stored",
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: "https:localhost:3000/orders/" + result._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

});



router.patch('/:orderId', (req, res, next) => {
    res.status(201).json({
        message: "updating orders",
        id: req.params.orderId
    });
});

router.get('/:orderId', (req, res, next) => {
    let id = req.params.orderId;
    res.status(200).json({
        message: "The order details are",
        id: id
    })
})

router.delete('/:orderId', (req, res, next) => {
    let id = req.body.orderId
    Order.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "product deleted"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })


})


module.exports = router;