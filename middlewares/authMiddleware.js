// const JWT = require("jsonwebtoken");


// module.exports = async (req,res,next) =>{
//     try {
//         const token = req.headers['authorization'].split(" ")[1]
//         JWT.verify(token, process.env.JWT_SECRET, (err,decode) =>{
//             if(err){
//                 return res.status(401).send({
//                     success:false,
//                     message:"Auth failed"
//                 })
//             }
//             else{
//                 req.body.userId = decode.userId;
//                 next();
//             }
//         })
//     } catch (error) {
//         console.log(error);
//         return res.status(401).send({
//             success:false,
//             error,
//             message:"Auth failed"
//         });
//     }
// };
const JWT = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    try {
        // Check if the 'authorization' header exists in the request
        if (!req.headers['authorization']) {
            return res.status(401).send({
                success: false,
                message: "Authorization header missing"
            });
        }
        
        // Split the authorization header to get the token
        const token = req.headers['authorization'].split(" ")[1];
        
        // Verify the token
        JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                return res.status(401).send({
                    success: false,
                    message: "Auth failed"
                });
            } else {
                // Set the userId in the request body
                req.body.userId = decode.userId;
                next();
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(401).send({
            success: false,
            error,
            message: "Auth failed"
        });
    }
};
