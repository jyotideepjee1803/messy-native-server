const express = require('express')
const CouponController = require('./controllers')
const verifyJWT = require('../../middleware/verifyJWT')
const checkAdmin = require('../../middleware/adminCheck')
const router = express.Router()

router.get('/', verifyJWT, CouponController.userCoupon)
router.get('/totalMeal', verifyJWT, checkAdmin, CouponController.totalMeals)
router.post('/scan', verifyJWT, checkAdmin, CouponController.scanCoupon)

module.exports = router;