import express from 'express'
import connectToDb from './database/db.js'
import dotenv from 'dotenv'
import activityRoute from './activity/activityRoutes.js'
import cors from 'cors'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));

app.use('/',activityRoute)


app.listen(3000,()=>{
    connectToDb()
    console.log("server running on port 3000 and database connected")
})
