const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { bloodGroupDetailsContoller } = require("../controllers/analyticsController");


const router = express.Router();


//Get blood data
router.get('/bloodGroups-data', authMiddleware, bloodGroupDetailsContoller);


module.exports  =  router;
