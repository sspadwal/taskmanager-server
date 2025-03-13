import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    priority: {
        type: String,
        enum: ['low', 'medium', 'high']
    },

    completed: {
        type: Boolean,
        default: false
    },

    user: {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true

    }
}, { timestamps: true });

const Task = mongoose.model('Task', TaskSchema)

export default Task;