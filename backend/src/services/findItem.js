import mongoose from "mongoose";
<<<<<<< HEAD
import { createError } from "../helper/helper.js";
=======
import { createError } from "../../helper/helper.js";
>>>>>>> cbbebd8f78ae9911ee9006763f85d5882671dd47

const findItem = async (Model, id, options = {}) => {
    try {
        const item = await Model.findById(id, options);
        if (!item) {
<<<<<<< HEAD
            createError(`${Model.modelName} Item not found`,400)
=======
            createError(`${Model.modelName} Item not found`,404);
>>>>>>> cbbebd8f78ae9911ee9006763f85d5882671dd47
        }
        return item;
    } catch (error) {
        if (error instanceof mongoose.Error) {
            createError("Database Internal Error",500);
        }
        throw error;
    }

}
export { findItem }