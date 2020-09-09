const express = require("express");
const router = express.Router();

//handel incoming GET request to /orders
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: "getting orders"
    });
});

router.post('/', (req, res, next) => {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    }
    res.status(201).json({
        message: "posting orders",
        order: order
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
    res.status(201).json({
        message: "the item has been deleted",
        id: req.params.orderId
    })
})


module.exports = router;