
import bcrypt from "bcryptjs";
import { createJwtWebToken, createError, sendEmail } from "../../../helper/helper.js";
import { jwtSecretKey, smtpClientUrl } from "../../../helper/secret.js";
import jwt from 'jsonwebtoken';
import User from "../../../models/userModel.js";
import PasswordReset from "../../../models/passwordReset.js";
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

        const hashedPassword = await bcrypt.hash(password, 10);

        const token = createJwtWebToken(
            {
                first_name,
                last_name,
                username,
                email,
                phone,
                password: hashedPassword,
                image,
                address
            },
            jwtSecretKey,
            { expiresIn: '5m' }
        );

        const emailBody = {
            from: "ecommerce@gmail.com",
            to: email,
            subject: "Account Activation Email",
            text: "Hello Account Activation",
            html: `<h2> Hello ${email} </h2>
                    <p> Please Click Here <a href="${smtpClientUrl}/api/user/activate/${token}"> Activate your account </a></p>
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

        const token = req?.params?.token;
        if (token === "undefined") createError('Token is undefined', 500);
        if (!token) createError('Token not found', 404);

        let decode;
        try {
            decode = jwt.verify(token, jwtSecretKey);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                createError('Token has expired. Please register again', 401);
            }
            if (error.name === 'JsonWebTokenError') {
                createError('Invalid Token', 401);
            }
            createError(error.message || 'Invalid or malformed token', 401);
        }

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
        next(error);
    }

}

authController.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) createError('Invalid email or password', 401);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) createError('Invalid your password', 401);

        const authToken = createJwtWebToken(
            { id: user._id, email: user.email },
            jwtSecretKey,
            { expiresIn: '5m' }
        );

        res.cookie('token', authToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 5 * 60 * 1000
        });

        return successResponse(res, {
            statusCode: 200,
            message: "Login successful",
            payload: { user: { id: user._id, email: user.email, first_name: user.first_name, last_name: user.last_name } }
        });

    } catch (error) {
        next(error);
    }
};

authController.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) createError('Email is required', 400);

        const user = await User.findOne({ email });
        if (!user) createError('Invalid email ', 401);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await PasswordReset.deleteMany({ email });
        await PasswordReset.create({ email, otp });

        const emailBody = {
            from: "ecommerce@gmail.com",
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP is: ${otp}`,
            html: `<h2>Hello ${user.first_name}</h2>
                   <p>Your password reset OTP is: <strong>${otp}</strong></p>
                   <p>This OTP will expire in 3 minutes.</p>`
        };

        // await sendEmail(emailBody);

        return successResponse(res, {
            statusCode: 200,
            message: "OTP sent to your email"
        });

    } catch (error) {
        next(error);
    }
};

authController.verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        if (!email) createError('Email is required', 400);
        if (!otp) createError('OTP is required', 400);

        const resetRecord = await PasswordReset.findOne({ email, otp });

        if (!resetRecord) {
            createError('Invalid or expired OTP', 400);
        }

        // Extra safety - TTL delay 
        const otpAge = Date.now() - resetRecord.createdAt.getTime();
        if (otpAge > 3 * 60 * 1000) {
            createError('OTP has expired', 401);
        }

        resetRecord.verified = true;
        await resetRecord.save();

        const resetToken = createJwtWebToken({ email }, jwtSecretKey, { expiresIn: '5m' });

        return successResponse(res, {
            statusCode: 200,
            message: "OTP verified successfully",
            payload: { resetToken }
        });

    } catch (error) {
        next(error);
    }
};

authController.resetPassword = async (req, res, next) => {
    try {
        const { resetToken, newPassword, confirmPassword } = req.body;

        if (!resetToken) createError('Reset token is required', 400);
        if (!newPassword) createError('New password is required', 400);
        if (!confirmPassword) createError('Confirm password is required', 400)

        if (newPassword !== confirmPassword) {
            createError('Password and confirm password do not match', 400);
        }

        if (newPassword.length < 6) {
            createError('Password must be at least 6 characters long', 400);
        }

        let decoded;
        try {
            decoded = jwt.verify(resetToken, jwtSecretKey);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                createError('Reset session expired. Please verify OTP again', 401);
            }
            createError('Invalid reset token', 401);
        }

        const email = decoded.email;

        const resetRecord = await PasswordReset.findOne({ email, verified: true });
        if (!resetRecord) {
            createError('Please verify your OTP first', 403);
        }

        const user = await User.findOne({ email });
        if (!user) createError('User not found', 404);

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        await PasswordReset.deleteOne({ _id: resetRecord._id });
        
        return successResponse(res, {
            statusCode: 200,
            message: "Password reset successfully. Please login with your new password"
        });

    } catch (error) {
        next(error);
    }
};


export default authController;