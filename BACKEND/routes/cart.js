const passport = require('passport');
const Cart = require('../models/Cart');
const User = require('../models/User');
const cartRouter = require('express').Router();

//Add new product
cartRouter.post('/addCart', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { productID = '', productName = '', productCode = '', productDescription = '', category = '', price = '', nutritionalInformation = '', portionSize = '', selectedQuantity = '', productImage = '', createdDate = '', customerID = '', customerImage = '', userID = '', fname = '', lname = '', address = '', mobile = '', email = '' } = req.body;
        const isAvailble = await Cart.findOne({ $and: [{ productID: productID }, { userID: userID }, {cartStatus: '1'}] })
        if (!isAvailble) {
            const cartStatus = 1;
            const newCart = new Cart({ productID, productName, productDescription, productCode, category, price, nutritionalInformation, portionSize, selectedQuantity, productImage, createdDate, customerID, customerImage, userID, fname, lname, address, mobile, email, cartStatus })
            const result = await newCart.save()
            if (result) {
                res.status(200).json({ message: { msgBody: "Product successfully added To your cart", msgError: false } });
            }
            else {
                res.status(500).json({ message: { msgBody: "Error has occured ", msgError: true } });
            }
        }
        else {
            res.status(200).json({ message: { msgBody: "Product already in your cart", msgError: true } });
        }

    }
    catch (error) {
        res.status(500).send({ status: "Error with inserting data", error: error.message });

    }
})

cartRouter.get('/get', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const result = await Cart.find({$and:[{ userID: req.user._id }, {cartStatus: '1'}]}).exec();
        if (result) {
            res.status(200).json(result);
        }
        else {
            res.status(500).json({ message: { msgBody: "Error has occured ", msgError: true } });
        }

    }
    catch (error) {
        res.status(500).send({ status: "Error with fetching data", error: error.message });

    }
})

cartRouter.put('/updateQuantity/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { selectedQuantity } = req.body
        const result = await Cart.findByIdAndUpdate(req.params.id, { selectedQuantity: String(selectedQuantity) })
        if (result) {
            res.status(200).send({ status: "cart updated" });
        } else {
            res.status(500).send({ status: "Error with updating data" });
        }

    }
    catch (error) {
        res.status(500).send({ status: "Error with update data", error: error.message });

    }
})

cartRouter.delete('/delete/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const result = await Cart.findByIdAndDelete(req.params.id)
        if (result) {
            res.status(200).send({ status: "cart Deleted" });
        } else {
            res.status(500).send({ status: "Error with updating data" });
        }

    }
    catch (error) {
        res.status(500).send({ status: "Error with delete data", error: error.message });

    }
})

cartRouter.delete('/deleteByUser', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const result = await Cart.deleteMany({ userID: req.user._id });

        if (result.deletedCount > 0) {
            res.status(200).send({ status: "Cart Deleted" });
        } else {
            res.status(404).send({ status: "Cart not found for the user" });
        }
    } catch (error) {
        res.status(500).send({ status: "Error with deleting data", error: error.message });
    }
});


module.exports = cartRouter;
