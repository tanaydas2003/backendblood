const express = require('express');
const {getOrganisationListController} = require('../controllers/adminController');
const router = express.Router();


router.get('/organizations-list',getOrganisationListController);

module.exports = router;