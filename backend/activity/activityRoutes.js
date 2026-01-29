import express from 'express'
import {addNewActivity} from './activityController.js'

const router = express.Router()

router.post("/activity",addNewActivity)


export default router