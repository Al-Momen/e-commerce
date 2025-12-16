import mongoose from "mongoose";
import { createError } from "../helper/helper.js";

const findItem = async (Model, id, options = {}) => {
    try {
        const item = await Model.findById(id, options);
        if (!item) {
            createError(`${Model.modelName} Item not found`,400)
        }
        return item;
    } catch (error) {
        if (error instanceof mongoose.Error) {
            error = new Error("Database Internal Error");
            error.status = 500;
        }
        throw error;
    }

}
export { findItem }