const express = require('express');
const {getHospitalListController} = require('../controllers/adminController');
const router = express.Router();


router.get('/hospitals-list',getHospitalListController);

module.exports = router;