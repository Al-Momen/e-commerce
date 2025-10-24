import User from "../../models/userModel.js";
const UserController = {};
UserController.index = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            success: true,
            message: "All users fetched successfully",
            count: users.length,
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

UserController.create = async (req, res, next) => {

    try {
        const user = await User.create(req.body);
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};
export default UserController;