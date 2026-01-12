
import { createJwtWebToken, createError, sendEmail } from "../../../helper/helper.js";
import { jwtSecretKey, smtpClientUrl } from "../../../helper/secret.js";
import jwt from 'jsonwebtoken';
import User from "../../../models/userModel.js";
import { successResponse } from "../../../helper/responseHandler.js";

const authController = {};

authController.register = async (req, res, next) => {

    try {
        const {
            first_name,
            last_name,
            username,
            email,
            phone,
            password,
            image,
            address
        } = req.body;

        const emailExists = await User.exists({ email });
        if (emailExists) {
            createError('User with this email already exists. Please login', 409);
        }
        const token = createJwtWebToken({ first_name, last_name, username, email, phone, password, image, address }, jwtSecretKey, { expiresIn: '5m' });

        const emailBody = {
            from: "ecommerce@gmail.com",
            to: email,
            subject: "Account Activation Email",
            text: "Hello Account Activation",
            html: `<h2> Hello ${email} </h2>
                    <p> Please Click Here <a href="${smtpClientUrl}/api/users/activate/${token}"> Activate your account </a></p>
                    `
        }

        // await sendEmail(emailBody);

        return successResponse(res, {
            statusCode: 201,
            message: "User get email and do this verify",
            payload: { token }
        })

    } catch (error) {
        next(error);
    }
};


authController.verify = async (req, res, next) => {
    try {
        
        const token = req?.body?.token;
        if (token === "undefined") createError('Token is undefined', 500);
        if (!token) createError('Token not found', 404);

        try {
            
            const decode = jwt.verify(token, jwtSecretKey);
            
            if (!decode) createError('Token not found', 401);

            const emailExists = await User.exists({ email: decode.email })
            if (emailExists) {
                createError('User with this email already exists. Please login', 409);
            }
            const newUser = await User.create(decode);
            return successResponse(res, {
                statusCode: 201,
                message: "User registered successfully",
                payload: { newUser }
            })

        } catch (error) {
            if (error.name === 'TokenExpiredError') return createError("Token has expired", 401);
            if (error.name === 'JsonWebTokenError') return createError('Invalid Token', 401);
            throw error;
        }

    } catch (error) {
        next(error);
    }

}

export default authController;