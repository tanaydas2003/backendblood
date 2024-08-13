const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { json } = require("express");
const jwt = require("jsonwebtoken");

//register
const registerController = async(req,res) =>{
    try{
        const existingUser = await userModel.findOne({email:req.body.email})
        if (existingUser){
            return res.status(200).send({
                success:false,
                message:'User Already Exists'
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        req.body.password = hashedPassword

        const user = new userModel(req.body)
        await user.save()
        return res.status(201).send({
            success:true,
            message:'Registered Successfully',
            user
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error in Register API',
            error
        })
    }
};

//login
const loginController = async (req,res) =>{
    try{
        const user = await userModel.findOne({email:req.body.email})
        if(!user){
            return res.status(500).send({
                success:false,
                message:"User not found"
            })
        }

        if(user.role!== req.body.role){
            return res.status(500).send({
                success:false,
                message:"Role does not match"
            })
        }

        const comparePassword = await bcrypt.compare(req.body.password, user.password)
        if(!comparePassword){
            return res.status(500).send({
                success:false,
                message:"Password Incorrect"
            })
        }
        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET, {expiresIn:'1d'})
        return res.status(200).send({
            success:true,
            message:"Login Successfully",
            token,
            user,
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in Login Api",
            error
        })
    }
}

// Current User
const currentUserController = async (req,res) =>{
    try {
        const user = await userModel.findOne({ _id:req.body.userId })
        return res.status(200).send({
            success:true,
            message:"User fetched successfully",
            user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message:"Unable to get current user",
            error
        })
    }
}

module.exports = {registerController, loginController, currentUserController};