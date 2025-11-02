import mongoose from "mongoose";

const findItem = async (Model, id, options = {}) => {
    try {
        const item = await Model.findById(id, options);
        if (!item) {
            const error = new Error(`${Model.modelName} Item not found`);
            error.status = 404;
            throw error;
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