import User from "../../models/userModel.js";
import { successResponse } from "../../helper/responseHandler.js";
import { findItem } from "../../services/findItem.js";
import deleteFileAsync from "../../services/deleteImage.js";

const UserController = {};

UserController.index = async (req, res, next) => {
    try {
        const { search = '', page = 1, limit = 10 } = req.query;
        const pageNum = Math.max(Number(page), 1);
        const limitNum = Math.max(Number(limit), 1);
        const skip = (pageNum - 1) * limitNum;
        const searchRegExp = new RegExp(search, "i");
        const filter = {
            is_admin: { $ne: true },
            $or: [
                { first_name: { $regex: searchRegExp } },
                { email: { $regex: searchRegExp } },
                { phone: { $regex: searchRegExp } }
            ]
        };

        const projection = { password: 0 };
        const [users, totalUsers] = await Promise.all([
            User.find(filter, projection)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum),
            User.countDocuments(filter)
        ]);
        const totalPages = Math.ceil(totalUsers / limitNum);

        return successResponse(res, {
            statusCode: 200,
            message: "Users fetched successfully",
            payload: {
                count: users.length,
                data: users,
                pagination: {
                    totalUsers,
                    totalPages,
                    currentPage: pageNum,
                    limit: limitNum,
                    prevPage: pageNum > 1 ? pageNum - 1 : null,
                    nextPage: pageNum < totalPages ? pageNum + 1 : null
                }
            }
        })

    } catch (error) {
        next(error);
    }
};

UserController.create = async (req, res, next) => {
    try {
        const user = await User.create(req.body);
        return successResponse(res, {
            statusCode: 201,
            message: "User create and fetched successfully",
            payload: { user }
        })
    } catch (error) {
        next(error);
    }
};

UserController.edit = async (req, res, next) => {
    try {
        const id = req.params.id;
        const options = { password: 0 };
        const user = await findItem(User, id, options);

        return successResponse(res, {
            statusCode: 200,
            message: "User fetched successfully",
            payload: { user }
        })
    } catch (error) {
        return next(error);
    }
};

UserController.delete = async (req, res, next) => {
    try {
        const id = req.params.id;
        const options = { password: 0 };
        const user = await findItem(User, id, options);

        // ---------Delete image-----------
        if (user.image) {
            await deleteFileAsync(user.image);
        }

        await user.deleteOne();

        return successResponse(res, {
            statusCode: 200,
            message: "User delete successfully"
        })
    } catch (error) {
        return next(error);
    }
};

UserController.register = async (req, res, next) => {
    try {
        const {
            first_name,
            last_name,
            username,
            email,
            password
        } = req.body;

        const emailExists = await User.exists({ email });
        if (emailExists) {
            createError('User with this email already exists. Please login', 409);
        }

        const token = createJwtWebToken({ first_name, last_name, username, email, password }, jwtSecretKey, { expiresIn: '10m' });

        const emailBody = {
            from: "ecommerce@gmail.com",
            to: email,
            subject: "Account Activation Email",
            text: "Hello Account Activation",
            html: `<h2> Hello ${email} </h2>
                    <p> Please Click Here <a href="${smtpClientUrl}/api/users/activate/${token}"> Activate your account </a></p>
                    `
        }

        await sendEmail(emailBody);

        return successResponse(res, {
            statusCode: 201,
            message: "User get email and do this verify",
            payload: { token }
        })

    } catch (error) {
        next(error);
    }
};

UserController.verify = async (req, res, next) => {
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

UserController.userUpdateData = async (req, res, next) => {
    try {
        const {
            phone,
            image,
            address
        } = req.body;


        const id = req.params.id;
        const options = { password: 0 };
        const [user, updatedUser] = await Promise.all([
            findItem(User, id, options),
            User.findByIdAndUpdate(
                id,
                { phone, image, address },
                { new: true, runValidators: true }
            )]);

        return successResponse(res, {
            statusCode: 201,
            message: "User updated successfully",
            payload: { updatedUser }
        })

    } catch (error) {
        next(error);
    }

}

export default UserController;