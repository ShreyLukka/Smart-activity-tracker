import mongoose from "mongoose";

const summarySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    totalActivitiesToday: {
        type: Number,
        default: 0
    },
    totalActiveMinutes: {
        type: Number,
        default: 0
    },
    dominantActivity: {
        type: String,
        default: null
    },
    intensityScore: {
        type: Number,
        default: 0
    },


});

export const summaryModel = mongoose.model("Summary", summarySchema);
