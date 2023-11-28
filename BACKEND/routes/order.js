const passport = require('passport');
const Cart = require('../models/Cart');
const User = require('../models/User');
const Order = require('../models/Order');
const orderRouter = require('express').Router();

function generateOrderNumber() {
    const timestamp = Date.now().toString(); // Get the current timestamp as a string
    const randomDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); // Generate a random 4-digit number
    const orderNumber = timestamp + randomDigits; // Combine timestamp and random number

    return orderNumber;
}

orderRouter.get('/placeOrder', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const cartItems = await Cart.find({ $and: [{ userID: req.user._id }, { cartStatus: "1" }] }).exec();

        if (cartItems && cartItems.length > 0) {
            const orderNumber = generateOrderNumber();
            const orderStatus = "Pending";
            const orderPlacedDate = new Date().toLocaleString();

            // Create an array of cart item IDs by extracting the _id property from each cart item
            const cartItemIds = cartItems.map(cartItem => cartItem._id);

            // Create a new Order with references to cart items
            const newOrder = new Order({
                orderStatus: orderStatus,
                orderNumber: orderNumber,
                orderDetails: cartItemIds, // Set the orderDetails as an array of cart item IDs
                orderPlacedDate: orderPlacedDate,
                userID: req.user._id
            });

            const newResult = await newOrder.save();

            if (newResult) {
                const orderID = newResult.id;
                const newUpdate = await Cart.updateMany({ $and: [{ userID: req.user._id }, { cartStatus: "1" }] }, { cartStatus: '2' })
                if (newUpdate) {
                    res.status(200).send({ status: "Order Placed", error: false });
                }
                else {
                    await Order.findByIdAndDelete(orderID)
                    res.status(500).json({ message: { msgBody: "Error has occurred", msgError: true } });
                }
            } else {
                res.status(500).json({ message: { msgBody: "Error has occurred", msgError: true } });
            }
        } else {
            res.status(500).json({ message: { msgBody: "No cart items found for the user", msgError: true } });
        }
    } catch (error) {
        res.status(500).send({ status: "Error with inserting data", error: error.message });
    }
});

orderRouter.get('/allOrdersWithCartDetails/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const ordersWithCartDetails = await Order.find({ $and : [{userID: req.user._id}, {orderStatus: req.params.id}]}).populate('orderDetails').exec();

        if (ordersWithCartDetails) {
            res.status(200).send(ordersWithCartDetails);
        } else {
            res.status(404).json({ message: { msgBody: "No orders found", msgError: true } });
        }
    } catch (error) {
        res.status(500).send({ status: "Error fetching data", error: error.message });
    }
});

orderRouter.get('/allOrders/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { _id, role } = req.user;
        if(role === 'staff'){
            const ordersWithCartDetails = await Order.find({orderStatus: req.params.id}).populate('orderDetails').exec();

            if (ordersWithCartDetails) {
                res.status(200).send(ordersWithCartDetails);
            } else {
                res.status(404).json({ message: { msgBody: "No orders found", msgError: true } });
            }
        } 
        else{
            res.status(400).send({ status: "Invalid role" });
        }

    } catch (error) {
        res.status(500).send({ status: "Error fetching data", error: error.message });
    }
});

orderRouter.get('/completeOrder/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { _id, role } = req.user;
        if(role === 'user'){
            const result = await Order.findByIdAndUpdate(req.params.id, { orderStatus: String("Completed") })
            if (result) {
                res.status(200).send({ status: "Order Status updated" });
            } else {
                res.status(500).send({ status: "Error with updating data" });
            }
        }
        else{
            res.status(400).send({ status: "Invalid role" });
        }


    }
    catch (error) {
        res.status(500).send({ status: "Error with update data", error: error.message });

    }
})

orderRouter.get('/sendToDeliver/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { _id, role } = req.user;
        if(role === 'staff'){
            const result = await Order.findByIdAndUpdate(req.params.id, { orderStatus: String("SendToDeliver") })
            if (result) {
                res.status(200).send({ status: "Order Status updated" });
            } else {
                res.status(500).send({ status: "Error with updating data" });
            }
        }
        else{
            res.status(400).send({ status: "Invalid role" });
        }


    }
    catch (error) {
        res.status(500).send({ status: "Error with update data", error: error.message });

    }
})


module.exports = orderRouter;
