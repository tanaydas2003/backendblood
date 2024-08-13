const mongoose = require("mongoose");
const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");

const createInventoryController = async(req,res)=>{
    try {
        const {email} = req.body;
        const user  = await userModel.findOne({email});
        if(!user){
            throw new Error('User Not Found')
        }
        // if(inventoryType === "in" && user.role !== 'donar'){
        //     throw new Error('Not a donar account')
        // }
        // if(inventoryType === "out" && user.role !== 'hospital'){
        //     throw new Error('Not a hospital')
        // }

        if(req.body.inventoryType == 'out'){
            const requestedBloodGroup = req.body.bloodGroup
            const requestedQuantityOfBlood = req.body.quantity
            const organisation = new mongoose.Types.ObjectId(req.body.userId)
            //calculate Blood Quantity
            const totalInOfRequestedBlood = await inventoryModel.aggregate([
                {$match:{
                    organisation,
                    inventoryType: 'in',
                    bloodGroup:requestedBloodGroup
                }},{
                    $group:{
                        _id:'$bloodGroup',
                        total:{$sum : '$quantity'}
                    }
                }
            ])
            // console.log('Total In', totalInOfRequestedBlood);
            const totalIn = totalInOfRequestedBlood[0]?.total || 0
            //total out quantity

            const totalOutOfRequestedBloodGroup = await inventoryModel.aggregate([
                {$match:{
                    organisation,
                    inventoryType:'out',
                    bloodGroup:requestedBloodGroup
                }},
                {
                    $group:{
                        _id:'$bloodGroup',
                        total: {$sum : '$quantity'}
                    }
                }
            ])
            const totalOut = totalOutOfRequestedBloodGroup[0]?.total || 0;

            //in and out calculate
            const availableQuantityOfBloodGroup = totalIn - totalOut

            // quantity validation
            if(availableQuantityOfBloodGroup < requestedQuantityOfBlood){
                return res.status(500).send({
                    success:false,
                    message: `Only ${availableQuantityOfBloodGroup}ML of ${requestedBloodGroup.toUpperCase()} is available`
                })
            }
            req.body.hospital = user?._id;
        }
        else{
            req.body.donar = user?._id
        }

        //save record
        const inventory = new inventoryModel(req.body);
        await inventory.save()
        return res.status(200).send({
            success:'true',
            message:"New blood record added"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in Create Inventory API",
            error
        })
    }
};
//get all blood records
const getInventoryController = async (req,res)=>{
    try {
        const inventory = await inventoryModel.find({organisation:req.body.userId})
        .populate('donar').populate('hospital').sort({createdAt:-1})
        return res.status(201).send({
            success:true,
            message:"all records are displayed successfully",
            inventory,
        })
    } 
    catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message:"Error in Get Create Inventory",
            error
        })
    }
};
//get hospital blood records
const getInventoryHospitalController = async (req,res)=>{
    try {
        const inventory = await inventoryModel.
        find(req.body.filters)
        .populate('donar').populate('hospital').populate('organisation').sort({createdAt:-1})
        return res.status(201).send({
            success:true,
            message:"Get consumer records are displayed successfully",
            inventory,
        })
    } 
    catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message:"Error in Get Consumer Create Inventory",
            error
        })
    }
};

//Get blood records of 3
const getRecentInventoryController = async(req,res) =>{
    try {
        const inventory = await inventoryModel.find({
            organisation:req.body.userId
        }).limit(3).sort({createdAt: -1})
        return res.status(200).send({
            success:true,
            message:"Recent Inventory Data",
            inventory
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:"Error in recent API",
            error
        })
    }
};

//Get donar records
const getDonarsController = async (req,res) =>{
    try {
        const organisation = req.body.userId
        //find donars
        const donarId = await inventoryModel.distinct('donar',{
            organisation,
        });
        // console.log(donarId);
        const donars =  await userModel.find({_id: {$in: donarId}})
        return res.status(200).send({
            success: true,
            message: "Donar Record Fetched Successfully",
            donars,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message:'Error in Donar records',
            error
        })
    }
};


const getHospitalController =  async (req,res) =>{
    try {
        const organisation = req.body.userId
        //Get Hospital ID
        const hospitalId = await inventoryModel.distinct('hospital', {organisation,})
        //find hospital id
        const hospitals = await userModel.find({
            _id : {$in: hospitalId},
        });
        return res.status(200).send({
            success:true,
            message: "Hospitals Data Fetched Successfully",
            hospitals,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message:"Error in get Hospital API",
            error
        })
    }
};


const getOrganisationController = async (req,res) =>{
    try {
        const donar = req.body.userId
        const orgId = await inventoryModel.distinct('organisation',{donar})
        //find org
        const organisations = await userModel.find({
            _id: {$in: orgId}
        }) 
        return res.status(200).send({
            success:true,
            message:'Org Data Fetched Successfully',
            organisations,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message: "Error In ORG API",
            error
        })
    }
};


const getOrgnaisationForHospitalController = async (req, res) => {
    try {
      const hospital = req.body.userId;
      const orgId = await inventoryModel.distinct("organisation", { hospital });
      //find org
      const organisations = await userModel.find({
        _id: { $in: orgId },
      });
      return res.status(200).send({
        success: true,
        message: "Hospital Org Data Fetched Successfully",
        organisations,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Error In Hospital ORG API",
        error,
      });
    }
  };

module.exports  = { createInventoryController, getInventoryController, getDonarsController, getHospitalController, getOrganisationController, getOrgnaisationForHospitalController,getInventoryHospitalController, getRecentInventoryController};