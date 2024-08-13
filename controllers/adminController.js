const userModel = require("../models/userModel");


//donars list
const getDonarsListController = async(req,res) =>{
    try {
        const donarData = await userModel
        .find({role:'donar'})
        .sort({createdAt: -1});
        return res.status(200).send({
            success:'true',
            TotalCount: donarData.length,
            message:'Donar List Fetched Sucessfully',
            donarData,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:"Error In Donar List API",
            error,
        })
    }
};

//hospital list

const getHospitalListController = async(req,res) =>{
    try {
        const hospitalData = await userModel
        .find({role:'hospital'})
        .sort({createdAt: -1});
        return res.status(200).send({
            success:'true',
            TotalCount: hospitalData.length,
            message:'Hospital List Fetched Sucessfully',
            hospitalData,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:"Error In Donar List API",
            error,
        })
    }
};

//organistion list

const getOrganisationListController = async(req,res) =>{
    try {
        const orgData = await userModel
        .find({role:'organisation'})
        .sort({createdAt: -1});
        return res.status(200).send({
            success:'true',
            TotalCount: orgData.length,
            message:'Organisation List Fetched Sucessfully',
            orgData,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:"Error In Donar List API",
            error,
        })
    }
};

//delete functionality for donar
const deleteDonarController = async(req,res) =>{
    try {
        await userModel.findByIdAndDelete(req.params.id)
        return res.status(200).send({
            success:"true",
            message:"Record Deleted Successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success:"false",
            message:"Error while deleting record through admin",
            error
        });
    }
};

module.exports = {getDonarsListController, getHospitalListController, getOrganisationListController, deleteDonarController};