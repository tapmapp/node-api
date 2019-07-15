var express = require('express');
var router = express.Router();
var checkAuth = require('../middleware/check.auth');
var jwt = require('jsonwebtoken');

var Merchant = require('../models/merchants');
var MerchantProduct = require('../models/merchantProducts');

/* GET MERCHANT INFO */
router.get('/:merchantId', checkAuth, function(req, res, next) {

    var merchantInfo = Merchant.schema.methods.merchantInfo(req.params.merchantId);
    merchantInfo.then(merchantInfo => {

        // RETURN MERCHANT INFO
        res.status(200).json({
            response: {
                code: 200,
                message: 'Merchant information found',
                status: '',
            },
            result: {
                merchantInfo: merchantInfo
            }
        });

    }, function(err) {

        // RETURN ERROR
        return res.status(500).json({
            response: {
                code: 500,
                message: 'Not merchant information found!',
                status: '',
            }, 
            result: {
                error: err
            }
        });

    });

});

/* GET MERCHANT PRODUCTS */
router.get('/products/:merchantId', checkAuth, function(req, res, next) {

    // MERCHANT ID
    var merchantId = req.params.merchantId;

    var merchantProducts = MerchantProduct.schema.methods.getMerchantProducts(merchantId);
    merchantProducts.then(merchantProducts => {

        var products = [];
        var message;

        if(merchantProducts && merchantProducts.length > 0) {

            message = merchantProducts.length + 'merchant products found';

            for(let merchantProduct in merchantProducts) {

                products.push({
                    _id: merchantProducts[merchantProduct]._id,
                    productId: merchantProducts[merchantProduct].product._id,
                    name: merchantProducts[merchantProduct].product.name,
                    brand: merchantProducts[merchantProduct].product.brand,
                    brandName: merchantProducts[merchantProduct].product.brandName,
                    category: merchantProducts[merchantProduct].category,
                    lot: merchantProducts[merchantProduct].lot,
                    img: merchantProducts[merchantProduct].product.img,
                    size: merchantProducts[merchantProduct].product.size,
                    stores: merchantProducts[merchantProduct].stores,
                });
            
            }
            
        } else {
            message = '0 merchant products not found';
        }

        // RETURN MERCHANT PRODUCTS
        res.status(200).json({
            response: {
                code: 200,
                message: message,
                status: '',
            },
            result: products,
        });
        
    }).catch(err => {

        // HANDLE ERROR
        res.status(err.statusCode || 500).json(err);

    });
    
});

/* GET SINGLE MERCHANT PRODUCT */
router.get('/product/:merchantProductId', checkAuth, function(req, res, next){

    var merchantProduct = MerchantProduct.schema.methods.getMerchantProduct(req.params.merchantProductId);
    merchantProduct.then(function(merchantProduct) {

        var product = {};

        if(merchantProduct && merchantProduct.length > 0) {

            Object.assign(product, {
                _id: merchantProduct[0]._id,
                productId: merchantProduct[0].product._id,
                name: merchantProduct[0].product.name,
                brand: merchantProduct[0].product.brand,
                brandName: merchantProduct[0].product.brandName,
                size: merchantProduct[0].product.size,
                img: merchantProduct[0].product.img,
                category: merchantProduct[0].category,
                lot: merchantProduct[0].lot,
                stores: merchantProduct[0].stores,
            });
        }

        // RETURN MERCHANT INFO
        res.status(200).json({
            response: {
                code: 200,
                message: 'Merchant product found',
                status: '',
            },
            result: product,
        });

    }).catch(err => {

        // HANDLE ERROR
        res.status(err.statusCode || 500).json(err);

    });

});

// CREATE ACCCOUNT
router.post('/create-account', (req, res, next) => {

    var merchant = Merchant.schema.methods.find(req.body.email);
    merchant.then(merchant => {

        if(merchant !== null) {

            // MERCHANT EXISTS
            return res.status(409).json({
                response: {
                    code: 409,
                    message: 'Merchant already exist!',
                    status: '',
                }, 
                result: {}
            });

        }

        var encryptedPassword = Merchant.schema.methods.encryptPassword(req.body.password);
        encryptedPassword.then(hash => {

            var newMerchant = Merchant.schema.methods.save(
                req.body.email,
                req.body.type,
                hash,
            );

            newMerchant.then(merchant => {

                // TOKEN GENERATION
                const token = jwt.sign({
                    email: merchant.email,
                    merchantId: merchant._id
                }, 
                    process.env.SECRET,
                {
                    expiresIn: '24h'
                });
                
                // MERCHANT CREATED
                res.status(201).json({
                    response: {
                        code: 201,
                        message: 'A merchant was created!',
                        status: '',
                    },
                    result: {
                        newMerchant: {
                            merchantId: merchant._id,
                            merchantEmail: merchant.email,
                            token: token,
                        }
                    }
                });

            }).catch(err => {

                // RETURN ERROR
                res.status(500).json({
                    message: 'Error creating new merchant',
                    error: err
                });

            });

        }).catch(err => {

            // RETURN ERROR
            res.status(500).json({
                error: err
            });

        });

    }).catch(err => {

        // RETURN ERROR
        res.status(500).json({
            error: err
        });

    });
    
});

// MERCHANT LOGIN
router.post('/login', (req, res, next) => {

    var merchant = Merchant.schema.methods.find(req.body.email);
    merchant.then(merchant => {

        if(merchant === null) {
            return res.status(401).json({
                message: 'Auth failed!'
            });
        }

        var passwordMatch = Merchant.schema.methods.validPassword(req.body.password, merchant.password);
        passwordMatch.then(hash => {

            // TOKEN GENERATION
            const token = jwt.sign({
                email: merchant.email,
                merchantId: merchant._id
            }, 
                process.env.SECRET,
            {
                expiresIn: '24h'
            });

            // PASSWORD MATCH
            res.status(200).json({
                message: 'Auth successful',
                merchantId: merchant._id,
                merchantName: merchant.name,
                token: token
            });

        }).catch(err => {

            // RETURN ERROR
            res.status(401).json({
                message: 'Auth failed',
                error: err,
            });

        });

    }).catch(err => {

        // RETURN ERROR
        res.status(401).json({
            message: 'Auth failed',
            error: err,
        });

    });

});

// LOG OUT
router.post('/logout', checkAuth, (req, res, next) => {
    
    // RETURN MERCHANT INFO
    res.status(200).json({
        response: {
            code: 200,
            message: 'Log out successful',
            status: '',
        },
        result: {}
    });

});


module.exports = router;
