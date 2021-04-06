const productCtrl = require('../controllers/product.controller');

const router = require('express').Router();

router.route('/products').get(productCtrl.getProducts).post(productCtrl.createProduct);

router.route('/products/:id').delete(productCtrl.deleteProduct).put(productCtrl.updateProduct);

module.exports = router;