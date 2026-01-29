import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    activity:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    createdAt:{
        type:Date,
        default: Date.now
    }
})

export const activityModel = mongoose.model("Activity", activitySchema);