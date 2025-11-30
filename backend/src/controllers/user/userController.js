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

export default UserController;