const passport = require('passport');
const Product = require('../models/Product');

const productRouter = require('express').Router();

function generateProductCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let productCode = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        productCode += characters.charAt(randomIndex);
    }

    return productCode;
}

//Add new product
productRouter.post('/addproduct', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { _id, role } = req.user;
        const createdBy = _id;
        if (role === "staff") {
            const { productName, productDescription, category, price, nutritionalInformation, portionSize, quantity, image } = req.body;
            const productCode = generateProductCode(8)
            const newProduct = new Product({ productName, productDescription, productCode, category, price, quantity, nutritionalInformation, portionSize, image, createdBy })
            const result = await newProduct.save()
            if (result) {
                res.status(200).json({ message: { msgBody: "Product Successfully Added", msgError: false } });
            }
            else {
                res.status(500).json({ message: { msgBody: "Error has occured ", msgError: true } });
            }
        } else {
            res.status(400).send({ status: "Invalid role" });
        }

    }
    catch (error) {
        res.status(500).send({ status: "Error with inserting data", error: error.message });

    }
})

//get All product
productRouter.get('/getallproducts', async (req, res) => {
    try {
        const result = await Product.find().exec();
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

//Delete Product
productRouter.delete('/delete/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try{
        const productID = req.params.id
        const { _id, role } = req.user;
        if(role === 'staff'){
            const result = await Product.findByIdAndDelete(productID)
            if (result) {
                res.status(200).json({ message: { msgBody: "Product Deleted Success ", msgError: false }});
            }
            else {
                res.status(500).json({ message: { msgBody: "Error has occured ", msgError: true } });
            }
        }
        else {
            res.status(400).send({ status: "Invalid role" });
        }
    }
    catch (error) {
        res.status(500).send({ status: "Error with Deleting data", error: error.message });

    }
})

//Update product
productRouter.put('/update/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try{
        const productID = req.params.id
        const data = req.body
        const { _id, role } = req.user;
        if(role === 'staff'){
            const result = await Product.findByIdAndUpdate(productID, data)
            if (result) {
                res.status(200).json({ message: { msgBody: "Product Update Success ", msgError: false }});
            }
            else {
                res.status(500).json({ message: { msgBody: "Error has occured ", msgError: true } });
            }
        }
        else {
            res.status(400).send({ status: "Invalid role" });
        }
    }
    catch(error){
        res.status(500).send({ status: "Error with Updating data", error: error.message });
    }
})

//Get one product
productRouter.get('/get/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        const { _id, role } = req.user;
        const productID = req.params.id

        if (role === "staff") {
            const result = await Product.findById(productID);
            if (result) {
                res.status(200).json(result);
            }
            else {
                res.status(500).json({ message: { msgBody: "Error has occured ", msgError: true } });
            }
        }
        else {
            res.status(400).send({ status: "Invalid role" });
        }

    }
    catch (error) {
        res.status(500).send({ status: "Error with fetching data", error: error.message });

    }
})

module.exports = productRouter;
