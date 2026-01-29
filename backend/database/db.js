import mongoose from "mongoose";

async function connectToDb(){
    try{
        await mongoose.connect(process.env.MONGO_URI)
    }catch(err){
        console.log("Database error:", err)
    }
}

export default connectToDb